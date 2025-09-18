import {Command} from "../type";
import {User, UsersService} from "../../domain/user";

type Request = {
  userId: string;
  currentUserId: string;
  data: Partial<{
    email: string;
  }>
}

type Response = User;

export class UpdateUserCommand extends Command<Request, Response> {
  constructor(
    private readonly usersService: UsersService,
  ) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const user = await this.usersService.findByID(req.userId);

    if (user.id !== req.currentUserId) {
      throw new Error('Cannot update another user');
    }

    if (req.data.email) {
      user.updateEmail(req.data.email);
    }

    return this.usersService.update(user);
  }
}
