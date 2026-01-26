import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

type StreamState = {
  isStreaming: boolean;
  currentMessage: string;
  error: string | null;
};

export function useChatStream(conversationId: number) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    currentMessage: "",
    error: null,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, attachment?: File) => {
    setState((prev) => ({ ...prev, isStreaming: true, error: null, currentMessage: "" }));
    abortControllerRef.current = new AbortController();

    try {
      let body: string | FormData;
      let headers: Record<string, string> = {};

      if (attachment) {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("file", attachment);
        body = formData;
        // Fetch will set the correct multipart boundary automatically if headers is empty
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ content });
      }

      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers,
        body,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.done) {
                setState((prev) => ({ ...prev, isStreaming: false }));
                // Invalidate queries to fetch the full persisted message history and updated title
                queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
                queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
                return;
              }
              
              if (data.content) {
                setState((prev) => ({
                  ...prev,
                  currentMessage: prev.currentMessage + data.content,
                }));
              }
            } catch (e) {
              console.warn("Failed to parse SSE line:", line);
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        console.error("Stream error:", err);
        setState((prev) => ({ ...prev, isStreaming: false, error: "Failed to generate response" }));
      }
    }
  }, [conversationId, queryClient]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState((prev) => ({ ...prev, isStreaming: false }));
    }
  }, []);

  return {
    ...state,
    sendMessage,
    stopStream,
  };
}
