import fastify from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance {
    locals: any;
    logger: {
      file: string;
    };
    validatePassword(): void;
    validateJWT(): void;
  }

  export interface FastifyLoggerOptions {
    file: string;
  }

  export interface FastifyRequest {
    locals: any;
    userDetails: any;
  }
}
