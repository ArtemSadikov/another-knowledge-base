import {ITokenSigner} from "../../domain/auth";
import {SignTokenOptions, Token, TokenPayload} from "../../domain/auth/type";
import jwt from 'jsonwebtoken';
import ms from "ms";

export class JwtTokenService implements ITokenSigner {
  constructor(
    private readonly secret: string,
  ) {}

  public async generate(payload: TokenPayload, opts: SignTokenOptions = { expiresIn: '1H' }): Promise<Token> {
    return jwt.sign(payload, this.secret, { expiresIn: opts.expiresIn as ms.StringValue })
  }

  public async verify(token: Token): Promise<TokenPayload> {
    const res = jwt.verify(token, this.secret)


    return res as TokenPayload;
  }
}
