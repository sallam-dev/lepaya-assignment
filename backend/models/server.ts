export type Server = {
  registerJSONHandler(options: HandlerRegistrationOptions): Server;
  registerStaticRoute(routes: SPARegistrationRoutes): Server;
  init(): Promise<void>;
  shutdown(): Promise<void>;
};
export type HandlerRegistrationOptions = {
  handler: RequestHandler;
  path: string;
  method: 'POST';
};
export type SPARegistrationRoutes = Array<{
  url: string;
  directory: string;
}>;

export type ServerResponse = {
  payload: unknown;
  statusCode: number;
  mimeType: string;
};
export type ServerRequest = {
  payload: unknown;
};

export type RequestHandler = (args: unknown) => Promise<unknown>;

export function createJSONResponse(payload: unknown): ServerResponse {
  return {
    payload: payload,
    statusCode: 200,
    mimeType: 'application/json',
  };
}

export function createBadRequestResponse(error: Error): ServerResponse {
  return {
    payload: {
      code: error.name,
      message: error.message,
    },
    statusCode: 400,
    mimeType: 'application/json',
  };
}
