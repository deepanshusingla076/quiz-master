import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';

type WebSocketOptions = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
};

export function useWebSocket(topic: string, options?: WebSocketOptions) {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new SockJS('/ws');
    const stompClient = over(socket);
    
    // Disable debug logs
    stompClient.debug = () => {};
    
    // Connect to the WebSocket server
    stompClient.connect(
      {},
      () => {
        setConnected(true);
        
        // Subscribe to the topic
        stompClient.subscribe(topic, (message) => {
          try {
            const payload = JSON.parse(message.body);
            setMessages((prev) => [...prev, payload]);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        });
        
        // Call onConnect callback if provided
        if (options?.onConnect) {
          options.onConnect();
        }
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
        
        // Call onError callback if provided
        if (options?.onError) {
          options.onError(error);
        }
      }
    );
    
    clientRef.current = stompClient;
    
    // Cleanup function
    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.disconnect(() => {
          setConnected(false);
          
          // Call onDisconnect callback if provided
          if (options?.onDisconnect) {
            options.onDisconnect();
          }
        });
      }
    };
  }, [topic, options]);
  
  return { messages, connected };
}