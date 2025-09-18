import {
  FastifyInstance, FastifyReply, FastifyRequest, RouteHandler, RouteHandlerMethod,
  RouteOptions
} from "fastify";

export interface IMiddleware {
  name: string;
  handler: RouteHandlerMethod<any, any, any, any, any>
}

export function Middleware(name: string) {
  abstract class BaseMiddleware implements IMiddleware {
    public readonly name: string = name;

    public abstract handler(req: FastifyRequest, reply: FastifyReply): any
  }

  return BaseMiddleware;
}

export interface IHandler extends Pick<RouteOptions, 'method' | 'url'> {
  guards?: IMiddleware[];
  handler: RouteHandlerMethod<any, any, any, any, any>
}

export abstract class Handler<Req = FastifyRequest> {
  public abstract handler(req: Req, reply: FastifyReply): any;
}

export interface IRouter {
  register(server: FastifyInstance): FastifyInstance
}

export function Router(path: string) {
  abstract class BaseRouter implements IRouter {
    protected abstract readonly routes: IHandler[];

    public register(server: FastifyInstance & { auth: RouteHandler }): FastifyInstance {
      return server.register((app, _, next) => {
        for (const route of this.routes) {
          app.route({ ...route, onRequest: [server.auth] })
        }

        next();
      }, { prefix: path })
    };
  }

  return BaseRouter;
}

