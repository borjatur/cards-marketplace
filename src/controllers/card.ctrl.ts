import { FastifyRequest, FastifyReply } from 'fastify';
import { CardType } from '../models/card.model.js';
import { CardParamsType, CardResponseType } from '../schemas/card.schema.js';

const createCard = async function(this: any, request: FastifyRequest<{ Body: CardType }>, reply: FastifyReply) {
  const { cards: cardsService } = this.services;
  const card = request.body;
  if (card.owner !== request.user._id) {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Card owner must match current user'
    });
  }
  const newCard = await cardsService.insertCard(card);
  reply.status(201).send(newCard);
}

const getCard = async function (this: any, request: FastifyRequest<{ Params: CardParamsType }>, reply: FastifyReply) {
  const id = request.params.id;
  const { cards: cardsService } = this.services;
  const card = await cardsService.getCardById(id);
  if (!card) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found'
    });
  }
  reply.status(200).send(card);
}

const getCards = async function (this: any, request: FastifyRequest, reply: FastifyReply) {
  const { cards: cardsService } = this.services;
  const cards = await cardsService.getAllCards();
  reply.status(200).send(cards);
}

const updateCard = async function(this: any, request: FastifyRequest<{ Params: CardParamsType, Body: CardType }>, reply: FastifyReply) {
  const { cards: cardsService } = this.services;
  const result = await cardsService.updateCardById(request.params.id, request.body)
  if (result) {
    return reply.status(200).send(result);
  }
  reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: 'Not Found'
  });
}

const deleteCard = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  reply.status(501).send({});
}

export { createCard, getCard, getCards, updateCard, deleteCard };