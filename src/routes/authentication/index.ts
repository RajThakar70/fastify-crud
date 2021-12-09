import { SignInUser } from './sign-in';
import { HTTPMethods } from 'fastify';
import { SignUpUser } from './sing-up';


export default [
  {
    method: 'POST' as HTTPMethods,
    url: '/sign-in',
    handler: SignInUser.perform,
  },

  {
    method: 'POST' as HTTPMethods,
    url: '/sign-up',
    handler: SignUpUser.perform,
  },
];
