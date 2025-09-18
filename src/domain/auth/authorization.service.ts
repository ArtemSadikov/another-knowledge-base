import {ITokenSigner, Token} from "./type";

export class AuthorizationService {
  constructor(private readonly token: ITokenSigner) {}

  public async generateToken(userId: string): Promise<Token> {
    return this.token.generate({uid: userId});
  }

  public async authorize(userId: string, token: Token): Promise<void> {
    const payload = await this.token.verify(token);

    if (!payload) {
      throw new Error("Unable to verify token");
    }

    if (payload.uid !== userId) {
      throw new Error("Not matched user for token");
    }
  }
}
