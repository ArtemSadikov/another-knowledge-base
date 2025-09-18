import {IHandler, Router} from "../type";
import {AuthGuard} from "../middlewares";

export class UsersRouter extends Router('users') {
  constructor(
    private readonly authGuard: AuthGuard,
  ) {
    super();
  }

  protected routes: IHandler[] = [];
}
