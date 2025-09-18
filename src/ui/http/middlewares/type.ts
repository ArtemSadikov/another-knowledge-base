import {FastifyRequest, RouteGenericInterface} from "fastify";
import {User} from "../../../domain/user";

export interface AuthorizedRequest<T extends RouteGenericInterface> extends FastifyRequest<T> {
  user?: User;
}
