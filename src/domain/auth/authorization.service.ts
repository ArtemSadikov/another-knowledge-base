import {ITokenSigner, Token, TokenPayload} from "./type";

export class AuthorizationService {
  constructor(private readonly token: ITokenSigner) {}

  public async generateToken(userId: string): Promise<Token> {
    return this.token.generate({uid: userId});
  }

  public async authorize(token: Token): Promise<TokenPayload> {
    const payload = await this.token.verify(token);

    if (!payload) {
      throw new Error("Unable to verify token");
    }

    return payload;
  }
}
