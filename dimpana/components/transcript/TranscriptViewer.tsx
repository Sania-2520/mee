import { TranscriptLine } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptViewerProps {
  transcript: TranscriptLine[];
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  return (
    <div className="flex flex-col h-full border border-border/50 rounded-xl bg-card/40 overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 border-b border-border/50 flex justify-between items-center">
        <h3 className="font-medium text-sm text-foreground">Live Transcript</h3>
        <span className="text-xs text-muted-foreground flex items-center">
          <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Recording
        </span>
      </div>
      <ScrollArea className="flex-1 p-4 h-[500px]">
        <div className="space-y-6">
          {transcript.map((line, idx) => {
            const isConsecutive = idx > 0 && transcript[idx-1].speaker.id === line.speaker.id;
            
            return (
              <div key={line.id} className={`flex gap-4 ${isConsecutive ? 'mt-2' : ''}`}>
                <div className="shrink-0 w-10">
                  {!isConsecutive && (
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={line.speaker.avatarUrl} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {line.speaker.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  {!isConsecutive && (
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium text-sm text-foreground">{line.speaker.name}</span>
                      <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded leading-none">
                        {line.timestamp}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {line.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
