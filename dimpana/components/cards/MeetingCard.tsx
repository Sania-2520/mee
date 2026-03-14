import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Meeting } from '@/lib/types';
import { Calendar, Clock, CheckCircle2, GitCommit } from 'lucide-react';
import Link from 'next/link';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const date = new Date(meeting.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const time = new Date(meeting.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <Link href={`/meetings/${meeting.id}`} className="block">
      <Card className="group overflow-hidden border-border/50 bg-card/40 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors line-clamp-1">
              {meeting.title}
            </CardTitle>
            {meeting.project && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary ml-2 whitespace-nowrap">
                {meeting.project}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-3">
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {date}</span>
            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {time} • {meeting.duration}m</span>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-4">
              {meeting.participants.slice(0, 4).map((p, i) => (
                <Avatar key={p.id} className="border-2 border-background h-8 w-8">
                  <AvatarImage src={p.avatarUrl} />
                  <AvatarFallback className="text-[10px] bg-primary/20 text-primary">{p.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
              {meeting.participants.length > 4 && (
                <Avatar className="border-2 border-background h-8 w-8">
                  <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">+{meeting.participants.length - 4}</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {meeting.participants.length} Participants
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-3 border-t border-border/50 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center hover:text-foreground transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
              {meeting.tasksCount} Tasks
            </span>
            <span className="flex items-center hover:text-foreground transition-colors">
              <GitCommit className="h-3.5 w-3.5 mr-1.5 text-primary" />
              {meeting.decisionsCount} Decisions
            </span>
          </div>
          <div className="font-medium text-foreground">
            Score: <span className="text-primary">{meeting.productivityScore}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
