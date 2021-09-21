'use strict'

import t from 'tap'
import Fastify from 'fastify'
import fastifyCouchDB from './index.js'
import nano from 'nano'
const test = t.test

const COUCHDB_URL = 'http://admin:password@localhost:5984'
const TEST_DB = 'test'

const couch = nano(COUCHDB_URL)

t.beforeEach(() => {
  couch.db.create(TEST_DB, (err, data) => {
    if (err && err.message !== 'The database could not be created, the file already exists.') {
      t.bailout('Cannot create test db: ' + err.message)
    } else {
      console.log(data)
    }
  })
})

t.afterEach(() => {
  couch.db.destroy(TEST_DB, (err) => {
    if (err && err.message !== 'Cannot delete test db: Database does not exist.') {
      t.bailout('Cannot delete test db: ' + err.message)
    }
  })
})

test('fastify.couch namespace should exist', (t) => {
  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: COUCHDB_URL
  })

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.couch)
    fastify.close()
    t.end()
  })
})

test('should be able to connect and perform a query', async (t) => {
  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: COUCHDB_URL
  })

  fastify.ready(async (err) => {
    t.error(err)

    const mydb = fastify.couch.use(TEST_DB)
    const response = await mydb.insert({ happy: true }, 'rabbit')
    t.equal(response.id, 'rabbit')
    t.equal(response.ok, 'true')

    const doc = await mydb.get('rabbit')
    t.equal(doc.id, 'rabbit')
    t.equal(doc.happy, true)
    fastify.close()
    t.end()
  })
})

test('should accept a default db to connect to', async (t) => {
  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: `${COUCHDB_URL}/${TEST_DB}`
  })

  fastify.ready(async (err) => {
    t.error(err)
    const response = await fastify.couch.insert({ colour: 'white' }, 'rabbit')
    t.error(err)
    t.equal(response.id, 'rabbit')
    t.equal(response.ok, true)

    fastify.close()
    t.end()
  })
})
