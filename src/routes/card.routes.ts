import { RouteHandlerMethod, RouteOptions } from 'fastify';
import { 
  createCard,
  getCard,
  getCards,
  updateCard,
  deleteCard
} from '../controllers/card.ctrl.js';
import { 
  createCardSchema,
  getCardSchema,
  getCardsSchema,
  putCardSchema,
  deleteCardSchema
} from '../schemas/card.schema.js'

const getCardsRoute: RouteOptions = {
	method: 'GET',
	url: '/cards',
	handler: getCards,
	schema: getCardsSchema,
};

const postCardRoute: RouteOptions = {
  method: 'POST',
  url: '/cards',
  handler: createCard as RouteHandlerMethod,
  schema: createCardSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const getCardRoute: RouteOptions = {
  method: 'GET',
  url: '/cards/:id',
  handler: getCard as RouteHandlerMethod,
  schema: getCardSchema,
};

const putCardRoute: RouteOptions = {
	method: 'PUT',
	url: '/cards/:id',
	handler: updateCard as RouteHandlerMethod,
	schema: putCardSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const deleteCardRoute: RouteOptions = {
	method: 'DELETE',
	url: '/cards/:id',
	handler: deleteCard,
	schema: deleteCardSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const routes = [getCardsRoute, postCardRoute, getCardRoute, putCardRoute, deleteCardRoute];

export default routes;