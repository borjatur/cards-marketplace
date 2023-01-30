import { ObjectId, ClientSession, Db, FindOptions, Filter, OptionalId, InsertOneOptions, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { TSchema } from '@sinclair/typebox';

export default class Collection {

  collection: string;
  client: Db;

  constructor(collection: string, client: any) {
    this.collection = collection;
    this.client = client;
  }

  async get(ids: string | string[], session?: ClientSession): Promise<unknown> {
    let filters: Filter<TSchema> = {};
    let options: FindOptions<TSchema> = {};
    if (ids) {
      const arrayIds = Array.isArray(ids) ? ids : [ids];
      const criteriaIds = arrayIds.map(id => new ObjectId(id))
      filters = { _id: { $in: criteriaIds } };
    }
    if (session) {
      options = { session }
    }
    return this.client
      .collection(this.collection)
      .find(filters, options)
      .toArray() //memory intensive
  }

  async storeOne(doc: any, session?: ClientSession): Promise<unknown> {
    const now = new Date();
    const options: InsertOneOptions = {};
    const docToInsert: OptionalId<TSchema> = {
      ...doc,
      createdAt: now,
      updatedAt: now
    };
    if (session) {
      options.session = session
    }
    return this.client
      .collection(this.collection)
      .insertOne(docToInsert, options)
      .then(() => docToInsert);
  }

  async store(docs: any | any[], session?: ClientSession): Promise<unknown> {
    const docsArray = Array.isArray(docs) ? docs : [docs];
    return Promise.all(docsArray.map(doc => {
      const filters: Filter<TSchema> = { _id: doc._id };
      const updateFilters: UpdateFilter<TSchema> = { $set: Object.assign(doc, { updatedAt: new Date() }) };
      const options: FindOneAndUpdateOptions = { upsert: true, returnDocument: 'after' };
      if (session) {
        options.session = session;
      }
      return this.client
        .collection(this.collection)
        .findOneAndUpdate(filters, updateFilters, options)
        .then(({ lastErrorObject, value }: any) => {
          const { upserted, updatedExisting } = lastErrorObject;
          return {
            value: value,
            created: upserted ? true : false,
            updated: updatedExisting
          };
        });
    }));
  }
}