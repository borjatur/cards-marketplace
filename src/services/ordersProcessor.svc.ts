import { OrderType } from '../models/order.model.js';
import { OfferType } from '../models/offer.model.js';

class OrderProcessor {
  dal: any

  constructor(dal: any) {
    this.dal = dal;
  }

  async watchOffers() {
    const pipeline = [{ 
      $match: { 
        $or: [
          { 'fullDocument.status': 'accepted' },
          { 'updateDescription.updatedFields.status': 'accepted' }
        ]
      } 
    }];
    const changeStream = this.dal
      .offers
      .client
      .collection(this.dal.offers.collection).watch(pipeline);
    changeStream.on('change', async (object: any) => {
      console.log("received a change to offers with: \t", object);
      let offer: OfferType;
      if (object.operationType === 'update') {
        [offer] = await this.dal.offers.get(object.documentKey._id.toString());
      } else {
        offer = object.fullDocument as OfferType;
      }
      const order: OrderType = {
        amount: offer.amount,
        currency: offer.currency || 'EUR',
        cardId: offer.cardId,
        owner: offer.owner,
        status: 'pending',
        offerId: object.operationType === 'update' ? object.documentKey._id : object.fullDocument._id
      };
      const session = await this.dal.client.startSession();
      try {
        const result = await this.dal.orders.storeOne(order, session);
        const modifiedOffer = { ...offer, status: 'fullfilled' };
        await this.dal.offers.store(modifiedOffer, session);
      } catch (err) {
        console.log("Failed to complete database operations");
        console.error(err);
        await this.dal.offers.store({ ...offer, status: 'canceled' })
        await session.abortTransaction();
        return
      } finally {
        await session.endSession();
        console.log("Ended transaction session");
      } 
    });
  }

  async watchOrders() {
    const pipeline = [{ $match: { 'fullDocument.status': 'pending' } }];
    const changeStream = this.dal
      .orders
      .client
      .collection(this.dal.orders.collection).watch(pipeline);
    changeStream.on('change', async (object: any) => {
      console.log("received a change to orders with \t", object);
      const order: OrderType = object.fullDocument as OrderType;
      await this.commitOrder(order);
    });
  }


  async runWatchers() {
    this.watchOffers()
    this.watchOrders()
  }

  async commitOrder(order: OrderType) {
    // start transaction session
    const session = await this.dal.client.startSession();
    try {
      await session.startTransaction();
      const [card] = await this.dal.cards.get(order.cardId, session);
      const [seller] = await this.dal.users.get(card.owner, session);
      const [buyer] = await this.dal.users.get(order.owner, session);

      if (order.amount < card.price && !order.offerId) {
        await this.dal.orders.store(
          { ...order, status: 'canceled', statusReason: 'Order amount is less than current card price' }
        );
        await session.abortTransaction();
        return
      }
      
      if (buyer.balance < order.amount) {
        await this.dal.orders.store(
          { ...order, status: 'canceled', statusReason: 'Buyer balance insufficient' }
        );
        await session.abortTransaction();
        return
      }
      buyer.balance -= order.amount;
      await this.dal.users.store(buyer, session);
      await this.dal.cards.store({ ...card, owner: buyer._id }, session);
      seller.balance += order.amount;
      await this.dal.users.store(seller, session);
      await this.dal.orders.store({ ...order, status: 'fullfilled' }, session);
      await session.commitTransaction();
      console.log("Successfully carried out DB transaction");
    } catch (err) {
      console.log("Failed to complete database operations");
      console.error(err);
      await this.dal.orders.store(
        { ...order, status: 'canceled', statusReason: err }
      );
      await session.abortTransaction();
      return
    } finally {
      await session.endSession();
      console.log("Ended transaction session");
    }
  }
}

export default OrderProcessor;