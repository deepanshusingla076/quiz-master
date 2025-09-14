declare module 'stompjs' {
  export interface Frame {
    command: string;
    headers: { [key: string]: string };
    body: string;
    toString(): string;
  }

  export interface Client {
    connected: boolean;
    connect(headers: { [key: string]: string }, connectCallback: () => void, errorCallback?: (error: any) => void): void;
    disconnect(disconnectCallback?: () => void): void;
    send(destination: string, headers?: { [key: string]: string }, body?: string): void;
    subscribe(destination: string, callback: (message: { body: string }) => void, headers?: { [key: string]: string }): { id: string; unsubscribe: () => void };
    debug: (message: string) => void;
  }

  export function over(ws: any): Client;
}

declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: { [key: string]: any });
  }
}