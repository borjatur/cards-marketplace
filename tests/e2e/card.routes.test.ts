import { MongoClient } from 'mongodb';
import { describe, test, expect, beforeAll, beforeEach, TestContext, Suite, it, afterAll, afterEach } from 'vitest';
import CardService from '../../src/services/card.svc.js';
import OfferService from '../../src/services/offer.svc.js';
import UsersService from '../../src/services/user.svc.js';
import OrderService from '../../src/services/order.svc.js';
import createServer from '../../src/server.js';
import { createDAL } from '../../src/dal/index.js';
import { CardType } from 'models/card.model.js';
import { CardResponseType } from 'schemas/card.schema.js';

declare module 'vitest' {
  export interface TestContext {
    cardId?: string,
    cardSeed?: CardResponseType
  }
}

describe(('e2e'), async() => {

  const client = new MongoClient('mongodb://localhost');

  const dal = await createDAL({
    client,
    database: 'marketplace-test',
    collections: ['offers', 'users', 'cards', 'orders']
  });
  
  const services = {
    cards: new CardService(dal),
    offers: new OfferService(dal),
    users: new UsersService(dal),
    orders: new OrderService(dal)
  }
  const server = await createServer(services);
  const response = await server.inject({
    method: 'POST',
    path: '/signup',
    payload: {
      name: 'foooo',
      password: 'supersecret',
      wallet: 'mock'
    }
  });
  
  const { token } = response.json();

  beforeEach(async (context) => {
    const card: CardType = {
      name: 'card1',
      description: 'an awesome card1',
      owner: '63d00dd4c4f166a89ca14f0b',
      price: 10
    };
    const result = await services.cards.insertCard(card);
    context.cardId = result._id.toString();
    context.cardSeed = result;
  });

  afterEach(async () => {
    await dal.cards.client.collection('cards').deleteMany();
    await dal.users.client.collection('users').deleteMany();
  });


  afterAll(async () => {
    await server.close();
  });

  describe('(cards)', () => {

    describe('GET cards/', () => {

      test('should return all cards', async () => {
        const response = await server.inject({
          method: 'GET',
          path: '/cards',
        });
        expect(response.statusCode).eq(200);
        const { _id, createdAt, updatedAt, ...card} = response.json()[0];
        expect(card)
          .deep.eq({
            currency: 'EUR',
            description: 'an awesome card1',
            name: 'card1',
            owner: '63d00dd4c4f166a89ca14f0b',
            price: 10
          });
      });
    });

    describe('GET cards/{id}', () => {

      test('should return a single card by id', async ({ cardId }) => {
        const response = await server.inject({
          method: 'GET',
          path: `/cards/${cardId}`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        expect(response.statusCode).eq(200);
        const { _id, createdAt, updatedAt, ...card} = response.json();
        expect(card)
          .deep.eq({
            currency: 'EUR',
            description: 'an awesome card1',
            name: 'card1',
            owner: '63d00dd4c4f166a89ca14f0b',
            price: 10
          });
      });
    });

    describe('POST /cards', () => {

      test('should create a single card', async () => {
        const newCard: CardType = {
          name: 'awesome_card',
          description: 'another card',
          owner: '63d00dd4c4f166a89ca14f0b',
          price: 50,
          currency: 'EUR'
        };
        const response = await server.inject({
          method: 'POST',
          path: '/cards',
          headers: {
            Authorization: `Bearer ${token}`
          },
          payload: newCard
        });

        expect(response.statusCode).eq(201);

        const cardResponse: CardResponseType = response.json();
        const { _id, createdAt, updatedAt, ...card} = cardResponse;
        expect(newCard)
          .deep.eq(card);
      });
    });

    describe('PUT /cards', () => {

      test('should modify a single card by id', async ({ cardSeed }) => {
        
        if (!cardSeed) {
          throw new Error('cardSeed must be defined');
        }
        
        const updateCard = { ...cardSeed, description: 'updated description' }
        
        const response = await server.inject({
          method: 'PUT',
          path: `/cards/${cardSeed?._id.toString()}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          payload: updateCard
        });

        expect(response.statusCode).eq(200);

        const cardResponse: CardResponseType = response.json();
        expect(cardResponse).toMatchObject({
          _id: cardSeed._id,
          owner: cardSeed.owner,
          name: cardSeed.name,
          description: 'updated description',
          price: cardSeed.price,
          createdAt: new Date(cardSeed.createdAt).toISOString(),
          updatedAt: expect.any(String),
          currency: 'EUR'
        });
      });
    });
  });
});

