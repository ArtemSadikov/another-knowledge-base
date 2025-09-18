import {Middleware} from "../type";
import {FastifyRequest} from "fastify";
import {AuthorizeCommand} from "../../../api/commands/authorize.command";
import {AuthorizedRequest} from "./type";
import {Bind} from "../../../utils/decorators/bind";

export class AuthGuard extends Middleware('auth') {
  constructor(
    private readonly authCommand: AuthorizeCommand
  ) {
    super();
  }

  @Bind
  public async handler(req: FastifyRequest) {
    if (!req.headers.authorization) {
      throw new Error("Not authorized");
    }

    (req as AuthorizedRequest).user = await this.authCommand.execute({token: req.headers.authorization});
  };
}
