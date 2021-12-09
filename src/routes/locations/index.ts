import { CreateLocation, UpdateLocation, GetLocations, DeleteLocation } from './location-crud';
import { HTTPMethods } from 'fastify';
import { Auth } from '../../infrastructure/providers/Auth';
import { ADMIN } from '../../utils/constants';

export default [
  {
    method: 'POST' as HTTPMethods,
    url: '/location',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: CreateLocation.perform,
  },
  {
    method: 'PUT' as HTTPMethods,
    url: '/location/:locationId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: UpdateLocation.perform,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/location',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: GetLocations.perform,
  },

  {
    method: 'DELETE' as HTTPMethods,
    url: '/location/:locationId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: DeleteLocation.perform,
  },
];
