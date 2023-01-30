import { FastifySchema } from 'fastify';
import { Type, Static } from '@sinclair/typebox';
import { notFoundSchema, badRequestSchema, forbiddenSchema } from './error.schemas.js';
import { Offer } from '../models/offer.model.js';

const OfferCreate = Type.Intersect([
  Offer,
  Type.Object({})
], { 
  examples: [{
    amount: 100,
    currency: 'EUR',
    cardId: '63d646e6e9e3bae8daa6abaf',
    owner: '63d6af6aa68178e8ca8229c6',
    status: 'pending'
  }]
});

const OfferParams = Type.Object({
  id: Type.String({ description: 'Offer Id' })
})

export type OfferParamType = Static<typeof OfferParams>;

const OfferResponse = Type.Intersect([
  Offer,
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
    cardId: '63d646e6e9e3bae8daa6abaf',
    owner: '63d6af6aa68178e8ca8229c6',
    createdAt: '2023-01-22T10:22:03.338Z',
    updatedAt: '2023-01-22T10:22:03.338Z',
    status: 'pending'
  }]
})

export type OfferResponseType = Static<typeof OfferResponse>;

const OffersResponse = Type.Array(
  OfferResponse,
  {
    examples: [
      [{
        _id: '41cd0e4be59061edffa39f5c',
        amount: 100,
        currency: 'EUR',
        cardId: '63d646e6e9e3bae8daa6abaf',
        owner: '63d6af6aa68178e8ca8229c6',
        createdAt: '2023-01-22T10:22:03.338Z',
        updatedAt: '2023-01-22T10:22:03.338Z',
        status: 'pending'
      }]
    ]
  }
)

export const createOfferSchema: FastifySchema = {
  description: 'Create a new offer',
  tags: ['offers'],
  summary: 'Creates new offer with given values',
  body: OfferCreate,
  security: [{
    Bearer: [],
  }],
  response: {
    201: { ...OfferResponse, description: 'Success' },
    400: { ...badRequestSchema, description: 'Bad Request' }
  }
}

export const getOfferSchema: FastifySchema = {
  description: 'Gets a single offer',
  tags: ['offers'],
  summary: 'Gets offer by Id',
  params: OfferParams,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...OfferResponse, description: 'Success' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const getOffersSchema: FastifySchema = {
  description: 'Gets all offers',
  tags: ['offers'],
  summary: 'Gets all offers',
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...OffersResponse, description: 'Success' }
  },
};

export const putOfferSchema: FastifySchema = {
  description: 'Updates existing offer',
  tags: ['offers'],
  summary: 'Updates offer by Id with given values',
  params: OfferParams,
  body: Offer,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...OfferResponse, description: 'Success' },
    403: { ...forbiddenSchema, description: 'Forbidden' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const deleteOfferSchema: FastifySchema = {
  description: 'Deletes a single offer',
  tags: ['offers'],
  summary: 'Deletes offer by Id',
  params: OfferParams,
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