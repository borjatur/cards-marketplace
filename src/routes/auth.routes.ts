import { RouteOptions } from 'fastify';
import { signUp, signIn } from '../controllers/auth.ctrl.js'
import { signUpRequestSchema, signInRequestSchema } from '../schemas/auth.schema.js'

const signUpAuthRoute: RouteOptions = {
  method: 'POST',
  url: '/signup',
  handler: signUp,
  schema: signUpRequestSchema,
};

const signInAuthRoute: RouteOptions = {
  method: 'POST',
  url: '/signin',
  handler: signIn,
  schema: signInRequestSchema,
};

const routes = [signUpAuthRoute, signInAuthRoute];

export default routes;