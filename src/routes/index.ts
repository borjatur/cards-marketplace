import userRoutes from './user.routes.js'
import cardRoutes from './card.routes.js'
import offerRoutes from './offer.routes.js'
import orderRoutes from './order.routes.js'
import authRoutes from './auth.routes.js'

export default [
  ...authRoutes,
  ...userRoutes,
  ...cardRoutes,
  ...offerRoutes,
  ...orderRoutes
];