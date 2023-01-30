import { OfferType } from '../models/offer.model.js';
import { OfferResponseType } from '../schemas/offer.schema.js';

class OfferService {
  dal: any

  constructor(dal: any) {
    this.dal = dal;
  }

  async insertOffer(offer: OfferType): Promise<any> {
    return this.dal
      .offers
      .storeOne(offer)
      .then((newOffer: any) => ({ ...newOffer, _id: newOffer._id.toString(), owner: newOffer.owner.toString() }));
  }

  async getOfferById(id: string): Promise<any> {
    return this.dal
      .offers
      .get(id)
      .then((offer: any[]) => {
        const result = offer[0];
        if (result) {
          return {
            ...result,
            _id: result._id.toString(),
            owner: result.owner.toString(),
            cardId: result.cardId.toString()
          };
        }
      });
  }

  async getAllOffers(): Promise<any> {
    return this.dal.offers.get();
  }

  async updateOfferById(id: string, offer: OfferType): Promise<OfferResponseType> {
    return this.dal
      .offers
      .store({ ...offer, _id: id })
      .then((offer: any[]) => {
        const result = offer[0].value;
        return { 
          ...result,
          _id: result._id.toString(),
          owner: result.owner.toString(),
          cardId: result.cardId.toString()
        };
      });
  }
}

export default OfferService;