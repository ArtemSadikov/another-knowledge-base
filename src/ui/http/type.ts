import type {
  FastifyInstance, FastifyReply, FastifyRequest,
  RouteOptions
} from "fastify";

export function Handler(params: Pick<RouteOptions, 'method' | 'url'>) {
  abstract class BaseHandler {
    public readonly method = params.method;

    public readonly url = params.url;

    public abstract handle(req: FastifyRequest, reply: FastifyReply): any;

    public readonly handler = this.handle;
  }

  return BaseHandler;
}

export interface IRouter {
  register(server: FastifyInstance): FastifyInstance
}

export function Router(path: string) {
  abstract class BaseRouter implements IRouter {
    protected abstract readonly routes: RouteOptions[];

    public register(server: FastifyInstance): FastifyInstance {
      return server.register((app, _, next) => {
        for (const route of this.routes) {
          app.route(route)
        }

        next();
      }, { prefix: path })
    };
  }

  return BaseRouter;
}

