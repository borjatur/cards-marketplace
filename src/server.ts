import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors'
import config from './plugins/config.js';
import auth from './plugins/auth.js'
import { registerSwagger } from './swagger.js';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import routes from './routes/index.js'

const createServer = async (svcs: any): Promise<FastifyInstance> => {
  const envToLogger: any = {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
  };
  const environment = process.env.NODE_ENV || 'production'
  const serverOptions: FastifyServerOptions = {
    ajv: {
      customOptions: {
        removeAdditional: "all",
        coerceTypes: true,
        useDefaults: true,
        keywords: ['kind', 'modifier']
      }
    },
    logger: envToLogger[environment] ?? true,
  };
  const server = fastify(serverOptions).withTypeProvider<TypeBoxTypeProvider>();
  
  await server.register(config);
  await server.register(auth);
  await registerSwagger(server);
  
  routes.forEach(route => {
    server.route(route)
  });

  server.decorate('services', svcs);
  
  await server.register(cors, { 
    origin: false
  })
  await server.ready();
  return server;
};

export default createServer;
