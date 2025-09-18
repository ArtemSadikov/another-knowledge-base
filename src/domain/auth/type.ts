export type Token = string;

export type SignTokenOptions = {
  expiresIn: string;
}

export type TokenPayload = {
  uid: string;
}

export interface ITokenSigner<Payload extends TokenPayload = TokenPayload> {
  generate(payload: Payload, opts?: SignTokenOptions): Promise<Token> | Token;
  verify(token: Token): Promise<Payload> | Payload;
}
