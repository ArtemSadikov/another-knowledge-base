import {Command} from "../type";
import {ArticleService} from "../../domain/article";

type Request = {
  currentUserId: string;
  articleId: string;
};

type Response = void;

export class PublishArticleCommand extends Command<Request, Response> {
  constructor(private readonly articleService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const article = await this.articleService.getByID(req.articleId);

    if (article.author.userId !== req.currentUserId) {
      throw new Error('Cannot unpublish another user');
    }

    await this.articleService.publish(article);
  }
}
