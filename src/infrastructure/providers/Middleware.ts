import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import cors from 'cors';
import compress from 'compression';
import hidePoweredBy from 'hide-powered-by';

class Middleware {
  public static mount(server: FastifyInstance) : FastifyInstance {
    server.use(cors())
    server.use(compress());
    server.use(hidePoweredBy());
    return server;
  }
}

export default Middleware;