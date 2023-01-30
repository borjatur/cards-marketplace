import { FastifySchema } from 'fastify'
import { Type, Static } from '@sinclair/typebox';
import { notFoundSchema } from './error.schemas.js';
import { User } from '../models/user.model.js'

const UserCreate = Type.Intersect([
  User,
  Type.Object({})
], { 
  examples: [{
    name: 'johndoe',
    wallet: '0x329CdCBBD82c934fe32322b423bD8fBd30b4EEB6',
    password: 'supersecure',
    role: 'standard',
    balance: 0,
    currency: 'EUR'
  }]
});

const UserParams = Type.Object({
  id: Type.String({ description: 'User Id' })
});

const UserResponse = Type.Intersect([
  User,
  Type.Object({
    _id: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String()
  })
], {
  examples: [{
    _id: '64cd0e4be59031edffa39f3c',
    name: 'johndoe',
    wallet: '0x329CdCBBD82c934fe32322b423bD8fBd30b4EEB6',
    password: 'supersecure',
    role: 'standard',
    balance: 0,
    currency: 'EUR',
    createdAt: '2023-01-22T10:22:03.338Z',
    updatedAt: '2023-01-22T10:22:03.338Z'
  }]
})

export type UserResponseType = Static<typeof UserResponse>

const UsersResponse = Type.Array(
  UserResponse,
  {
    examples: [
      [{
        name: 'johndoe',
        wallet: '0x329CdCBBD82c934fe32322b423bD8fBd30b4EEB6',
        password: 'supersecure'
      }]
    ]
  }
)

export const createUserSchema: FastifySchema = {
  description: 'Create a new user',
  tags: ['users'],
  summary: 'Creates new user with given values',
  body: UserCreate,
  security: [{
    Bearer: [],
  }],
  response: {
    201: { ...UserResponse, description: 'Success' }
  }
}

export const getUserSchema: FastifySchema = {
  description: 'Gets a single user',
  tags: ['users'],
  summary: 'Gets user by Id',
  params: UserParams,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...UserResponse, description: 'Success' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const getUsersSchema: FastifySchema = {
  description: 'Gets all users',
  tags: ['users'],
  summary: 'Gets all users',
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...UsersResponse, description: 'Success' }
  },
};

export const putUserSchema: FastifySchema = {
  description: 'Updates existing user',
  tags: ['users'],
  summary: 'Updates user by Id with given values',
  params: UserParams,
  body: UserResponse,
  security: [{
    Bearer: [],
  }],
  response: {
    200: { ...UserResponse, description: 'Success' },
    404: { ...notFoundSchema, description: 'Not found' }
  },
};

export const deleteUserSchema: FastifySchema = {
  description: 'Deletes a single user',
  tags: ['users'],
  summary: 'Deletes user by Id',
  params: UserParams,
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