import Collection from './collection.js';
import { ClientSession, Filter, FindOptions } from 'mongodb';
import { TSchema } from '@sinclair/typebox';

export default class UserCollection extends Collection {
  async getByName(name: string, session: ClientSession) {
    const filters: Filter<TSchema> = { name: { $eq: name } };
    const options: FindOptions<TSchema> = {};
    if (session) {
      options.session = session
    }
    return this.client
      .collection(this.collection)
      .find(filters, options)
      .toArray() //memory intensive
  }
}