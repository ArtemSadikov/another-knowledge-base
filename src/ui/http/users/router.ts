import {RouteOptions} from "fastify";
import {Router} from "../type";
import {ListUsersHandler} from "./list-users.handler";

export class UsersRouter extends Router('users') {
  constructor(
    private readonly listUsersHandler: ListUsersHandler,
  ) {
    super();
  }

  protected routes: RouteOptions[] = [
    {
      url: this.listUsersHandler.url,
      method: this.listUsersHandler.method,
      handler: this.listUsersHandler.handle,
    },
  ];
}
