import {Middleware} from "../type";
import {FastifyRequest} from "fastify";
import {AuthorizeCommand} from "../../../api/commands/authorize.command";

export class AuthGuard extends Middleware('auth') {
  constructor(
    private readonly authCommand: AuthorizeCommand
  ) {
    super();
  }

  public async handler(req: FastifyRequest) {
    if (!req.headers.authorization) {
      throw new Error("Not authorized");
    }

    await this.authCommand.execute({ token: req.headers.authorization });
  };
}
