import { FastifyInstance, FastifyError } from 'fastify';

import UserRoutes from './users';
import AuthenticationRoutes from './authentication';
import LocationRoutes from './locations';
import EventsRoutes from './events';
import CategoriesRoutes from './categories';

const serverRoutes = [...AuthenticationRoutes ];
const secureRoutes = [
  ...UserRoutes,
  ...EventsRoutes,
  ...LocationRoutes,
  ...CategoriesRoutes
];

export default class Route {
  public static addRoutes(
    server: FastifyInstance,
    options: any,
    callback: (error?: FastifyError) => void
  ) {
    serverRoutes.forEach((routeJSON) => {
      server.route(routeJSON);
    });
    secureRoutes.forEach((routeJSON: any) => {
      routeJSON.preValidation = server.auth([server.validateJWT]);
      server.route(routeJSON);
    });
    callback();
  }
}
