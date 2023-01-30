import { FastifySchema } from 'fastify'
import { Type, Static } from '@sinclair/typebox';
import { unauthorizedSchema } from './error.schemas.js';

export const SignUpBody = Type.Object({
  name: Type.String({ minLength: 5, maxLength: 50, pattern: '^[a-z0-9A-Z]' }),
  wallet: Type.String(),
  password: Type.String({ minLength: 8, maxLength: 12, pattern: '^[a-z0-9A-Z]' })
}, {
  examples: [{
    name: 'johndoe',
    wallet: '0x329CdCBBD82c934fe32322b423bD8fBd30b4EEB6',
    password: 'supersecure'
  }]
});

export type SignUpBodyType = Static<typeof SignUpBody>

const signUpResponseSchema = Type.Object({
  token: Type.String()
}, {
  examples: [{
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2QwMGRkNGM0ZjE2NmE4OWNhMTRmMGIiLCJyb2xlIjoic3RhbmRhcmQiLCJpYXQiOjE2NzQ1Nzk0MTJ9.HuNlcwF9c3eJSS_2Xrs4M96L_d8YTb88gkqT30SrPZk'
  }]
})

export const signUpRequestSchema: FastifySchema = {
  description: 'New user sign up',
  tags: ['auth'],
  summary: 'Creates new user with given values',
  body: SignUpBody,
  response: {
    201: { ...signUpResponseSchema, description: 'Success' }
  }
}

const SignInBody = Type.Object({
  name: Type.String({ minLength: 5, maxLength: 50, pattern: '^[a-z0-9A-Z]' }),
  password: Type.String({ minLength: 8, maxLength: 12, pattern: '^[a-z0-9A-Z]' })
}, {
  examples: [{
    name: 'johndoe',
    password: 'supersecure'
  }]
})

export const signInRequestSchema: FastifySchema = {
  description: 'User sign in',
  tags: ['auth'],
  summary: 'User sign in',
  body: SignInBody,
  response: {
    200: { ...signUpResponseSchema, description: 'Success' },
    401: { ...unauthorizedSchema, description: 'Unauthorized' }
  }
}

export type SignInBodyType = Static<typeof SignInBody>