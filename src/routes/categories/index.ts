import { CreateCategory, UpdateCategory, GetCategories, DeleteCategory } from './categories-crud';
import { HTTPMethods } from 'fastify';
import { ADMIN } from '../../utils/constants';
import { Auth } from '../../infrastructure/providers/Auth';

export default [
  {
    method: 'POST' as HTTPMethods,
    url: '/category',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: CreateCategory.perform,
  },
  {
    method: 'PUT' as HTTPMethods,
    url: '/category/:categoryId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: UpdateCategory.perform,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/category',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: GetCategories.perform,
  },

  {
    method: 'DELETE' as HTTPMethods,
    url: '/category/:categoryId',
    preHandler: [Auth.canUserAccess([ADMIN])],
    handler: DeleteCategory.perform,
  },
];
