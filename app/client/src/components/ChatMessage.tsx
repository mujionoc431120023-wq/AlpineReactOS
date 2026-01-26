import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "model" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex w-full gap-4 px-4 py-8 md:px-8",
        isUser ? "bg-transparent" : "bg-slate-50/50 dark:bg-slate-900/30"
      )}
    >
      <div className="flex w-full max-w-4xl mx-auto gap-4 md:gap-6">
        <div className="shrink-0 flex flex-col items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
              isUser
                ? "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"
                : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            )}
          >
            {isUser ? <User className="w-5 h-5 opacity-70" /> : <Bot className="w-5 h-5" />}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="font-semibold text-sm mb-1 opacity-90">
            {isUser ? "You" : "CodeAI Agent"}
          </div>

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words leading-relaxed text-slate-800 dark:text-slate-200">
            {isStreaming && !content ? (
              <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
            {isStreaming && content && (
              <span className="inline-block w-2 h-4 ml-1 align-middle bg-primary animate-pulse" />
            )}
          </div>

          {!isUser && !isStreaming && (
            <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
