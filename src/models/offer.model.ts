import { Type, Static } from '@sinclair/typebox';

export const Offer = Type.Object({
  owner: Type.String(),
  amount: Type.Number(),
  currency: Type.Optional(Type.String({ const: 'EUR', default: 'EUR' })),
  cardId: Type.String(),
  status: Type.String({ enum: ['pending', 'declined', 'accepted', 'fullfilled', 'canceled'], default: 'pending' })
});

export type OfferType = Static<typeof Offer>