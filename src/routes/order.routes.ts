import { RouteOptions, RouteHandlerMethod } from 'fastify';
import { 
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder
} from '../controllers/order.ctrl.js';
import { 
  createOrderSchema,
  getOrderSchema,
  getOrdersSchema,
  putOrderSchema,
  deleteOrderSchema
} from '../schemas/order.schema.js'

const getOrdersRoute: RouteOptions = {
	method: 'GET',
	url: '/orders',
	handler: getOrders,
	schema: getOrdersSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const postOrderRoute: RouteOptions = {
  method: 'POST',
  url: '/orders',
  handler: createOrder as RouteHandlerMethod,
  schema: createOrderSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const getOrderRoute: RouteOptions = {
  method: 'GET',
  url: '/orders/:id',
  handler: getOrder as RouteHandlerMethod,
  schema: getOrderSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const putOrderRoute: RouteOptions = {
	method: 'PUT',
	url: '/orders/:id',
	handler: updateOrder as RouteHandlerMethod,
	schema: putOrderSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const deleteOrderRoute: RouteOptions = {
	method: 'DELETE',
	url: '/orders/:id',
	handler: deleteOrder,
	schema: deleteOrderSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const routes = [getOrdersRoute, postOrderRoute, getOrderRoute, putOrderRoute, deleteOrderRoute];

export default routes;