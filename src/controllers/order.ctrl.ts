import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderType } from '../models/order.model.js';
import { OrderParamsType } from '../schemas/order.schema.js'

const createOrder = async function(this: any, request: FastifyRequest<{ Body: OrderType }>, reply: FastifyReply) {
  const { orders: ordersService, cards: cardsService } = this.services;
  const order = request.body;
  if (order.owner !== request.user._id) {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden'
    });
  }
  if (order.status !== 'pending') {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Orders can only be created with state as "pending"'
    });
  }
  if (order.offerId) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Orders can not be linked at any offer at creation time'
    });
  }
  const card = await cardsService.getCardById(order.cardId);
  if (!card) {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Can not create an Order over a non existing Card'
    });
  }
  if (order.amount < card.price) {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Order amount must be at least equal to Card\'s price'
    });
  }
  const newOrder = await ordersService.insertOrder(order);
  reply.status(201).send(newOrder);
};

const getOrder = async function(this: any, request: FastifyRequest<{ Params: OrderParamsType }>, reply: FastifyReply) {
  const id = request.params.id;
  const { orders: ordersService } = this.services;
  const order = await ordersService.getOrderById(id);
  if (!order) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found'
    });
  }
  if (order.owner !== request.user._id) {
    return reply.status(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden'
    });
  }
  reply.status(200).send(order);
};

const getOrders = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  if (request.user.role === 'admin') {
    const { orders: ordersService } = this.services;
    const orders = await ordersService.getAllOrders();
    return reply.status(200).send(orders);
  }
  return reply.status(403).send({
    statusCode: 403,
    error: 'Forbidden',
    message: 'Forbidden'
  });
};

const updateOrder = async function(this: any, request: FastifyRequest<{ Params: OrderParamsType, Body: OrderType }>, reply: FastifyReply) {
  const { orders: ordersService, cards: cardsService } = this.services;

  const order = request.body;
  const existingOrder = await ordersService.getOrderById(request.params.id);
  if (!existingOrder) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found'
    });
  }
  if (existingOrder.status !== 'pending') {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Orders that has been processed can not be modified'
    });
  }
  if (order.status !== 'pending' || order.offerId) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Orders can only be updated with state as "pending"'
    });
  }
  const card = await cardsService.getCardById(order.cardId);
  if (!card) {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Order amount must be at least equal to Card\'s price'
    });
  }
  if (order.amount < card.price) {
    return reply.status(412).send({
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Order amount must be at least equal to Card\'s price'
    });
  }
  const updatedOrder = ordersService.updateOrderById(request.params.id, order);
  reply.status(200).send(updatedOrder);
};

const deleteOrder = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  reply.status(501).send();
};

export { createOrder, getOrder, getOrders, updateOrder, deleteOrder };