import type { FastifyPluginCallback } from "fastify";
import { ServerScope, Configuration } from "nano";

declare module "fastify" {
    interface FastifyInstance {
        couch: ServerScope;
    }
}

export const fastifyCouchDB: FastifyPluginCallback<Configuration>;

export default fastifyCouchDB;
