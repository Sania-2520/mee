'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Users, Video, Mic, MicOff, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export function VideoFeedPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const meetingId = "spr-plan-2024";

  // Jitsi video meeting
  useEffect(() => {
    const loadMeeting = () => {
      if (!containerRef.current) return;

      const domain = "meet.jit.si";
      const options = {
        roomName: "spr-plan-2025",
        width: "100%",
        height: 500,
        parentNode: containerRef.current,
        userInfo: {
          displayName: "User"
        }
      };

      new window.JitsiMeetExternalAPI(domain, options);
    };

    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = loadMeeting;
      document.body.appendChild(script);
    } else {
      loadMeeting();
    }
  }, []);

  // WebSocket for transcription streaming
  const connectWS = useCallback(() => {
    const wsUrl = `ws://localhost:8000/live_meeting/ws/${meetingId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Audio WS connected");
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("Audio WS error:", error);
      setIsConnected(false);
    };

    wsRef.current = ws;
  }, [meetingId]);

  const startRecording = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current!.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          wsRef.current!.send(audioBlob);
        }
        chunksRef.current = [];
      };

      // Send chunks every 5 seconds during recording
      const intervalId = setInterval(() => {
        if (chunksRef.current.length > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          wsRef.current!.send(audioBlob);
          chunksRef.current = [];
        }
      }, 5000);

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        connectWS();
      }

      // Cleanup interval on stop
      mediaRecorderRef.current!.addEventListener('stop', () => clearInterval(intervalId as any), { once: true });
    } catch (err) {
      console.error("Mic access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 overflow-hidden group h-full flex flex-col">
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
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`} />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Jitsi meeting container */}
        <div ref={containerRef} className="aspect-video w-full bg-black flex-shrink-0" />

        {/* Audio Transcription Controls */}
        <div className="p-4 border-t border-[#1e293b] bg-gradient-to-t from-[#0f172a]/80 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94a3b8]">
              Meeting ID: <span className="text-[#e2e8f0] font-mono">{meetingId}</span>
            </span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] text-[#475569]">
                <Radio className={`w-3 h-3 ${isConnected ? 'text-emerald-500' : 'text-yellow-500'}`} />
                {isConnected ? 'Live Transcription' : 'Connect'}
              </div>
              <Button
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="h-8 px-3 text-xs font-medium"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3 h-3 mr-1" />
                    Stop Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3 mr-1" />
                    Start Mic
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
