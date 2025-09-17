import {Handler} from "../type";
import {FastifyReply, FastifyRequest} from "fastify";

export class ListUsersHandler extends Handler({url: '/', method: 'GET'}) {
  public handle(_: FastifyRequest, __: FastifyReply) {
    throw new Error("Method not implemented.");
  }
}
