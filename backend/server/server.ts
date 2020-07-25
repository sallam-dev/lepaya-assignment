import { logger } from '../utilities/logger';
import express from 'express';
import http from 'http';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import {
  createJSONResponse,
  createBadRequestResponse,
  ServerResponse,
  SPARegistrationRoutes,
  Server,
  HandlerRegistrationOptions,
} from '../models/server';
import bodyParser from 'body-parser';

export function createServer(options: ServerOptions): Server {
  const _port = options.port;
  const _app = express();
  let _httpServer: http.Server;
  _app.use(bodyParser.json());
  _app.use(cors());

  const server: Server = {
    async init(): Promise<void> {
      return new Promise(function (resolve) {
        _httpServer = http.createServer(_app).listen(_port, function () {
          logger.info(`[SERVER_START] nodejs server started on port ${_port}`);
          resolve();
        });
      });
    },

    async shutdown(): Promise<void> {
      return new Promise(function (resolve, reject) {
        logger.info(`[SERVER_SHUTDOWN_INIT] nodejs server is shutting down`);

        _httpServer.close(function (err) {
          if (err) {
            logger.error(
              `[SERVER_SHUTDOWN_ERROR] an error happened while during nodejs server shutdown. Error is ${err.stack}`
            );
            reject();
          } else {
            logger.info(
              `[SERVER_SHUTDOWN_SUCCESS] nodejs server shut down successfully`
            );
            resolve();
          }
        });
      });
    },

    registerJSONHandler(options: HandlerRegistrationOptions): Server {
      const handler = options.handler;
      switch (options.method) {
        case 'POST':
          _app.post(options.path, async function jsonHandler(req, res) {
            let response: ServerResponse;
            try {
              const result = await handler(req.body);
              response = createJSONResponse(result);
            } catch (err) {
              response = createBadRequestResponse(err);
            } finally {
              res.status(response!.statusCode).json(response!.payload);
            }
          });
          break;
      }
      return server;
    },
    registerStaticRoute(routes: SPARegistrationRoutes): Server {
      routes.forEach((route) => {
        _app.use(route.url, express.static(route.directory));
      });
      return server;
    },
  };
  return server;
}

type ServerOptions = {
  port: number;
};
