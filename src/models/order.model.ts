import { Type, Static } from '@sinclair/typebox';

export const Order = Type.Object({
  amount: Type.Number(),
  currency: Type.String({ const: 'EUR' }),
  owner: Type.String(),
  cardId: Type.String(),
  offerId: Type.Optional(Type.String({ default: undefined })),
  status: Type.String({ enum: ['pending', 'fullfilled', 'canceled'], default: 'pending' }),
  statusReason: Type.Optional(Type.String())
});

export type OrderType = Static<typeof Order>