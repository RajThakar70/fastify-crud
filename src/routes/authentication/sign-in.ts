import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';
import FastifyApp from '../../infrastructure/providers/FastifyApp';
import Locals from '../../infrastructure/providers/Locals';
import { errorBuilder } from '../../utils/builders';

export class SignInUser {
  public static async perform(
    req: FastifyRequest<{ Body: any }>,
    rep: FastifyReply
  ): Promise<any> {
    try {
      const { email, password } = req.body;

      const userDB = await User.findOne({ email: email });
      if (!userDB) {
        rep.code(404);
        return errorBuilder('sign in failed');
      }

      const isPasswordMatch = await bcrypt.compare(password, userDB.password);
      if (!isPasswordMatch) {
        rep.code(401);
        return errorBuilder('sign in failed');
      }

      const JWT = FastifyApp.fastifyServer.jwt;
      const tokenIssueTime = Date.now();
      const tokenExpireTime = tokenIssueTime + Locals.config().tokenExpireTime;

      const token = JWT.sign({
        userId: userDB._id,
        exp: tokenExpireTime,
        iat: tokenIssueTime,
        permission: userDB.permission,
        name: userDB.name,
      });
     
      const data = JWT.verify(token);

      rep.code(200);
      return { message: { token, permission: userDB.permission } };
      
    } catch (err) {
      rep.code(500);
      return err;
    }
  }
}
