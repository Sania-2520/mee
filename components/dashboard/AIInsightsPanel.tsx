'use client';

import { Sparkles, CheckCircle2, ShieldCheck, Clock, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Task {
  id: string;
  text: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface Note {
  time: string;
  text: string;
}

interface Decision {
  id: string;
  text: string;
}

export function AIInsightsPanel() {
  const notes: Note[] = [
    { time: '10:21', text: 'Backend API discussion started' },
    { time: '10:32', text: 'Rahul assigned database optimization task' },
    { time: '10:40', text: 'Budget discussion for Q2 infra' },
    { time: '10:55', text: 'Security protocol review initiated' },
  ];

  const tasks: Task[] = [
    { id: '1', text: 'Create API documentation', owner: 'Rahul', priority: 'High' },
    { id: '2', text: 'Fix staging environment deployment', owner: 'Aniket', priority: 'Medium' },
  ];

  const decisions: Decision[] = [
    { id: '1', text: 'Use React for the frontend dashboard' },
    { id: '2', text: 'Deploy on AWS infrastructure' },
  ];

  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 h-full flex flex-col">
      <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-[#6366f1]" />
          AI Insights
        </CardTitle>
        <Badge className="bg-[#6366f1]/10 text-[#6366f1] text-[10px] border-none">Real-time Analysis</Badge>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-6">
          {/* Key Notes Section */}
          <section>
            <h3 className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center">
              <Clock className="w-3 h-3 mr-1.5" />
              Key Notes
            </h3>
            <ul className="space-y-3">
              {notes.map((note, i) => (
                <li key={i} className="flex gap-3 text-sm group">
                  <span className="text-[#6366f1] font-mono shrink-0 pt-0.5">{note.time}</span>
                  <span className="text-[#e2e8f0] group-hover:text-white transition-colors">{note.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Detected Tasks Section */}
          <section>
            <h3 className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1.5" />
              Detected Tasks
            </h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg bg-[#0f172a]/40 border border-[#1e293b] hover:border-[#6366f1]/30 transition-all">
                  <p className="text-sm text-[#e2e8f0] font-medium mb-2">{task.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[11px] text-[#94a3b8]">
                      <User className="w-3 h-3 mr-1" />
                      {task.owner}
                    </div>
                    <Badge className={cn(
                      "text-[9px] px-1.5 py-0 border-none",
                      task.priority === 'High' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Decisions Section */}
          <section>
            <h3 className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              Decisions
            </h3>
            <div className="space-y-2">
              {decisions.map((decision) => (
                <div key={decision.id} className="flex items-start gap-2 text-sm p-2 rounded bg-[#6366f1]/5 border-l-2 border-[#6366f1]">
                  <p className="text-[#e2e8f0]"><span className="font-semibold">Decision:</span> {decision.text}</p>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
