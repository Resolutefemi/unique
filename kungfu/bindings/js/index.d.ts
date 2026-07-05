// Type definitions for @kungfu/core — the polyglot web framework.

export interface JsRequest {
  request_id: number;
  method: string;
  path: string;
  query: string;
  params: string;
  headers: string;
  body: string;
}

export interface JsResponse {
  status: number;
  body: string;
}

export type Handler = (req: JsRequest) => JsResponse | Promise<JsResponse>;

export declare class KungfuApp {
  constructor();
  get(path: string, handler: (req: string) => void): Promise<void>;
  post(path: string, handler: (req: string) => void): Promise<void>;
  put(path: string, handler: (req: string) => void): Promise<void>;
  delete(path: string, handler: (req: string) => void): Promise<void>;
  respond(requestId: number, response: JsResponse): Promise<void>;
  listen(port: number): Promise<void>;
}

export declare class Kungfu {
  constructor();
  get(path: string, handler: Handler): Promise<void>;
  post(path: string, handler: Handler): Promise<void>;
  put(path: string, handler: Handler): Promise<void>;
  delete(path: string, handler: Handler): Promise<void>;
  listen(port: number): Promise<void>;
}

export declare function compileCss(classes: string): string;
export declare function compileCssDir(dir: string): string;
export declare function version(): string;
