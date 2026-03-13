'use client';

import { Settings, Share2, FileDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeaderBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Sprint Planning Meeting</h1>
          <Badge className="bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/20 hover:bg-[#6366f1]/20">
            <span className="w-2 h-2 rounded-full bg-[#6366f1] mr-2 animate-pulse" />
            Live Recording
          </Badge>
        </div>
        <p className="text-sm text-[#94a3b8]">
          Participants: <span className="text-[#e2e8f0]">Rahul, Priya, Aniket, Alex (You)</span>
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" className="border-[#1e293b] bg-[#1e293b]/50 text-[#e2e8f0] hover:bg-[#1e293b]">
          <FileDown className="w-4 h-4 mr-2 text-[#94a3b8]" />
          Export Meeting
        </Button>
        <Button className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 shadow-lg shadow-[#6366f1]/20">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Summary
        </Button>
      </div>
    </div>
  );
}
