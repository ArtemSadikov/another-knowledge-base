import {Command} from "../type";
import {UsersService} from "../../domain/user";

type Request = {
  userId: string;
  currentUserId: string;
}

type Response = void

export class RemoveUserCommand extends Command<Request, Response> {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const user = await this.usersService.findByID(req.userId);

    if (user.id !== req.currentUserId) {
      throw new Error('Cannot remove another user');
    }

    await this.usersService.remove(user);
  }
}
