import { createServer } from './server/server';
import { logger } from './utilities/logger';
import { processGameCardsGenerationRequest } from './processors/game-card-generation';

(async function main() {
  const server = createServer({ port: 9090 });

  async function shutdown() {
    try {
      await server.shutdown();
      process.exit(0);
    } catch (err) {
      logger.error(
        `[SERVER_TERMINATION_ERROR] Node server encountered an error while shutting down. error is ${err.stack}`
      );
      process.exit(1);
    }
  }

  function onUnhandledRejection(err: Error) {
    logger.error(`[UNHANDLED_REJECTION] ${err.stack}`);
    process.exit(1);
  }

  function onSIGTERM() {
    logger.info('[SIGTERM] Node server received termination signal');
    shutdown();
  }

  function onSIGINT() {
    logger.info('[SIGTINT] Node server received interruption signal');
    shutdown();
  }

  server.registerJSONHandler({
    method: 'POST',
    path: '/api/new-cards',
    handler: processGameCardsGenerationRequest,
  });
  server.registerStaticRoute([
    { url: '/app', directory: __dirname + '/client' },
  ]);

  await server.init();

  process.on('unhandledRejection', onUnhandledRejection);

  process.on('SIGINT', onSIGINT);

  process.on('SIGTERM', onSIGTERM);

  return server;
})();
