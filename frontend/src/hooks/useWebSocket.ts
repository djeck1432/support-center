import { useCallback, useEffect, useRef, useState } from "react";
import type { AIResponse } from "../types";

interface UseWebSocketReturn {
  connected: boolean;
  sendMessage: (text: string) => void;
  lastResponse: AIResponse | null;
  error: string | null;
  disconnect: () => void;
}

export function useWebSocket(url: string | null): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setError(data.error);
        } else {
          setLastResponse(data as AIResponse);
        }
      } catch {
        setError("Failed to parse server response");
      }
    };

    ws.onerror = () => setError("WebSocket connection error");

    ws.onclose = () => setConnected(false);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  return { connected, sendMessage, lastResponse, error, disconnect };
}
