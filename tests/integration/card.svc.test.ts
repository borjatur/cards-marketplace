import { MongoClient } from 'mongodb';
import CardService from '../../src/services/card.svc.js';
import { createDAL } from '../../src/dal/index.js';
import { describe, expect, beforeAll, beforeEach, TestContext, Suite, it, afterAll, afterEach, test } from 'vitest';
import { CardType } from '../../src/models/card.model.js';

describe('(cards svc)', async () => {

  const client = new MongoClient('mongodb://localhost');
  
  const dal = await createDAL({
    client,
    database: 'marketplace-test',
    collections: ['cards']
  });
  
  const services = {
    cards: new CardService(dal)
  }

  beforeEach(async (context) => {
    const card: CardType = {
      name: 'card7',
      description: 'awesome card',
      owner: '63d00dd4c4f166a89ca14f0b',
      price: 20,
      currency: 'EUR'
    };
    context.cardSeed = await dal.cards
      .storeOne(card);
  });

  afterEach(async () => {
    await dal.cards.client.collection('cards').deleteMany();
  });

  describe('Get all', async () => {

    it('should return all cards', async ({ cardSeed }) => {
      const result = await services.cards.getAllCards()
      if (!cardSeed) {
        throw new Error('cardSeed not defined')
      }
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        _id: cardSeed._id.toString(),
        owner: cardSeed.owner.toString(),
        name: cardSeed.name,
        description: cardSeed.description,
        price: cardSeed.price,
        currency: cardSeed.currency,
        createdAt: new Date(cardSeed.createdAt),
        updatedAt: new Date(cardSeed.updatedAt)
      });
    });
  });

  describe('Get by id', async () => {

    it('should return single card by id', async ({ cardSeed }) => {
      if (!cardSeed) {
        throw new Error('cardSeed must be defined');
      }
      const result = await services.cards.getCardById(cardSeed._id.toString());
      if (!result) {
        throw new Error('result must be equal to cardSeed');
      }
      expect(result._id).to.equal(cardSeed._id.toString());
      expect(result.owner).to.equal(cardSeed.owner.toString());
      expect(result.name).to.equal(cardSeed.name);
      expect(result.description).to.equal(cardSeed.description);
      expect(result.price).to.equal(cardSeed.price);
      expect(result.currency).to.equal(cardSeed.currency);
      expect(result.createdAt.toString()).to.equal(cardSeed.createdAt.toString());
      expect(result.updatedAt.toString()).to.equal(cardSeed.updatedAt.toString());
    });
  });

  describe('Update card', async () => {

    it('should update a single card', async ({ cardSeed }) => {
      if (!cardSeed) {
        throw new Error('cardSeed must be defined')
      }
      const result = await services.cards
          .updateCardById(cardSeed._id, { ...cardSeed, description: 'updated description' });
      
      expect(result._id).to.equal(cardSeed._id.toString());
      expect(result.owner).to.equal(cardSeed.owner.toString());
      expect(result.name).to.equal(cardSeed.name);
      expect(result.description).not.to.equal(cardSeed.description);
      expect(result.price).to.equal(cardSeed.price);
      expect(result.currency).to.equal(cardSeed.currency);
      expect(result.createdAt.toString()).to.equal(cardSeed.createdAt.toString());
      expect(result.updatedAt).not.to.equal(cardSeed.updatedAt);
      expect(result.description).to.equal('updated description');

    });
  });

  describe('Create a card', async () => {

    it('should update a single card', async () => {
      const newCard: CardType = {
        owner: '63d00dd4c4f166a89ca14f0b',
        name: 'anothercard',
        description: 'awesome card',
        price: 30,
        currency: 'EUR'
      };
      const result = await services.cards
          .insertCard(newCard);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        _id: expect.any(String),
        owner: newCard.owner,
        name: newCard.name,
        description: newCard.description,
        price: newCard.price,
        currency: 'EUR',
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date)
      });
    });
  });
});