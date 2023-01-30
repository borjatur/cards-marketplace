import { Type, Static } from '@sinclair/typebox';

const alphanumeric = new RegExp('^[a-z0-9]+$', 'i');

export const User = Type.Object({
  name: Type.String({ minLength: 5, maxLength: 50, pattern: '^[a-z0-9A-Z]' }),
  wallet: Type.String(),
  password: Type.String({ minLength: 8, maxLength: 12, pattern: '^[a-z0-9A-Z]' }),
  role: Type.String({ enum: ['standard', 'admin'], default: 'standard' }),
  balance: Type.Number({ minimum: 0, default: 0 }),
  currency: Type.String({ const: 'EUR', default: 'EUR' })
});

export type UserType = Static<typeof User>