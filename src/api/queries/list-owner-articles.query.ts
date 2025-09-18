import {Article, ArticleService} from "../../domain/article";
import {Query} from "../type";

type Request = {
  ownerId: string;
};

type Response = Article[];

export class ListOwnerArticlesQuery extends Query<Request, Response> {
  constructor(public readonly articlesService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    return this.articlesService.getUserArticles(req.ownerId);
  }
}
