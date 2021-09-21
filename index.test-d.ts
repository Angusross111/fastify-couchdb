import fastify from "fastify";
import fastifyCouchDB from "../fastify-couchdb";

const COUCHDB_URL = "http://localhost:5984";
const TEST_DB = "test";

const app = fastify();

app.register(fastifyCouchDB, {
    url: COUCHDB_URL,
}).after((err) => {
    const mydb = app.couch.db.use(TEST_DB);
});
