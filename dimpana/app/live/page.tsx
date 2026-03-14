'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TranscriptLine } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, VideoOff, Square, Share, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveMeetingPage() {
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    async function loadInitial() {
      const data = await api.getTranscript('m1');
      setTranscript(data);
    }
    loadInitial();
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            {isRecording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isRecording ? 'bg-destructive' : 'bg-muted'}`}></span>
          </div>
          <h1 className="text-2xl font-bold font-heading">Q3 Product Roadmap Planning</h1>
          <span className="text-muted-foreground ml-2 text-sm font-mono bg-muted px-2 py-0.5 rounded">00:45:12</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-muted-foreground border-border/50 bg-card/50">
            <Share className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button 
            variant={isRecording ? 'destructive' : 'default'}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? <><Square className="h-4 w-4 mr-2 fill-current" /> Stop</> : <><Mic className="h-4 w-4 mr-2" /> Resume</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Video & Key Points */}
        <div className="col-span-1 flex flex-col gap-6 min-h-0">
          <Card className="shrink-0 border-border/50 bg-card/40 overflow-hidden relative">
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <VideoOff className="h-12 w-12 mb-2 opacity-20" />
                <span className="text-xs font-medium uppercase tracking-widest opacity-50">Camera Off</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
              <div className="bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded flex items-center">
                <Mic className="h-3 w-3 mr-1" /> Alex (You)
              </div>
            </div>
          </Card>

          <Card className="flex-1 flex flex-col border-border/50 bg-primary/5 border-primary/20 min-h-0">
            <CardHeader className="py-3 px-4 border-b border-primary/10 bg-primary/10 shrink-0">
              <CardTitle className="text-sm font-heading flex items-center text-primary">
                <Sparkles className="h-4 w-4 mr-2" /> Live AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 bg-card border border-border/50 rounded-lg text-sm text-foreground shadow-sm">
                  <span className="font-semibold text-primary block mb-1">Decision Recorded:</span>
                  Mobile app redesign will be the primary focus for Q3.
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-3 bg-card border border-border/50 rounded-lg text-sm text-foreground shadow-sm">
                  <span className="font-semibold text-amber-500 flex items-center mb-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> Action Item Suggested
                  </span>
                  James to start working on new wireframes this week.
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="secondary" className="h-6 text-[10px] px-2">Accept</Button>
                    <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 text-muted-foreground">Dismiss</Button>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Live Transcript */}
        <Card className="col-span-1 flex flex-col border-border/50 bg-card/40 min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/30 shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-heading">Live Transcript</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative overflow-hidden">
            <ScrollArea className="h-full px-4 py-4 w-full">
              <div className="space-y-4 pb-12">
                {transcript.map((line, idx) => {
                  const isConsecutive = idx > 0 && transcript[idx-1].speaker.id === line.speaker.id;
                  return (
                    <div key={line.id} className={`flex gap-3 ${isConsecutive ? 'mt-1' : ''}`}>
                      <div className="shrink-0 w-8">
                        {!isConsecutive && (
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage src={line.speaker.avatarUrl} />
                            <AvatarFallback className="text-[10px]">{line.speaker.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex-1">
                        {!isConsecutive && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="font-medium text-xs text-foreground">{line.speaker.name}</span>
                            <span className="text-[10px] text-muted-foreground">{line.timestamp}</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 inline-block px-2 py-1 rounded w-full">
                          {line.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        {/* Right Column: User Notes */}
        <Card className="col-span-1 flex flex-col border-border/50 bg-card/40 min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/30 shrink-0">
            <CardTitle className="text-sm font-heading">Personal Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Textarea 
              placeholder="Jot down your private notes here... (Rich text support)"
              className="w-full h-full min-h-[300px] border-0 focus-visible:ring-0 resize-none rounded-none bg-transparent p-4 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
