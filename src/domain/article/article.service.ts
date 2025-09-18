import {FindArticlesParams, IArticleStore} from "./type";
import {Article} from "./models";

export class ArticleService {
  constructor(private readonly articlesStore: IArticleStore) {}

  public async create(title: string, content: string, authorId: string, tags: string[]): Promise<Article> {
    const article = Article.new(title, content, authorId);

    if (tags.length > 0) {
      article.setTags(tags)
    }

    const [res] = await this.articlesStore.save(article);

    return res;
  }

  public async unpublish(article: Article): Promise<void> {
    article.unpublish();

    await this.articlesStore.save(article);
  }

  public async publish(article: Article): Promise<void> {
    article.publish();

    await this.articlesStore.save(article);
  }

  public async remove(id: string): Promise<void> {
    const article = await this.articlesStore.findByID(id);

    article.archive();

    await this.articlesStore.save(article);
  }

  public async update(article: Article): Promise<Article> {
    const [res] = await this.articlesStore.save(article);

    return res;
  }

  public async getUserArticles(userId: string, published: boolean | null = null): Promise<Article[]> {
    const query: FindArticlesParams = { userId };

    if (published !== null) {
      query.published = published;
    }

    return this.articlesStore.find(query);
  }

  public async getByID(id: string): Promise<Article> {
    return this.articlesStore.findByID(id);
  }

  public async findByTags(...tags: string[]): Promise<Article[]> {
    return this.articlesStore.find({ tags });
  }
}
