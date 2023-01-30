#  Cards Marketplace (Borja Tur)

## Requirements
* node v16 or higher
* docker

## Overview, MongoDb must be running configured with replicaset before starting the application
`docker-compose up`

## Running the app
`npm install`
`npm run dev`

## Testing
`npm run test`

## Docs
Documentation available at `localhost:5050/docs`

## Notes
* Built with Fastify framework with Typescript
* 3 layers Architecture with dependency injection `HTTP layer (controllers) -> Service Layer (services) -> Database Layer (dal)`
* 4 entities (users, cards, offers, orders)
* users passwords are in clear for applying password policies at creation time, this must never happen in a real world application
* Mongodb toArray (pagination) is a simplication for not dealing with cursors or pagination for this simple exercise
* Authentication using JWT, the flow has been simplied and no emails are sent for confirmation or password reset
    * Sign up flow
    * Sign in flow
    * Two roles ['standard', 'admin']
    * Most of operations are capped for standard users
* Only the owner of a card can accept offers for such card
* When an offer is accepted an order is created following offer details
* Orders are processed by an event proccessor which would follow some bussiness rules
    * Buyer balance >= order amount
    * Balance updates and card ownership are modified as part of a DB transaction for executing all or nothing
* Some routes are not implemented (DELETE)
