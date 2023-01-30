import { FastifySchema } from 'fastify'
import { Type, Static } from '@sinclair/typebox';
import { notFoundSchema, badRequestSchema, forbiddenSchema, preconditionFailed, unauthorizedSchema } from './error.schemas.js';
import { Order } from '../models/order.model.js'

const OrderCreate = Type.Intersect([
  Order,
  Type.Object({
    status: Type.String({ enum: ['pending'] })
  })
], {
  examples: [{
    amount: 100,
    currency: 'EUR',
    owner: '63d6af6aa68178e8ca8229c6',
    cardId: '63d646e6e9e3bae8daa6abaf',
    status: 'pending'
  }]
});

const OrderParams = Type.Object({
  id: Type.String({ description: 'Order Id' })
})

export type OrderParamsType = Static<typeof OrderParams>

const OrderResponse = Type.Intersect([
  Order,
  Type.Object({
    _id: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String()
  })
], {
  examples: [{
    _id: '41cd0e4be59061edffa39f5c',
    amount: 100,
    currency: 'EUR',
    owner: '63d6af6aa68178e8ca8229c6',
    cardId: '63d646e6e9e3bae8daa6abaf',
    status: 'pending',
    createdAt: '2023-01-22T10:22:03.338Z',
    updatedAt: '2023-01-22T10:22:03.338Z'
  }]
})

export type OrderResponseType = Static<typeof OrderResponse>

const OrdersResponse = Type.Array(
  OrderResponse,
  {
    examples: [
      [{
        _id: '41cd0e4be59061edffa39f5c',
        amount: 100,
        currency: 'EUR',
        owner: '63d6af6aa68178e8ca8229c6',
        cardId: '63d646e6e9e3bae8daa6abaf',
        status: 'pending',
        createdAt: '2023-01-22T10:22:03.338Z',
        updatedAt: '2023-01-22T10:22:03.338Z'
      }]
    ]
  }
)

const createOrderSchemaDescription = 'Create a new order<br> ' + 
  '<ul><li>status must be <b>pending</b></li><li>amount must be higher than card\'s price</li></ul>';

export const createOrderSchema: FastifySchema = {
  description: createOrderSchemaDescription,
  tags: ['orders'],
  summary: 'Creates new order with given values',
  body: OrderCreate,
  security: [{
    Bearer: [],
  }],
  response: {
    201: { ...OrderResponse, description: 'Success' },
    400: { ...badRequestSchema, description: 'Bad Request' },
    403: { ...forbiddenSchema, description: 'Forbidden' },
    412: { ...preconditionFailed, description: 'Precondition Failed' }
  }
}

export const getOrderSchema: FastifySchema = {
  description: 'Gets a single order',
  tags: ['orders'],
  summary: 'Gets order by Id',
  params: OrderParams,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...OrderResponse, description: 'Success' },
    403: { ...forbiddenSchema, description: 'Forbidden' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const getOrdersSchema: FastifySchema = {
  description: 'Gets all orders',
  tags: ['orders'],
  summary: 'Gets all orders',
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...OrdersResponse, description: 'Success' },
    403: { ...forbiddenSchema, description: 'Forbidden' }
  },
};

export const putOrderSchema: FastifySchema = {
  description: 'Updates existing order',
  tags: ['orders'],
  summary: 'Updates order by Id with given values',
  params: OrderParams,
  body: OrderResponse,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...OrderResponse, description: 'Success' },
    403: { ...forbiddenSchema, description: 'Forbidden' },
    404: { ...notFoundSchema, description: 'Not Found' },
    412: { ...preconditionFailed, description: 'Precondition Failed' }
  },
};

export const deleteOrderSchema: FastifySchema = {
  description: 'Deletes a single order',
  tags: ['orders'],
  summary: 'Deletes order by Id',
  params: OrderParams,
  security: [{
    Bearer: [],
  }],
  response: {
    204: {
      description: 'Success',
      type: 'string',
      example: 'No Content'
    },
  },
};