'use client';

import { MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef } from 'react';

interface TranscriptEntry {
  id: string;
  speaker: string;
  time: string;
  text: string;
  isTask?: boolean;
}

export function TranscriptPanel() {
  const entries: TranscriptEntry[] = [
    { id: '1', speaker: 'Rahul', time: '10:21', text: 'We should finalize the API structure today so we can start backend development tomorrow.' },
    { id: '2', speaker: 'Priya', time: '10:22', text: 'I agree. I can prepare the technical documentation based on our previous whiteboard session.' },
    { id: '3', speaker: 'Rahul', time: '10:21', text: 'Perfect. Rahul, please take ownership of the API documentation and aim for a first draft by EOD.', isTask: true },
    { id: '4', speaker: 'Aniket', time: '10:24', text: 'What about the deployment pipeline? I noticed some issues with the staging build yesterday.' },
    { id: '5', speaker: 'Sarah', time: '10:25', text: 'I can look into that after the meeting. Probably just a configuration mismatch in the YAML files.' },
    { id: '6', speaker: 'Rahul', time: '10:26', text: 'Thanks Sarah. Let\'s also make sure we decide on the frontend framework. Is everyone okay with React?' },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 h-full flex flex-col">
      <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-[#6366f1]" />
          Live Transcript
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Active</Badge>
          <span className="text-[10px] text-[#475569] italic">Real-time processing</span>
        </div>
      </CardHeader>
      
      <ScrollArea ref={scrollRef} className="flex-1">
        <CardContent className="p-4 space-y-4 font-mono text-[13px]">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className={cn(
                "p-3 rounded-lg transition-colors group",
                entry.isTask 
                  ? "bg-[#6366f1]/10 border border-[#6366f1]/20" 
                  : "hover:bg-[#0f172a]/40"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-[#6366f1]">{entry.speaker}</span>
                <span className="text-[#475569] text-[11px] flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {entry.time}
                </span>
                {entry.isTask && (
                  <Badge className="bg-amber-500 text-white text-[9px] h-4 py-0 transition-transform scale-90">
                    <AlertCircle className="w-2.5 h-2.5 mr-1" />
                    Task Detected
                  </Badge>
                )}
              </div>
              <p className={cn(
                "leading-relaxed",
                entry.isTask ? "text-[#e2e8f0] font-medium" : "text-[#94a3b8]"
              )}>
                {entry.text}
              </p>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
