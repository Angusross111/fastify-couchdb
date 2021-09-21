'use strict'

import fp from 'fastify-plugin'
import nano from 'nano'

function fastifyCouchDB (fastify, options, next) {
  const couch = nano(options)
  fastify.decorate('couch', couch)
  next()
}

export default fp(fastifyCouchDB, {
  fastify: '>=3.21.0',
  name: 'fastify-couchdb'
})
