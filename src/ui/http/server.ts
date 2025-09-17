import Fastify, {FastifyInstance} from 'fastify';

export class HttpServer {
  private readonly server: FastifyInstance

  constructor() {
    this.server = Fastify({ logger: true });
  }

  public async listen(port: number): Promise<void> {
    try {
      await this.server.listen({ port });
    } catch (error) {
      console.log(error);
    }
  }
}
