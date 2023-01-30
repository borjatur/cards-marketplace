import Collection from './collection.js';
import { ClientSession, ObjectId } from 'mongodb';

export default class OfferCollection extends Collection {
  async storeOne(doc: any, session?: ClientSession) {
    const mongo_indexes = { 
      owner: new ObjectId(doc.owner),
      cardId: new ObjectId(doc.cardId)
    };
    const mongo_doc = { ...doc, ...mongo_indexes };
    return super.storeOne(mongo_doc, session);
  }

  async store(docs: any, session?: ClientSession) {
    const docsArray = Array.isArray(docs) ? docs : [docs];
    const mongo_docs = docsArray.map(doc => {
      const mongo_indexes = { 
        _id: doc._id ? new ObjectId(doc._id) : undefined,
        owner: new ObjectId(doc.owner),
        cardId: new ObjectId(doc.cardId)
      };
      return { ...doc, ...mongo_indexes };
    });
    return super.store(mongo_docs, session);
  }
}