import path from 'path';
import dotenv from 'dotenv';
import { FastifyInstance, FastifyError } from 'fastify';

class Locals {
  public static config(): any {
    dotenv.config({ path: path.join(__dirname, '../../../.env') });

    const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
    const port = process.env.PORT || 5000;
    const appSecret = process.env.APP_SECRET || 'My App Secret';
    const mongooseUrl = process.env.MONGOOSE_URL;
    const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || 50 * 1024 * 1024; //in mb
    const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || 100;

    const name = process.env.APP_NAME || 'NodeTS API Server';
    const isCORSEnabled = process.env.CORS_ENABLED || true;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
    const apiPrefix = process.env.API_PREFIX || 'api';

    const logDays = process.env.LOG_DAYS || 10;
    const bcryptSaltRoundMax = process.env.BCRYPT_SALT_ROUNDS_MAX || 10;

    const fileDownloadPath =
      process.env.FILE_DOWNLOAD_PATH || '/misc/file/download';

    const tokenExpireTime = process.env.TOKEN_EXPIRE_TIME || 1000 * 60 * 60 * 8 + 1234;

    return {
      appSecret,
      apiPrefix,
      isCORSEnabled,
      jwtExpiresIn,
      logDays,
      maxUploadLimit,
      maxParameterLimit,
      mongooseUrl,
      name,
      port,
      url,
      bcryptSaltRoundMax,
      fileDownloadPath,
      tokenExpireTime
    };
  }

  public static init(fastifyApp: FastifyInstance): FastifyInstance {
    const data = Locals.config();
    // fastifyApp.decorate('locals', data);
    // fastifyApp.decorateRequest('locals', { ...data });

    fastifyApp.decorateRequest('locals', null);
    fastifyApp.addHook('onRequest', async (req, reply) => {
      req.locals = { ...data };
    });
    return fastifyApp;
  }
}

export default Locals;
