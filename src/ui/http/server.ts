import Fastify, {FastifyInstance} from 'fastify';
import {IRouter} from "./type";

export class HttpServer {
  private readonly server: FastifyInstance

  private readonly routers: IRouter[] = [];

  constructor(...routers: IRouter[]) {
    this.server = Fastify({ logger: true });
    this.routers = routers;
  }

  public async register(path: string) {
    this.server.register((app, _, next) => {
      for (const router of this.routers) {
        router.register(app)
      }

      next();
    }, { prefix: path });
  }

  public async listen(port: number): Promise<void> {
    try {
      await this.server.listen({ port });
    } catch (error) {
      console.log(error);
    }
  }
}
