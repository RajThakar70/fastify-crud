import { CreateUser, UpdateUser, GetUser, DeleteUser } from './user-crud';
import { HTTPMethods } from 'fastify';
import { ADMIN } from '../../utils/constants';
import { Auth } from '../../infrastructure/providers/Auth';

export default [
  {
    method: 'POST' as HTTPMethods,
    url: '/user',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: CreateUser.perform,
  },
  {
    method: 'PUT' as HTTPMethods,
    url: '/user/:userId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: UpdateUser.perform,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/user',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: GetUser.perform,
  },

  {
    method: 'DELETE' as HTTPMethods,
    url: '/user/:userId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: DeleteUser.perform,
  },
];
