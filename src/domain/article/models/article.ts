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

  public static new(title: string, content: string, author: ArticleAuthor): Article {
    return new Article(crypto.randomUUID(), title, content, false, author, []);
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

  public tags() {
    return this._tags;
  }
}
