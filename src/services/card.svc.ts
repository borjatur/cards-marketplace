import { CardType } from '../models/card.model.js';
import { CardResponseType } from 'schemas/card.schema.js';

class CardService {
  dal: any

  constructor(dal: any) {
    this.dal = dal;
  }

  async insertCard(card: CardType): Promise<CardResponseType> {
    return this.dal
      .cards
      .storeOne(card)
      .then((card: any) => ({ ...card, _id: card._id.toString(), owner: card.owner.toString() }));
  }

  async getCardById(id: string): Promise<CardResponseType|undefined> {
    return this.dal
      .cards
      .get(id)
      .then((c: any[]) => {
        const result = c[0];
        if (result) {
          return { 
            ...result,
            _id: result._id.toString(),
            owner: result.owner.toString() 
          }
        }
      });
  }

  async getAllCards(): Promise<any> {
    return this.dal
      .cards
      .get()
      .then((cards: any[]) => {
        return cards.map(c => ({ ...c, _id: c._id.toString(), owner: c.owner.toString() }));
      });
  }

  async updateCardById(id: string, card: CardType): Promise<CardResponseType> {
    return this.dal
      .cards
      .store({ ...card, _id: id })
      .then((c: any[]) => {
        const result = c[0].value;
        return { ...result, _id: result._id.toString(), owner: result.owner.toString() };
      });
  }
}

export default CardService;