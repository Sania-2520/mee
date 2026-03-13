'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Radio, 
  History, 
  FileText, 
  BrainCircuit, 
  Zap, 
  FolderOpen, 
  Flame, 
  Mail, 
  ExternalLink, 
  GitBranch, 
  Brain,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigationGroups = [
  {
    title: 'MEETING',
    items: [
      { name: 'Live Meeting', href: '/live', icon: Radio },
      { name: 'Meetings History', href: '/meetings', icon: History },
      { name: 'Transcripts', href: '/transcripts', icon: FileText },
    ]
  },
  {
    title: 'AI INTELLIGENCE',
    items: [
      { name: 'AI Insights', href: '#insights', icon: BrainCircuit },
      { name: 'Decision Tracker', href: '#decisions', icon: ShieldCheck },
      { name: 'Meeting Timeline', href: '#timeline', icon: History },
    ]
  },
  {
    title: 'TASK MANAGEMENT',
    items: [
      { name: 'Task Automation', href: '#automation', icon: Zap },
      { name: 'Task Categorization', href: '#categorization', icon: FolderOpen },
      { name: 'Task Priority', href: '#priority', icon: Flame },
    ]
  },
  {
    title: 'EXPORT & AUTOMATION',
    items: [
      { name: 'Email Automation', href: '#email', icon: Mail },
      { name: 'Export Tasks', href: '#export', icon: ExternalLink },
      { name: 'Flowchart Generator', href: '#flowchart', icon: GitBranch },
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { name: 'Settings', href: '#settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-[220px] flex-col border-r border-[#1e293b] bg-[#0f172a] text-[#e2e8f0] transition-all duration-300">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#1e293b]">
        <Brain className="h-6 w-6 text-[#6366f1] mr-3" />
        <span className="font-heading font-bold text-lg tracking-tight">MeetingMind</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6 scrollbar-hide">
        <nav className="flex-1 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-semibold text-[#94a3b8] tracking-wider uppercase mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    className={cn(
                      'w-full group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors mb-0.5',
                      isActive 
                        ? 'bg-[#6366f1]/10 text-[#6366f1]' 
                        : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#e2e8f0]'
                    )}
                    onClick={() => {
                      if (item.name === 'Task Automation') {
                        // Dispatch custom event to be caught by DashboardContainer
                        window.dispatchEvent(new CustomEvent('open-task-window'));
                      }
                    }}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-[#6366f1]' : 'text-[#94a3b8] group-hover:text-[#6366f1]'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
      <div className="shrink-0 p-4 border-t border-[#1e293b]">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1] font-bold text-xs uppercase border border-[#6366f1]/30">
            AJ
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-[#e2e8f0]">Alex Johnson</p>
            <p className="text-[11px] font-medium text-[#94a3b8]">Product Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
