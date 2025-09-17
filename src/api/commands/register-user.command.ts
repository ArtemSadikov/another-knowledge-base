import {Command} from "../type";
import {UsersService} from "../../domain/user";

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
  ) {
    super();
  }

  public async execute(req: Request): Promise<Response> {
    const user = await this.usersService.createUser(
      req.email,
      req.password,
    );

    console.log(user);

    throw new Error("Method not implemented.");
  }
}
