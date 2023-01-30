import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { 
      _id: string,
      role: string
    } // payload type is used for signing and verifying
    user: {
      _id: string,
      role: string,
    } // user type is return type of `request.user` object
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

const authPlugin: FastifyPluginAsync = async (server) => {
  const jwtOptions: FastifyJWTOptions = {
    secret: server.config.JWT_SECRET
  }
  await server.register(fastifyJwt, jwtOptions);

  server.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  })
};

export default fp(authPlugin);
