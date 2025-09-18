import {UserEmail} from "./email";

export class User {
  private constructor(
    public readonly id: string,
    private _email: UserEmail,
    private _password: string = '',
    private _isDeleted: boolean = false,
  ) {}

  public static new(email: string): User {
    return this.from(crypto.randomUUID(), email, false);
  }

  public static from(id: string, email: string, isDeleted: boolean = false): User {
    return new User(id, new UserEmail(email), '', isDeleted);
  }

  public setPassword(value: string) {
    this._password = value;
  }

  public get password() {
    return this._password;
  }

  public remove() {
    this._isDeleted = true;
  }

  public get isDeleted() {
    return this._isDeleted;
  }

  public get email(): UserEmail {
    return this._email;
  }

  updateEmail(email: string): void {
    this._email = new UserEmail(email);
  }
}
