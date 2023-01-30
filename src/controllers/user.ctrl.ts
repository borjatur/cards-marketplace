import { FastifyRequest, FastifyReply } from 'fastify';
import { UserType } from '../models/user.model.js';

const createUser = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { users: usersService } = this.services;
  if (request.user.role === 'standard') {
    return reply.status(403).send({});
  }
  const user = await usersService.insertUser(request.body as UserType);
  reply.status(201).send(user);
}

const getUser = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { users: usersService } = this.services;
  if (request.user.role === 'standard') {
    return reply.status(403).send({});
  }
  const id = request.id;
  const user = usersService.getUserById(id);
  reply.status(200).send();
}

const getUsers = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { users: usersService } = this.services;
  if (request.user.role === 'standard') {
    return reply.status(403).send({});
  }
  const users = await usersService.getAllUsers();
  reply.status(200).send(users);
}

const updateUser = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  const { users: usersService } = this.services;
  if (request.user.role === 'standard') {
    return reply.status(403).send({});
  }
  reply.status(200).send({});
}

const deleteUser = async function(this: any, request: FastifyRequest, reply: FastifyReply) {
  reply.status(501).send({});
}

export { createUser, getUser, getUsers, updateUser, deleteUser };