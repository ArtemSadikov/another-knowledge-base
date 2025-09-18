import {IHandler, Router} from "../type";
import {AuthGuard} from "../middlewares";
import {RemoveUserHandler} from "./remove-user.handler";
import {UpdateUserHandler} from "./update-user.handler";

export class UsersRouter extends Router('users') {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly removeUserHandler: RemoveUserHandler,
    private readonly updateUserHandler: UpdateUserHandler,
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
    },
    {
      // @ts-ignore
      handler: this.updateUserHandler.handler,
      url: '/:id',
      onRequest: [this.authGuard.handler],
      method: 'PATCH',
    },
  ];
}
