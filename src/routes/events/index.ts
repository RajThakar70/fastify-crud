import { CreateEvent, UpdateEvent, GetEvents, DeleteEvent, GetEvent } from './event-crud';
import { HTTPMethods } from 'fastify';
import { Auth } from '../../infrastructure/providers/Auth';
import { ADMIN } from '../../utils/constants';

export default [
  {
    method: 'POST' as HTTPMethods,
    url: '/event',
    handler: CreateEvent.perform,
  },
  {
    method: 'PUT' as HTTPMethods,
    url: '/event/:eventId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: UpdateEvent.perform,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/event',
    handler: GetEvents.perform,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/event/:eventId',
    handler: GetEvent.perform,
  },
  {
    method: 'DELETE' as HTTPMethods,
    url: '/event/:eventId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: DeleteEvent.perform,
  },
];
