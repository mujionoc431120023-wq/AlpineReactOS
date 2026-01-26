import { useState, useRef, useEffect } from "react";
import { Send, Plus, Trash2, MessageSquare, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useConversations, useConversation, useCreateConversation, useDeleteConversation } from "@/hooks/use-chat";
import { useChatStream } from "@/hooks/use-chat-stream";
import { ChatMessage } from "@/components/ChatMessage";

interface Message {
  id: number;
  role: "user" | "model" | "assistant";
  content: string;
  createdAt: string;
}

function ChatInterface({ conversationId }: { conversationId: number }) {
  const { data: conversation, isLoading } = useConversation(conversationId);
  const { isStreaming, currentMessage, sendMessage } = useChatStream(conversationId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = conversation?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage]);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <ScrollArea ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && !currentMessage ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
            <Bot className="w-16 h-16 mb-4 text-blue-500/50" />
            <h2 className="text-xl font-semibold mb-2">CodeAI Agent</h2>
            <p className="text-sm text-slate-500 text-center max-w-xs">
              Start a conversation with your AI assistant. Ask questions, get help with code, or explore ideas.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg: Message) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isStreaming && currentMessage && (
              <ChatMessage role="assistant" content={currentMessage} isStreaming />
            )}
            {isStreaming && !currentMessage && (
              <ChatMessage role="assistant" content="" isStreaming />
            )}
          </>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-slate-800">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CodeAI Agent..."
            disabled={isStreaming}
            className="flex-1 min-h-[44px] max-h-[120px] bg-slate-900 border-slate-700 resize-none text-sm"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isStreaming}
            className="h-11 w-11 p-0 bg-blue-600 hover:bg-blue-700"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CodeAIAgent() {
  const { data: conversations = [], isLoading } = useConversations();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleNewChat = async () => {
    const result = await createConversation.mutateAsync("New Chat");
    setSelectedId(result.id);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation.mutateAsync(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex h-full bg-slate-950 text-slate-200">
      <div className="w-56 border-r border-slate-800 flex flex-col">
        <div className="p-2 border-b border-slate-800">
          <Button
            onClick={handleNewChat}
            disabled={createConversation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              No conversations yet
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map((conv: { id: number; title: string }) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm",
                    selectedId === conv.id
                      ? "bg-blue-600/20 text-blue-400"
                      : "hover:bg-slate-800 text-slate-400"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex-1">
        {selectedId ? (
          <ChatInterface conversationId={selectedId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Bot className="w-20 h-20 mb-4 text-blue-500/30" />
            <h2 className="text-2xl font-bold mb-2 text-blue-400">CodeAI Agent</h2>
            <p className="text-sm text-slate-500 mb-4">Your intelligent coding assistant</p>
            <Button onClick={handleNewChat} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
