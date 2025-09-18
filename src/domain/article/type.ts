import {Article} from "./models";

export interface IArticleStore extends IArticleFinder, IArticleSaver, IArticleRemover {}

export type FindArticlesParams = Partial<{
  id: string;
  userId: string;
  published: boolean;
  tags: string[];
}>

export interface IArticleFinder {
  find(params: FindArticlesParams): Promise<Article[]>;
  findByID(id: string): Promise<Article>;
}

export interface IArticleSaver {
  save(...articles: Article[]): Promise<Article[]>;
}

export interface IArticleRemover {
  remove(...articles: Article[]): Promise<Article[]>;
}
