import Collection from './collection.js';
import { ClientSession, ObjectId } from 'mongodb';
import { CardType } from '../models/card.model.js';
import { CardResponseType } from '../schemas/card.schema.js';

export default class CardCollection extends Collection {

  async storeOne(doc: CardType, session?: ClientSession): Promise<CardResponseType> {
    const mongo_doc = Object.assign(doc, { owner: new ObjectId(doc.owner) });
    return super.storeOne(mongo_doc, session) as Promise<CardResponseType>;
  }

  async store(docs: CardType | CardType[], session?: ClientSession) {
    const docsArray = Array.isArray(docs) ? docs : [docs];
    const mongo_docs = docsArray.map(doc => {
      return Object.assign(doc, {
        owner: new ObjectId(doc.owner),
        _id: doc._id ? new ObjectId(doc._id) : undefined
      });
    });
    return super.store(mongo_docs, session);
  }

  async get(ids: string | string[], session?: ClientSession | undefined): Promise<CardResponseType[]|undefined[]> {
    return super.get(ids, session) as Promise<CardResponseType[]|undefined[]>;
  }
}