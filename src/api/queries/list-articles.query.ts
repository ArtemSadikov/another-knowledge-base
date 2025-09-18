import {Query} from "../type";
import {Article, ArticleService} from "../../domain/article";

type Request = {
  filters: Partial<{
    tags: string[]
  }>
};

type Response = Article[];

export class ListArticlesQuery extends Query<Request, Response> {
  constructor(private readonly articlesService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    return this.articlesService.findByTags(...(req.filters.tags ?? []));
  }
}
