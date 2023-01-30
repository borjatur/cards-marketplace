import { MongoClient } from 'mongodb';
import createServer from './server.js';
import { createDAL } from './dal/index.js';
import CardService from 'services/card.svc.js';
import OfferService from 'services/offer.svc.js';
import UsersService from 'services/user.svc.js';
import OrderProcessor from 'services/ordersProcessor.svc.js';
import OrderService from 'services/order.svc.js';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () =>
    server.close().then((err) => {
      console.log(`close application on ${signal}`);
      process.exit(err ? 1 : 0);
    }),
  );
}

const client = new MongoClient('mongodb://localhost', {});
await client.connect();

const dal = await createDAL({
  client: client,
  database: 'marketplace',
  collections: ['offers', 'users', 'cards', 'orders']
});

const services = {
  cards: new CardService(dal),
  offers: new OfferService(dal),
  users: new UsersService(dal),
  orders: new OrderService(dal)
}

const ordersProcessor = new OrderProcessor(dal);

ordersProcessor.runWatchers();

const server = await createServer(services);

const port = Number(server.config.API_PORT);
const host = server.config.API_HOST;
await server.listen({ host, port });
