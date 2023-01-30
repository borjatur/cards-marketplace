import { RouteHandlerMethod, RouteOptions } from 'fastify';
import { 
  createOffer,
  getOffer,
  getOffers,
  updateOffer,
  deleteOffer
} from '../controllers/offer.ctrl.js';
import { 
  createOfferSchema,
  getOfferSchema,
  getOffersSchema,
  putOfferSchema,
  deleteOfferSchema
} from '../schemas/offer.schema.js'

const getOffersRoute: RouteOptions = {
	method: 'GET',
	url: '/offers',
	handler: getOffers,
	schema: getOffersSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const postOfferRoute: RouteOptions = {
  method: 'POST',
  url: '/offers',
  handler: createOffer as RouteHandlerMethod,
  schema: createOfferSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const getOfferRoute: RouteOptions = {
  method: 'GET',
  url: '/offers/:id',
  handler: getOffer as RouteHandlerMethod,
  schema: getOfferSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const putOfferRoute: RouteOptions = {
	method: 'PUT',
	url: '/offers/:id',
	handler: updateOffer as RouteHandlerMethod,
	schema: putOfferSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const deleteOfferRoute: RouteOptions = {
	method: 'DELETE',
	url: '/offers/:id',
	handler: deleteOffer,
	schema: deleteOfferSchema,
  preValidation: async (request, reply) => {
    await request.server.authenticate(request, reply);
  }
};

const routes = [getOffersRoute, postOfferRoute, getOfferRoute, putOfferRoute, deleteOfferRoute];

export default routes;