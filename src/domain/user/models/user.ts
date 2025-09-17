import {UserEmail} from "./email";

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: UserEmail,
    private _password: string = '',
  ) {}

  public static new(email: string): User {
    return this.from(crypto.randomUUID(), email);
  }

  public static from(id: string, email: string): User {
    return new User(id, new UserEmail(email));
  }

  public setPassword(value: string) {
    this._password = value;
  }

  public get password() {
    return this._password;
  }
}
