import type { FastifyInstance } from "fastify";
import { FastifySwaggerUiOptions} from '@fastify/swagger-ui';
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export async function registerSwagger(server: FastifyInstance) {
  const openApiOptions: FastifyDynamicSwaggerOptions = {
    openapi: {
      info: {
        title: 'Cards marketplace docs',
        description: 'REST API example for Rungie built by Borja Tur',
        version: '0.1.0'
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: "http",
            scheme: "bearer",
          },
        },
      }
    },
    hideUntagged: true
  };

  await server.register(fastifySwagger, openApiOptions)

  const openApiUiOptions: FastifySwaggerUiOptions = {
    routePrefix: '/docs',
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  };

  await server.register(fastifySwaggerUi, openApiUiOptions);
}