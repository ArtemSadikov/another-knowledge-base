import {Command} from "../type";
import {Article, ArticleService} from "../../domain/article";

type Request = {
  userId: string;
  data: {
    title: string;
    content: string;
    tags: string[];
  };
};

type Response = Article;

export class CreateArticleCommand extends Command<Request, Response> {
  constructor(private readonly articlesService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    return this.articlesService.create(
      req.data.title,
      req.data.content,
      req.userId,
      req.data.tags,
    )
  }
}
