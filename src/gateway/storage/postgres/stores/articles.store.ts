import {Article, FindArticlesParams, IArticleStore} from "../../../../domain/article";
import {Postgres} from "../database";
import {NotFound} from "../../../../common/errors";

export class ArticlesStore implements IArticleStore {
  constructor(public readonly db: Postgres) {}

  public async find(params: FindArticlesParams): Promise<Article[]> {
    let query = `
      SELECT articles.id,
             articles.title,
             articles.content,
             articles.published,
             articles.author_id,
             articles.deleted_at,
             array_agg(t.title) tags
      FROM articles
      LEFT JOIN public.articles_tags a on articles.id = a.article_id
      LEFT JOIN public.tags t on articles.title = t.title
      WHERE 1 = 1
    `;
    const values = [];

    if (params.id) {
      values.push(params.id);
      query += `AND id = $${values.length}`;
    }

    if (params.userId) {
      values.push(params.userId);
      query += `AND a.author_id = $${values.length};`;
    }

    if (params.published) {
      values.push(params.published);
      query += `AND a.published = $${values.length};`;
    }

    if (params.tags?.length) {
      query += `AND t.title IN (${params.tags.map((_, i) => `${i+1+values.length}`)})`;
      values.push(...params.tags);
    }

    query += `GROUP BY 1,2,3,4,5,6`;

    const { rows } = await this.db.pg.query({
      text: query,
      values,
    });

    if (!rows.length) {
      throw new NotFound();
    }

    return rows.map(r => Article.from(
      r.id, r.title, r.content, r.published, r.author_id, r.tags, Boolean(r.deleted_at)
    ))
  }

  public async findByID(id: string): Promise<Article> {
    throw new Error("Method not implemented.");
  }

  public async save(...articles: Article[]): Promise<Article[]> {
    const res: Article[] = [];

    if (!articles.length) {
      return res;
    }

    await this.db.pg.query('START TRANSACTION');

    const query = `
      INSERT INTO articles(id, title, content, published, author_id, deleted_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id)
      DO UPDATE SET title = excluded.title,
                    content = excluded.content,
                    published = excluded.published,
                    author_id = excluded.author_id,
                    deleted_at = excluded.deleted_at,
                    updated_at = now()
      RETURNING *
    `;

    try {
      for (const article of articles) {
        const { rows } = await this.db.pg.query({
          text: query,
          values: [
            article.id,
            article.title,
            article.content,
            article.published,
            article.author.userId,
            article.isDeleted ? Date.now() : null
          ],
        });

        if (article.tags.length) {
          const { rows: art } = await this.db.pg.query({
            text: `
              INSERT INTO articles_tags(article_id, tag_id)
              SELECT $1, id FROM tags
              WHERE title IN (${article.tags.map((_, i) => `$${i + 2}`).join(',')})
              ON CONFLICT DO NOTHING
              RETURNING title
            `,
            values: [rows[0].id, ...article.tags]
          });

          if (art.length) {
            await this.db.pg.query({
              text: `
                  DELETE
                  FROM articles_tags
                  WHERE NOT (
                      (article_id, tag_id) IN (${art.map((_, i) => `($${i + 1}, $${i + 2})`)})
                  )
              `
            })
          }
        }

        const { rows: tgs } = await this.db.pg.query({
          text: `
            select title from tags
            where title in (${article.tags.map((_, i) => `$${i+1}`).join(',')})
          `,
          values: [article.tags],
          rowMode: 'array'
        });

        res.push(Article.from(
          rows[0].id,
          rows[0].title,
          rows[0].content,
          rows[0].published,
          rows[0].author_id,
          tgs.flat(1),
          rows[0].is_deleted,
        ))
      }

      await this.db.pg.query('COMMIT');
    } catch (error) {
      await this.db.pg.query('ROLLBACK');

      throw error
    }

    return res;
  }

  public async remove(...articles: Article[]): Promise<Article[]> {
    throw new Error("Method not implemented.");
  }
}
