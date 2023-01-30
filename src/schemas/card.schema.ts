import { FastifySchema } from 'fastify'
import { Type, Static } from '@sinclair/typebox';
import { notFoundSchema } from './error.schemas.js';
import { Card } from '../models/card.model.js'

const CardCreate = Type.Intersect([
  Card,
  Type.Object({})
], { 
  examples: [{
    name: 'card1',
    description: 'an awesome card1',
    owner: '63d00dd4c4f166a89ca14f0b',
    price: 10
  }]
});

const CardParams = Type.Object({
  id: Type.String({ description: 'Card Id' })
})

export type CardParamsType = Static<typeof CardParams>

export const CardResponse = Type.Intersect([
  Card,
  Type.Object({
    _id: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String()
  })
], {
  examples: [{
    _id: '63cd0e4be59031edffa39f5c',
    name: 'card1',
    description: 'an awesome card1',
    owner: '3',
    createdAt: '2023-01-22T10:22:03.338Z',
    updatedAt: '2023-01-22T10:22:03.338Z'
  }]
})

export type CardResponseType = Static<typeof CardResponse>

const CardsResponse = Type.Array(
  CardResponse,
  {
    examples: [
      [{
        _id: '63cd0e4be59031edffa39f5c',
        name: 'card1',
        description: 'an awesome card1',
        owner: '3',
        createdAt: '2023-01-22T10:22:03.338Z',
        updatedAt: '2023-01-22T10:22:03.338Z'
      }]
    ]
  }
)

export const createCardSchema: FastifySchema = {
  description: 'Create a new card',
  tags: ['cards'],
  summary: 'Creates new card with given values',
  body: CardCreate,
  security: [{
    Bearer: [],
  }],
  response: {
    201: { ...CardResponse, description: 'Success' }
  }
}

export const getCardSchema: FastifySchema = {
  description: 'Gets a single card',
  tags: ['cards'],
  summary: 'Gets card by Id',
  params: CardParams,
  response: {
    200: { ...CardResponse, description: 'Success' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const getCardsSchema: FastifySchema = {
  description: 'Gets all cards',
  tags: ['cards'],
  summary: 'Gets all cards',
  response: {
    200: { ...CardsResponse, description: 'Success' }
  },
};

export const putCardSchema: FastifySchema = {
  description: 'Updates existing card',
  tags: ['cards'],
  summary: 'Updates card by Id with given values',
  params: CardParams,
  body: Card,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...CardResponse, description: 'Success' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const deleteCardSchema: FastifySchema = {
  description: 'Deletes a single card',
  tags: ['cards'],
  summary: 'Deletes card by Id',
  params: CardParams,
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