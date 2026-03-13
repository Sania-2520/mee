'use client';

import { Users, Video, Mic, Share } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function VideoFeedPanel() {
  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 overflow-hidden group">
      <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-[#1e293b]">
        <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
          <Video className="w-4 h-4 mr-2 text-[#6366f1]" />
          Live Meeting Feed
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-[#1e293b] text-[#94a3b8]">
            <Users className="w-3 h-3 mr-1" />
            4 Participants
          </Badge>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video bg-[#0f172a] relative flex items-center justify-center overflow-hidden">
          {/* Mock Video Stream / Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] opacity-50" />
          
          <div className="z-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center mb-3 mx-auto border border-[#334155]">
              <Video className="w-8 h-8 text-[#475569]" />
            </div>
            <p className="text-xs text-[#64748b]">Video connection active</p>
          </div>

          {/* Video Overlay Info */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge className="bg-black/60 backdrop-blur-md border-transparent text-white text-[10px] py-0.5">
              Rahul (Host)
            </Badge>
          </div>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors">
              <Mic className="w-3 h-3" />
            </button>
            <button className="p-2 rounded-full bg-[#6366f1] text-white hover:bg-[#6366f1]/80 transition-colors shadow-lg shadow-[#6366f1]/20">
              <Share className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-t from-[#0f172a]/80 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94a3b8]">Meeting ID: <span className="text-[#e2e8f0]">spr-plan-2024</span></span>
            <span className="text-[10px] text-[#475569]">Started at 10:00 AM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
