import { OrderType } from '../models/order.model.js';
import { OrderResponseType } from '../schemas/order.schema.js'

class OrderService {
  dal: any

  constructor(dal: any) {
    this.dal = dal;
  }

  async insertOrder(order: OrderType): Promise<any> {
    return this.dal.orders.storeOne(order);
  }

  async getOrderById(id: string): Promise<any> {
    return this.dal
      .orders
      .get(id)
      .then((c: any[]) => {
        const result = c[0];
        if (result) {
          return { 
            ...result,
            _id: result._id.toString(),
            owner: result.owner.toString(),
            cardId: result.owner.toString()
          }
        }
      });
  }

  async getAllOrders(): Promise<any> {
    return this.dal.orders.get();
  }

  async updateOrderById(id: string, order: OrderType): Promise<OrderResponseType> {
    return this.dal
      .cards
      .store({ ...order, _id: id })
      .then((c: any[]) => {
        const result = c[0].value;
        return { 
          ...result,
          _id: result._id.toString(),
          owner: result.owner.toString(),
          cardId: result.cardId.toString()
        };
      });
  }
}

export default OrderService;