'use client';

import { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  User, 
  Clock, 
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Done';
}

interface TaskManagementWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskManagementWindow({ isOpen, onClose }: TaskManagementWindowProps) {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Build Backend API',
      owner: 'Rahul',
      priority: 'High',
      deadline: 'Tomorrow',
      status: 'Pending'
    },
    {
      id: '2',
      title: 'Prepare Documentation',
      owner: 'Priya',
      priority: 'Medium',
      deadline: 'Friday',
      status: 'In Progress'
    },
    {
      id: '3',
      title: 'Setup Staging Environment',
      owner: 'Aniket',
      priority: 'High',
      deadline: 'Today',
      status: 'Pending'
    },
    {
      id: '4',
      title: 'Design Review',
      owner: 'Alex',
      priority: 'Low',
      deadline: 'Next Week',
      status: 'Done'
    }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#0f172a] border-l border-[#1e293b] shadow-2xl shadow-black/50 z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#1e293b] bg-[#1e293b]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#6366f1]/20 flex items-center justify-center border border-[#6366f1]/30">
            <CheckSquare className="w-5 h-5 text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#e2e8f0]">Task Management</h2>
            <p className="text-xs text-[#94a3b8]">Generated from Meeting Intelligence</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1e293b]">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 flex gap-2 border-b border-[#1e293b]">
        <Button size="sm" className="bg-[#1e293b] text-[#e2e8f0] hover:bg-[#334155] border border-[#334155]">
          All Tasks
        </Button>
        <Button size="sm" variant="ghost" className="text-[#94a3b8] hover:text-[#e2e8f0]">
          Pending
        </Button>
        <Button size="sm" variant="ghost" className="text-[#94a3b8] hover:text-[#e2e8f0]">
          My Tasks
        </Button>
      </div>

      {/* Task List */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#1e293b]/50 border border-[#1e293b] rounded-xl p-4 hover:border-[#6366f1]/40 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-semibold text-[#e2e8f0] leading-tight pr-4">
                  {task.title}
                </h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-[#475569] opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-1">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[#475569] uppercase tracking-wider text-[10px] font-semibold">Owner</span>
                  <div className="flex items-center text-[#e2e8f0]">
                    <User className="w-3.5 h-3.5 mr-1.5 text-[#94a3b8]" />
                    {task.owner}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[#475569] uppercase tracking-wider text-[10px] font-semibold">Priority</span>
                  <div className="flex items-center">
                    <Badge className={cn(
                      "px-1.5 py-0 border-none text-[10px] h-4",
                      task.priority === 'High' ? "bg-red-500/10 text-red-500" :
                      task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"
                    )}>
                      {task.priority === 'High' && <AlertCircle className="w-2.5 h-2.5 mr-1" />}
                      {task.priority}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[#475569] uppercase tracking-wider text-[10px] font-semibold">Deadline</span>
                  <div className="flex items-center text-[#e2e8f0]">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-[#94a3b8]" />
                    {task.deadline}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[#475569] uppercase tracking-wider text-[10px] font-semibold">Status</span>
                  <div className="flex items-center">
                    <span className={cn(
                      "flex items-center gap-1.5",
                      task.status === 'Done' ? "text-emerald-500" :
                      task.status === 'In Progress' ? "text-[#22d3ee]" :
                      "text-[#94a3b8]"
                    )}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 border-t border-[#1e293b] bg-[#1e293b]/30">
        <Button className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white shadow-lg shadow-[#6366f1]/20">
          Sync with Jira / Linear
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
