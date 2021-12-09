import { CreateComment, UpdateComment, GetEventComments, DeleteComment } from './comment-crud';
import { HTTPMethods } from 'fastify';
import { Auth } from '../../infrastructure/providers/Auth';
import { ADMIN, NORMAL } from '../../utils/constants';

export default [
  {
    method: 'POST' as HTTPMethods,
    url: '/comment',
    preHandler: [Auth.canUserAccess([ADMIN, NORMAL])],
    handler: CreateComment.perform,
  },
  {
    method: 'PUT' as HTTPMethods,
    url: '/comment/:commentId',
    preHandler: [Auth.canUserAccess([ADMIN, NORMAL])],
    handler: UpdateComment.perform,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/comment/event/:eventId',
    preHandler: [Auth.canUserAccess([ADMIN, NORMAL])],
    handler: GetEventComments.perform,
  },

  {
    method: 'DELETE' as HTTPMethods,
    url: '/comment/:commentId',
    preHandler: [Auth.canUserAccess([ADMIN, NORMAL])],
    handler: DeleteComment.perform,
  },
];
