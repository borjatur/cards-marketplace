import { FastifyRequest, FastifyReply } from 'fastify';
import { OfferType } from '../models/offer.model.js';
import { OfferParamType } from '../schemas/offer.schema.js';

const createOffer = async function(this: any, request: FastifyRequest<{ Body: OfferType }>, reply: FastifyReply) {
  const { offers: offersService } = this.services;
  const offer = request.body;
  if (offer.owner !== request.user._id) {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden'
    });
  }
  if (offer.status !== 'pending') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Offers can only be created with state as "pending"'
    });
  }
  const newOffer = await offersService.insertOffer(offer);
  reply.status(201).send(newOffer);
};

const getOffer = async function(this: any, request: FastifyRequest<{ Params: OfferParamType }>, reply: FastifyReply) {
  const id = request.params.id;
  const { offers: offersService } = this.services;
  const offer = await offersService.getOfferById(id);
  if (!offer) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found'
    });
  }
  reply.status(200).send(offer);
};

const getOffers = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { offers: offersService } = this.services;
  const offers = await offersService.getAllOffers();
  reply.status(200).send(offers);
};

const updateOffer = async function(this: any, request: FastifyRequest<{ Params: OfferParamType, Body: OfferType }>, reply: FastifyReply) {
  const { offers: offersService, cards: cardsService } = this.services;
  const id = request.params.id;
  const offer = request.body;
  const existingOffer = await offersService.getOfferById(id);
  if (!existingOffer) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found'
    });
  }
  
  const card = await cardsService.getCardById(existingOffer.cardId);
  if ((offer.status === 'accepted' || offer.status === 'declined') && card.owner === request.user._id) {
    const aux = { ...existingOffer, status: 'accepted' };
    const updatedOffer = await offersService.updateOfferById(id, aux);
    return reply.status(200).send(updatedOffer);
  }

  if (offer.owner !== request.user._id) {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden'
    });
  }

  if (offer.status !== 'pending') {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Offers that has been processed can not be modified'
    });
  }

  const updatedOffer = await offersService.updateOfferById(id, offer);
  reply.status(200).send(updatedOffer);
};

const deleteOffer = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  reply.status(501).send();
};

export { createOffer, getOffer, getOffers, updateOffer, deleteOffer };