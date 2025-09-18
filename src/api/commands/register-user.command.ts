import {Command} from "../type";
import {UsersService} from "../../domain/user";
import {AuthorizationService} from "../../domain/auth";

type Request = {
  email: string;
  password: string;
}

type Response = {
  accessToken: string;
}

export class RegisterUserCommand extends Command<Request, Promise<Response>> {
  constructor(
    private readonly usersService: UsersService,
    private readonly authorizationService: AuthorizationService,
  ) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const user = await this.usersService.createUser(
      req.email,
      req.password,
    );

    const accessToken = await this.authorizationService.generateToken(user.id);

    return { accessToken };
  }
}
