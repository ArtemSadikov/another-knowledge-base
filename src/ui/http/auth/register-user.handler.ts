import { FastifyRequest, FastifyReply } from "fastify";
import {Handler} from "../type";
import {RegisterUserCommand} from "../../../api/commands";
import {Bind} from "../../../utils/decorators/bind";
import {InvalidArgumentError} from "../../../common";

type Body = {
  email: string;
  password: string;
}

export class RegisterUserHandler extends Handler {
  constructor(
    private readonly registerUserCommand: RegisterUserCommand,
  ) {
    super();
  }

  @Bind
  public async handler(req: FastifyRequest<{ Body: Body }>, reply: FastifyReply) {
    if (!req.body) {
      throw new InvalidArgumentError('invalid argument');
    }

    const res = await this.registerUserCommand.execute({
      email: req.body.email,
      password: req.body.password
    });

    reply.send({ data: res });
  }
}
