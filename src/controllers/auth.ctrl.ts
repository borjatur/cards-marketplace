import { FastifyRequest, FastifyReply } from 'fastify';
import { SignUpBodyType, SignInBodyType } from 'schemas/auth.schema.js';
import { UserResponseType } from 'schemas/user.schemas.js';
import { UserType, User } from '../models/user.model.js';

const signUp = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { users: usersService } = this.services;
  const signUpBody = request.body as SignUpBodyType;
  const existing_user = await usersService.getUserByName(signUpBody.name);
  if (existing_user.length) {
    return reply.status(409).send({
      statusCode: 409,
      error: 'Conflict',
      message: 'User already exists'
    });
  }

  const newUser: UserType = {
    ...signUpBody,
    role: 'standard',
    balance: 0,
    currency: 'EUR'
  };
  const user = await usersService.insertUser(newUser);
  const token = request.server.jwt.sign({
    _id: user._id,
    role: user.role
  });
  reply.status(201).send({ token });
}

const signIn = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { users: usersService } = this.services;
  const signInBody = request.body as SignInBodyType;
  const existing_user = await usersService.getUserByName(signInBody.name);
  if (!existing_user.length) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized'
    });
  }

  if (existing_user[0].password !== signInBody.password) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized'
    });
  }

  const user = existing_user[0] as UserResponseType;
  const token = request.server.jwt.sign({
    _id: user._id,
    role: user.role
  });
  reply.status(200).send({ token });
}

export { signUp, signIn };