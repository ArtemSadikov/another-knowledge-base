import { FastifyRequest, FastifyReply } from "fastify";
import {Handler} from "../type";
import {UpdateUserCommand} from "../../../api/commands/update-user.command";
import {Bind} from "../../../utils/decorators/bind";
import {AuthorizedRequest} from "../middlewares";

export class UpdateUserHandler extends Handler {
  constructor(private readonly updateUserEmailCommand: UpdateUserCommand) {
    super();
  }

  @Bind
  public async handler(req: AuthorizedRequest<{ Body: { email?: string }; Params: { id: string } }>, reply: FastifyReply) {
    await this.updateUserEmailCommand.execute({
      userId: req.params.id,
      currentUserId: req.user?.id!,
      data: req.body,
    });
  }
}
