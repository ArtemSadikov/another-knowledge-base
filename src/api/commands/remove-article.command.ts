import {Command} from "../type";
import {ArticleService} from "../../domain/article";

type Request = {
  articleId: string;
};

type Response = void;

export class RemoveArticleCommand extends Command<Request, Response> {
  constructor(private readonly articleService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    await this.articleService.remove(req.articleId);
  }
}
