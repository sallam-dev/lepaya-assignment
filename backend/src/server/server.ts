import { logger } from '../utilities/logger';
import express from 'express';
import http from 'http';
import history from 'connect-history-api-fallback';
import {
  RequestHandler,
  createJSONResponse,
  createBadRequestResponse,
  ServerResponse,
} from '../models/server-requests';

export function createServer(options: ServerOptions): Server {
  const _port = options.port;
  const _app = express();
  let _httpServer: http.Server;

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
              const payload = JSON.parse(req.body);
              const result = await handler(payload);
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
    useStatic(options: StaticFilesOptions): Server {
      _app.use(express.static(options.root));
      return server;
    },
    registerSPARoutes(routes: SPARegistrationRoutes): Server {
      _app.use(
        history({
          rewrites: routes.map(function ({ url, htmlPath }) {
            return {
              from: new RegExp(`^${url}`),
              to: htmlPath,
            };
          }),
        })
      );
      return server;
    },
  };
  return server;
}

type ServerOptions = {
  port: number;
};

type Server = {
  registerJSONHandler(options: HandlerRegistrationOptions): Server;
  registerSPARoutes(routes: SPARegistrationRoutes): Server;
  useStatic(options: StaticFilesOptions): Server;
  init(): Promise<void>;
  shutdown(): Promise<void>;
};
type HandlerRegistrationOptions = {
  handler: RequestHandler;
  path: string;
  method: 'POST';
};
type StaticFilesOptions = {
  root: string;
};
type SPARegistrationRoutes = Array<{
  url: string;
  htmlPath: string;
}>;
