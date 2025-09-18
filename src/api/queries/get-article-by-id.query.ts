import {Command} from "../type";
import {Article, ArticleService} from "../../domain/article";

type Request = {
  id: string;
};

type Response = Article

export class GetArticleByIdQuery extends Command<Request, Response> {
  constructor(private readonly articleService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    return this.articleService.getByID(req.id);
  }
}
