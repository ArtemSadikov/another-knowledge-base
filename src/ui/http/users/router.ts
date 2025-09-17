import {RouteOptions} from "fastify";
import {Router} from "../type";

export class UsersRouter extends Router('users') {
  constructor() {
    super();
  }

  protected routes: RouteOptions[] = [
  ];
}
