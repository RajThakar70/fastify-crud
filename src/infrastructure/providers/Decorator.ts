import { FastifyInstance } from 'fastify';
import { Auth } from './Auth';
export default class Decorator {
  public static init(fastifyServer: FastifyInstance): FastifyInstance {
    fastifyServer.decorateRequest('userDetails', null);
    fastifyServer.decorate(
      'validatePassword',
      Auth.verifyUserNamePassword(fastifyServer)
    );
    fastifyServer.decorate('validateJWT', Auth.verifyJWTToken(fastifyServer));
    return fastifyServer;
  }
}
