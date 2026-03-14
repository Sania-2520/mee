'use client';

import { Bot, X, Send, User, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your AI Meeting Assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        text: `I've analyzed the current meeting. Regarding "${inputValue}", here's what I found: [Mock Summary of Meeting Intelligence]` 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-80 sm:w-96 border-[#1e293b] bg-[#1e293b]/95 backdrop-blur-xl shadow-2xl overflow-hidden shadow-[#000000]/50">
              <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between bg-gradient-to-r from-[#6366f1]/20 to-transparent">
                <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center mr-3 shadow-lg shadow-[#6366f1]/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  Meeting Intelligence AI
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#94a3b8] hover:text-[#e2e8f0]" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <ScrollArea ref={scrollRef} className="h-[350px] p-4 bg-[#0f172a]/20">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[85%] p-3 rounded-2xl text-[13px] shadow-sm",
                        msg.role === 'user' 
                          ? "bg-[#6366f1] text-white rounded-tr-none" 
                          : "bg-[#1e293b] border border-[#334155] text-[#e2e8f0] rounded-tl-none"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <CardFooter className="p-3 border-t border-[#1e293b] bg-[#1e293b]/50">
                <div className="flex w-full gap-2">
                  <Input 
                    placeholder="Ask about tasks, decisions..." 
                    className="flex-1 bg-[#0f172a]/40 border-[#334155] text-sm text-[#e2e8f0] h-9 focus-visible:ring-[#6366f1]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button size="icon" onClick={handleSend} className="bg-[#6366f1] hover:bg-[#6366f1]/90 shadow-lg shadow-[#6366f1]/20 h-9 w-9">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform",
          isOpen ? "bg-[#1e293b] rotate-90" : "bg-[#6366f1] hover:scale-105 active:scale-95 shadow-[#6366f1]/40"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#e2e8f0]" />
        ) : (
          <Bot className="w-7 h-7 text-white" />
        )}
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0f172a] animate-bounce" />
        )}
      </button>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
