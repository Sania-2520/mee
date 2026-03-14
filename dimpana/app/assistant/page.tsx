'use client';

import { useState, useEffect, useRef } from 'react';
import { api, mockChatHistory } from '@/lib/api';
import { ChatMessage } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, Send, Sparkles, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const response = await api.sendChatMessage(userMessage.content);
    
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const suggestions = [
    "What decisions were made in yesterday's meeting?",
    "Show my pending tasks.",
    "Summarize the main action items from the Product sync."
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center">
      <div className="w-full max-w-4xl flex-1 flex flex-col shadow-sm rounded-2xl overflow-hidden border border-border/50 bg-card/20 backdrop-blur-sm">
        
        <div className="bg-card/70 border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg leading-tight">MeetingMind Assistant</h2>
              <p className="text-xs text-muted-foreground flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-primary" /> Powered by AI
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6 pb-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-70">
                <BrainCircuit className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-heading font-medium mb-2">How can I help you today?</h3>
                <p className="text-muted-foreground max-w-md">Ask me questions about past meetings, decisions, required tasks, or ask for summaries.</p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <Avatar className="h-8 w-8 mt-1 border border-border/50 shrink-0">
                    {message.role === 'assistant' ? (
                      <div className="h-full w-full bg-primary flex items-center justify-center text-primary-foreground">
                        <BrainCircuit className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    )}
                  </Avatar>
                  
                  <div className={cn(
                    "rounded-2xl px-5 py-3 shadow-sm",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                  )}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={cn(
                      "text-[10px] mt-2 text-right",
                      message.role === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <Avatar className="h-8 w-8 border border-border/50 shrink-0">
                  <div className="h-full w-full bg-primary flex items-center justify-center text-primary-foreground">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                </Avatar>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1.5 items-center w-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                </div>
              </motion.div>
            )}
            
            {/* Invis block to ensure bottom scrolling pad */}
            <div className="h-4" />
          </div>
        </ScrollArea>

        <div className="p-4 bg-muted/20 border-t border-border/50">
          <div className="flex gap-2 w-full overflow-x-auto pb-3 scrollbar-hide">
            {suggestions.map((s, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="rounded-full shrink-0 h-8 text-xs bg-background/50 hover:bg-card border-border/60"
                onClick={() => setInputValue(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="relative mt-1">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about your meetings..." 
              className="pr-12 bg-background border-border/80 h-12 rounded-xl text-base"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 transition-all"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">AI responses may occasionally be inaccurate. Compare output with transcripts when verifying decisions.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
