import {Command} from "../type";
import {Article, ArticleService} from "../../domain/article";

type Request = {
  articleId: string;
  data: Partial<{
    title: string;
    content: string;
  }>
};

type Response = Article;

export class UpdateArticleCommand extends Command<Request, Response> {
  constructor(private readonly articleService: ArticleService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const article = await this.articleService.getByID(req.articleId);

    if (req.data.title) {
      article.editTitle(req.data.title);
    }

    if (req.data.content) {
      article.editContent(req.data.content);
    }

    return this.articleService.update(article);
  }
}
