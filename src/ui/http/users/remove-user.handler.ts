import {Handler} from "../type";
import {RemoveUserCommand} from "../../../api/commands/remove-user.command";
import {AuthorizedRequest} from "../middlewares";
import {Bind} from "../../../utils/decorators/bind";

export class RemoveUserHandler extends Handler {
  constructor(private readonly removeUserCmd: RemoveUserCommand) {
    super();
  }

  @Bind
  public async handler(req: AuthorizedRequest<{ Params: { id: string } }>) {
    await this.removeUserCmd.execute({ userId: req.params.id, currentUserId: req.user?.id! });
  }
}
