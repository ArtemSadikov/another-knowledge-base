import {AuthorizationService} from "../../domain/auth";
import {Command} from "../type";
import {UsersService} from "../../domain/user";

type Request = {
  token: string;
};

type Response = void;

export class AuthorizeCommand extends Command<Request, Response> {
  constructor(
    private readonly authService: AuthorizationService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const payload = await this.authService.authorize(req.token);

    await this.usersService.findByID(payload.uid);
  }
}
