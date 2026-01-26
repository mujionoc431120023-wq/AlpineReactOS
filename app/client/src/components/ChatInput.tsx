import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Sparkles, Loader2, Paperclip, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGenerateImage } from "@/hooks/use-chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSend: (message: string, attachment?: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Ask me anything..." }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { mutate: generateImage, isPending: isGeneratingImage } = useGenerateImage();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleSubmit = () => {
    if ((!input.trim() && !attachment) || disabled) return;
    onSend(input, attachment || undefined);
    setInput("");
    setAttachment(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    generateImage(imagePrompt, {
      onSuccess: (data) => {
        setGeneratedImage(`data:${data.mimeType};base64,${data.b64_json}`);
      },
    });
  };

  const insertImageToChat = () => {
    if (!generatedImage) return;
    // For now, we'll just insert markdown image syntax. 
    // In a real app with file uploads, we'd handle this more robustly.
    const markdownImage = `![Generated Image](${generatedImage})`;
    onSend(markdownImage);
    setIsImageDialogOpen(false);
    setGeneratedImage(null);
    setImagePrompt("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-8">
      {attachment && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit animate-in fade-in slide-in-from-bottom-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
          <button 
            onClick={removeAttachment}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="relative group bg-slate-50 dark:bg-slate-900 rounded-3xl border border-border shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[60px] max-h-[200px] px-6 py-4 pr-40 bg-transparent border-none resize-none focus-visible:ring-0 text-base md:text-lg rounded-3xl placeholder:text-muted-foreground/50"
          rows={1}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {/* File Attachment Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                  disabled={disabled}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Image Generation Button */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                title="Generate Image"
                disabled={disabled}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate an Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex gap-2">
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    className="min-h-[80px]"
                  />
                </div>
                {generatedImage && (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={generatedImage} alt="Generated" className="w-full h-auto object-cover" />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateImage} 
                    disabled={isGeneratingImage || !imagePrompt}
                  >
                    {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate
                  </Button>
                  {generatedImage && (
                    <Button onClick={insertImageToChat}>
                      Send to Chat
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={(!input.trim() && !attachment) || disabled}
            className={cn(
              "h-10 w-10 rounded-full transition-all duration-300",
              (input.trim() || attachment)
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/25" 
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-200"
            )}
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-3">
        <p className="text-xs text-muted-foreground">
          Gemini may display inaccurate info, including about people, so double-check its responses.
        </p>
      </div>
    </div>
  );
}
