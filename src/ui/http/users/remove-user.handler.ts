import {Handler} from "../type";
import {RemoveUserCommand} from "../../../api/commands/remove-user.command";
import {AuthorizedRequest} from "../middlewares";

export class RemoveUserHandler extends Handler {
  constructor(private readonly removeUserCmd: RemoveUserCommand) {
    super();
  }

  public async handler(req: AuthorizedRequest<{ Params: { userId: string } }>) {
    await this.removeUserCmd.execute({ userId: req.params.userId, currentUserId: req.user?.id! });
  }
}
