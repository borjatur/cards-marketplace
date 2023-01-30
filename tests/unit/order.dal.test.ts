import { MongoClient, DbOptions, ObjectId } from 'mongodb';
import Sinon, { SinonStubbedInstance, SinonStub } from 'sinon';
import { describe, expect, beforeAll, beforeEach, TestContext, Suite, it, afterAll, afterEach, test } from 'vitest';
import { createDAL, IDto } from '../../src/dal/index.js';
import { OrderType } from '../../src/models/order.model.js';

describe('order DAL', async () => {

  let mongoClient: SinonStubbedInstance<MongoClient>;
  let dal: any;
  let findFn: SinonStub
  let insertOneFn: SinonStub

  beforeEach(async() => {
    mongoClient = Sinon.createStubInstance(MongoClient);

    findFn = Sinon.stub().returns({
      toArray: Sinon.stub().returns(Promise.resolve([{}]))
    });

    insertOneFn = Sinon.stub().returns(Promise.resolve({}))
    
    const collectionFn = Sinon.stub().returns({
      find: findFn,
      insertOne: insertOneFn
    });
    const dbFn = Sinon.stub<[dbName?: string | undefined, options?: DbOptions | undefined]>().returns({
      collection: collectionFn
    });
    
    mongoClient.db = dbFn

    
    dal = await createDAL({
      client: mongoClient,
      database: 'marketplace-test',
      collections: ['orders']
    });
  });

  describe('get', async () => {

    it('should call mongo client find function passing down given id', async () => {
      await dal.orders.get('63d64675e9e3bae8daa6abae');
  
      expect(findFn.args[0][0])
        .to.deep.eq({ _id: { '$in': [new ObjectId('63d64675e9e3bae8daa6abae')] } });
    });
  });

  describe('storeOne', async () => {
    it('should call mongo client insertOne function passing down given document with mongodb transformations', async () => {

      const order: OrderType = {
        amount: 10,
        currency: 'EUR',
        owner: '63d64675e9e3bae8daa6abae',
        cardId: '63d0337bcd21c80732f43fc0',
        offerId: '63d64675e9e3bae8daa7abae',
        status: 'pending'
      };

      await dal.orders.storeOne(order);

      expect(insertOneFn.args[0][0])
        .to.toMatchObject({
          'amount': 10,
          'currency': 'EUR',
          'owner': new ObjectId('63d64675e9e3bae8daa6abae'),
          'cardId': new ObjectId('63d0337bcd21c80732f43fc0'),
          'offerId': new ObjectId('63d64675e9e3bae8daa7abae'),
          'status': 'pending',
          'createdAt': expect.any(Date),
          'updatedAt': expect.any(Date)
        });
    });
  });
});