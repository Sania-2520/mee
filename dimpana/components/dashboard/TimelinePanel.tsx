'use client';

import { 
  History, 
  GitCommit, 
  CheckSquare, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineEvent {
  id: string;
  time: string;
  type: 'Topic' | 'Task' | 'Decision' | 'Discussion';
  description: string;
  icon: any;
}

export function TimelinePanel() {
  const events: TimelineEvent[] = [
    { 
      id: '1', 
      time: '10:21', 
      type: 'Topic', 
      description: 'Topic started — API architecture discussion',
      icon: MessageSquare
    },
    { 
      id: '2', 
      time: '10:32', 
      type: 'Task', 
      description: 'Task assigned — Backend to Rahul',
      icon: CheckSquare
    },
    { 
      id: '3', 
      time: '10:40', 
      type: 'Decision', 
      description: 'Decision made — React selected as frontend framework',
      icon: ShieldCheck
    },
    { 
      id: '4', 
      time: '10:48', 
      type: 'Discussion', 
      description: 'Budget discussion for Q2 infrastructure',
      icon: GitCommit
    },
    { 
      id: '5', 
      time: '10:55', 
      type: 'Discussion', 
      description: 'Security protocol review and next steps',
      icon: GitCommit
    },
  ];

  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 h-full flex flex-col">
      <CardHeader className="p-4 border-b border-[#1e293b]">
        <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
          <History className="w-4 h-4 mr-2 text-[#6366f1]" />
          AI Meeting Timeline
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gradient-to-b from-[#6366f1] via-[#1e293b] to-[#1e293b]" />
          
          <div className="space-y-8">
            {events.map((event) => (
              <button 
                key={event.id} 
                className="flex items-start gap-4 w-full text-left group outline-none"
              >
                <div className="text-[11px] font-mono text-[#6366f1] pt-1.5 w-10 text-right shrink-0">
                  {event.time}
                </div>
                
                <div className="relative z-10 w-6 h-6 rounded-full bg-[#0f172a] border border-[#1e293b] flex items-center justify-center shrink-0 group-hover:border-[#6366f1] group-hover:shadow-sm group-hover:shadow-[#6366f1]/20 transition-all">
                  <event.icon className="w-3 h-3 text-[#94a3b8] group-hover:text-[#6366f1]" />
                </div>
                
                <div className="flex-1 bg-[#0f172a]/40 p-3 rounded-lg border border-transparent group-hover:border-[#1e293b] group-hover:bg-[#0f172a]/60 transition-all">
                   <div className="flex items-center justify-between mb-1">
                     <span className={cn(
                       "text-[10px] uppercase font-bold tracking-tight",
                       event.type === 'Decision' ? "text-emerald-500" : 
                       event.type === 'Task' ? "text-amber-500" : 
                       "text-[#6366f1]"
                     )}>
                       {event.type}
                     </span>
                     <ArrowRight className="w-3 h-3 text-[#475569] opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <p className="text-sm text-[#e2e8f0] leading-snug">
                     {event.description}
                   </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
