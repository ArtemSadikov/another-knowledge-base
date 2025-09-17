import Fastify, {FastifyInstance} from 'fastify';

class HttpServer {
  constructor(private readonly server: FastifyInstance) {
    this.server = Fastify({
      logger: true,
    });
  }

  public async listen(port: number) {
    try {
      await this.server.listen({ port });
    } catch (error) {
      console.log(error);
    }
  }
}
