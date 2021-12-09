import { errorBuilder } from './../../utils/builders';
import {
  FastifyInstance,
  FastifyError,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import { ServerResponse } from 'http';

class ErrorHandler {
  public static notFoundHandler(
    server: FastifyInstance,
    options: any,
    callback: (error?: FastifyError) => void
  ) {
    server.setNotFoundHandler((req: FastifyRequest, rep: FastifyReply) => {
      server.log.error(`Route ${req.raw.url} does not exists`);
      rep.code(404).send({ error: 'not found' });
    });
    callback();
  }

  public static unexpectedErrorHandler(
    server: FastifyInstance,
    options: any,
    callback: (error?: FastifyError) => void
  ) {
    server.setErrorHandler(
      (error: FastifyError, req: FastifyRequest, rep: FastifyReply) => {
        console.log(
          '••••••••••••••••••••• unexpectedErrorHandler •••••••••••••••••••••\n',
          error,
          '\n••••••••••••••••••••• unexpectedErrorHandler •••••••••••••••••••••'
        );
        server.log.error(
          `Something happened while serving ${req.raw.url}`,
          error
        );
        if (error.validation) {
          rep.status(422).send(error);
        }

        if (error.name === 'JsonWebTokenError') {
          rep.code(401).send(errorBuilder('invalid token'));
        }
        rep.code(500).send(errorBuilder('something went wrong'));
      }
    );
    callback();
  }
}

export default ErrorHandler;
