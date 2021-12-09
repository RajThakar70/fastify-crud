import User from '../../models/user.model';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import Locals from './Locals';
import { errorBuilder } from '../../utils/builders';

export class Auth {
  public static verifyUserNamePassword(fastifyServer: FastifyInstance) {
    return function (request, reply, done) {
      console.log('VALIDATION: PASSWORD');
      console.log(
        '🚀 ~ file: Auth.ts ~ line 10 ~ Auth ~ FastifyInstance',
        fastifyServer.jwt
      );
      done();
    };
  }

  public static verifyJWTToken(fastifyServer: FastifyInstance) {
    return async function (request: FastifyRequest, reply: FastifyReply, done) {
      console.log(
        '‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡ VALIDATION: JWT ‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡‡'
        );
        console.log("🚀 ~ file: Auth.ts ~ line 24 ~ Auth ~ request?.headers", request?.headers)
      const authToken = request?.headers?.authorization?.split(' ')[1];
      const JWT = fastifyServer.jwt;

      if (!authToken) {
        reply.code(401).send({ error: 'invalid token' });
      }

      try {
        const { userId, iat, exp } = JWT.verify(authToken);

        const tokenExpireTime = Locals.config().tokenExpireTime;

        const currentTimeStamp = Date.now();

        const userDB = await User.findOne({ _id: userId });

        if (exp - iat !== tokenExpireTime) {
          reply.code(401).send({ error: 'invalid token' });
        }

        if(currentTimeStamp > exp) {
          reply.code(401).send({ error: 'token expired' });
        }

        if (!userDB) {
          reply.code(401).send({ error: 'invalid token' });
        }

        request.userDetails = {
          ...userDB.toJSON(),
        };
      } catch (error) {
        return done(error);
      }
    };
  }

  public static canUserAccess(accessPermission) {
    return async (
      request: FastifyRequest,
      response: FastifyReply,
    ) => {
      try {
        const { permission = [] } = request.userDetails;
        console.log("🚀 ~ file: Auth.ts ~ line 67 ~ Auth ~ canUserAccess ~ request.userDetails", request.userDetails);
        const hasPermission = accessPermission.reduce((finalPermission, currentPermission) => {
          if(permission.indexOf(currentPermission) !== -1){
            return finalPermission || true;
          } else {
            return finalPermission || false;
          }
        }, false);

        if(hasPermission){
          return;
        }

        throw new Error("Permission denied!")
        
      } catch (error) {
        response.code(403);
        response.send(errorBuilder(error.message));
      }
    };
  }
}
