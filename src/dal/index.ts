import { MongoClient } from 'mongodb';
import Collection from './collection.js'
import UserCollection from './userCollection.js';
import CardCollection from './cardCollection.js';
import OrderCollection from './orderCollection.js';
import OfferCollection from './offerCollection.js';

export interface IDto {
  client: MongoClient,
  database: string,
  collections: string[]
}

export function createDAL({ client, database, collections }: IDto): any {

  const collec: any = {};
  collections.forEach(collection => {
    if (collection === 'users') {
      collec[collection] = new UserCollection(collection, client.db(database));
    } else if (collection === 'cards') {
      collec[collection] = new CardCollection(collection, client.db(database));
    } else if (collection === 'orders') {
      collec[collection] = new OrderCollection(collection, client.db(database));
    } else if (collection === 'offers') {
      collec[collection] = new OfferCollection(collection, client.db(database));
    } else {
      collec[collection] = new Collection(collection, client.db(database));
    }
  });
  collec['client'] = client;
  return collec;
}