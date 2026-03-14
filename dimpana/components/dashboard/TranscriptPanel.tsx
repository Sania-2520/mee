'use client';

import { MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';

interface TranscriptEntry {
  id: string;
  speaker: string;
  time: string;
  text: string;
}

export function TranscriptPanel() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const meetingId = "spr-plan-2024";

  useEffect(() => {
    async function loadTranscript() {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/meetings/${meetingId}`);
        const data = await res.json();

        if (data.transcript) {
          const lines = data.transcript.split(/\n+/).filter((line: string) => line.trim());
          const transcriptEntries = lines.map((text: string, index: number) => ({
            id: String(Date.now() + index),
            speaker: "Speaker",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            text: text.trim()
          }));
          setEntries(transcriptEntries);
        }
      } catch (error) {
        console.error("Failed to load transcript", error);
      }
    }

    loadTranscript();
  }, []);

  // WebSocket for live transcription updates
  useEffect(() => {
    const wsUrl = `ws://localhost:8000/live_meeting/ws/${meetingId}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected for live transcript");
    };

    websocket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "transcript_update") {
          const newEntry: TranscriptEntry = {
            id: String(Date.now()),
            speaker: payload.speaker || "Speaker",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            text: payload.text
          };
          setEntries(prev => [...prev, newEntry]);
        }
      } catch (e) {
        console.error("WS message parse error:", e);
      }
    };

    websocket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight;
      }
    }
  }, [entries]);

  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 h-full flex flex-col">

      <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between">

        <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-[#6366f1]" />
          Live Transcript
        </CardTitle>

        <div className="flex items-center gap-2">
          <Badge className={isConnected ? "bg-emerald-500/10 text-emerald-500 border-none text-[10px]" : "bg-yellow-500/10 text-yellow-500 border-none text-[10px]"}>
            {isConnected ? "Live" : "Connecting"}
          </Badge>
          <span className="text-[10px] text-[#475569] italic">
            AI Processing
          </span>
        </div>

      </CardHeader>

      <ScrollArea ref={scrollRef} className="flex-1">

        <CardContent className="p-4 space-y-4 font-mono text-[13px]">

          {entries.length === 0 ? (

            <p className="text-[#64748b] text-sm">
              Transcript will appear here once audio is processed.
            </p>

          ) : (

            entries.map((entry) => (

              <div
                key={entry.id}
                className="p-3 rounded-lg hover:bg-[#0f172a]/40"
              >

                <div className="flex items-center gap-2 mb-1.5">

                  <span className="font-bold text-[#6366f1]">
                    {entry.speaker}
                  </span>

                  {entry.time && (
                    <span className="text-[#475569] text-[11px] flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {entry.time}
                    </span>
                  )}

                </div>

                <p className="text-[#94a3b8] leading-relaxed">
                  {entry.text}
                </p>

              </div>

            ))

          )}

        </CardContent>

      </ScrollArea>
    </Card>
  );
}
