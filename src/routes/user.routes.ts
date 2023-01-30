import { RouteOptions } from 'fastify';
import { getUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/user.ctrl.js'
import { getUsersSchema, createUserSchema, getUserSchema, deleteUserSchema, putUserSchema } from '../schemas/user.schemas.js'

const getUsersRoute: RouteOptions = {
	method: 'GET',
	url: '/users',
	handler: getUsers,
	schema: getUsersSchema,
	preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const postUserRoute: RouteOptions = {
  method: 'POST',
  url: '/users',
  handler: createUser,
  schema: createUserSchema,
	preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const getUserRoute: RouteOptions = {
  method: 'GET',
  url: '/users/:id',
  handler: getUser,
  schema: getUserSchema,
	preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const putUserRoute: RouteOptions = {
	method: 'PUT',
	url: '/users/:id',
	handler: updateUser,
	schema: putUserSchema,
	preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const deleteUserRoute: RouteOptions = {
	method: 'DELETE',
	url: '/users/:id',
	handler: deleteUser,
	schema: deleteUserSchema,
	preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const routes = [getUsersRoute, postUserRoute, getUserRoute, putUserRoute, deleteUserRoute];

export default routes;