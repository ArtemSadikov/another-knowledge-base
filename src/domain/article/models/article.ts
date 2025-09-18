import {ArticleAuthor} from "./article-author";

export class Article {
  constructor(
    public readonly id: string,
    private _title: string,
    private _content: string,
    private _published: boolean,
    public readonly author: ArticleAuthor,
    private _tags: string[],
    private _isDeleted: boolean = false,
  ) {}

  public static new(title: string, content: string, authorId: string): Article {
    return Article.from(crypto.randomUUID(), title, content, false, authorId, [], false);
  }

  public static from(
    id: string,
    title: string,
    content: string,
    published: boolean,
    authorId: string,
    tags: string[],
    isDeleted: boolean
  ): Article {
    const author = new ArticleAuthor(authorId);

    return new Article(
      id,
      title,
      content,
      published,
      author,
      tags,
      isDeleted
    )
  }

  public setTags(tags: string[]) {
    this._tags = tags;
  }

  public editTitle(title: string): void {
    this._title = title;
  }

  public editContent(content: string): void {
    this._content = content;
  }

  public publish(): void {
    this._published = true;
  }

  public unpublish(): void {
    this._published = false;
  }

  public get title(): string {
    return this._title;
  }

  public get content(): string {
    return this._content;
  }

  public get published(): boolean {
    return this._published;
  }

  public archive() {
    this._published = false;
    this._isDeleted = true;
  }

  public get tags() {
    return this._tags;
  }

  public get isDeleted() {
    return this._isDeleted;
  }
}
