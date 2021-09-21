import fastify from 'fastify'
import fastifyCouchDB from '../index.js'
const COUCHDB_URL = 'http://admin:password@localhost:5984'

const server = fastify()
server.register(fastifyCouchDB, { url: COUCHDB_URL })

server.get('/create', async (request, reply) => {
  const response = await server.couch.db.create('alice')
  reply.send({ ok: response.ok })
})

server.get('/insert', async (request, reply) => {
  const alice = server.couch.use('alice')
  const response = await alice.insert({ happy: true }, 'rabbit')
  reply.send({ ok: response.ok })
})

server.get('/get', async (request, reply) => {
  const alice = server.couch.use('alice')
  const doc = await alice.get('rabbit')
  console.log(doc)
  reply.send({ doc: doc })
})

const start = async () => {
  try {
    await server.listen(3000)
    console.log('Listening on http://127.0.0.1:3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
