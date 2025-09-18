import {IHandler, Router} from "../type";
import {AuthGuard} from "../middlewares";
import {RemoveUserHandler} from "./remove-user.handler";

export class UsersRouter extends Router('users') {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly removeUserHandler: RemoveUserHandler,
  ) {
    super();
  }

  protected routes: IHandler[] = [
    {
      // @ts-ignore
      handler: this.removeUserHandler.handler,
      url: '/:id',
      onRequest: [this.authGuard.handler],
      method: 'DELETE',
    }
  ];
}
