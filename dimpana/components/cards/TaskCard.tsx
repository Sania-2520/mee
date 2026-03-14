import { Task } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function TaskCard({ task }: { task: Task }) {
  const isCompleted = task.status === 'Completed';
  const date = new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Card className={cn(
      "border-border/50 bg-card/40 transition-all hover:bg-card hover:shadow-md group flex flex-col h-full",
      isCompleted && "opacity-75"
    )}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <Badge variant="outline" className="bg-background">
          {task.category}
        </Badge>
        <Badge className={cn(
          "bg-transparent border",
          task.priority === 'High' ? "border-destructive text-destructive bg-destructive/10" :
          task.priority === 'Medium' ? "border-amber-500 text-amber-500 bg-amber-500/10" :
          "border-blue-500 text-blue-500 bg-blue-500/10"
        )}>
          {task.priority}
        </Badge>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1">
        <h3 className={cn(
          "font-heading font-semibold text-base mb-3 transition-colors",
          isCompleted ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary"
        )}>
          {task.title}
        </h3>
        
        <div className="flex items-center text-xs text-muted-foreground bg-muted/30 w-max px-2 py-1 rounded">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          {date}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center bg-muted/10 mt-auto">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarImage src={task.assignee.avatarUrl} />
            <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
              {task.assignee.name.substring(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">
            {task.assignee.name.split(' ')[0]}
          </span>
        </div>
        
        {isCompleted ? (
          <div className="flex items-center text-sm text-emerald-500 font-medium">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Done
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="h-8 text-xs px-3 border border-border/50">
            Mark Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
