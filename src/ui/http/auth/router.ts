import {IHandler, Router} from "../type";
import {RegisterUserHandler} from "./register-user.handler";

export class AuthRouter extends Router('/auth') {
  constructor(
    private readonly registerUser: RegisterUserHandler,
  ) {
    super();
  }

  protected routes: IHandler[] = [
    {
      method: 'POST',
      url: '/register',
      handler: this.registerUser.handler,
    },
  ];
}
