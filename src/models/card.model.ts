import { Type, Static } from '@sinclair/typebox';

export const Card = Type.Object({
  _id: Type.Optional(Type.String()),
  name: Type.String(),
  description: Type.String(),
  owner: Type.String(),
  price: Type.Number(),
  currency: Type.Optional(Type.String({ const: 'EUR', default: 'EUR' }))
});

export type CardType = Static<typeof Card>