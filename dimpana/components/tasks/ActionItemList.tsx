import { Task } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionItemListProps {
  tasks: Task[];
}

export function ActionItemList({ tasks }: ActionItemListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-xl">
        <p className="text-muted-foreground">No action items assigned in this meeting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const date = new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return (
          <div 
            key={task.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card/40 hover:bg-muted/40 transition-colors gap-4"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1">
                {task.status === 'Completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                )}
              </div>
              <div>
                <h4 className={cn("font-medium text-sm", task.status === 'Completed' && "line-through text-muted-foreground")}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="bg-background text-[10px] px-1.5 py-0">
                    {task.category}
                  </Badge>
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm",
                    task.priority === 'High' ? "bg-destructive/10 text-destructive" :
                    task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                    "bg-blue-500/10 text-blue-500"
                  )}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 sm:justify-end ml-9 sm:ml-0">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {date}
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 border border-border">
                  <AvatarImage src={task.assignee.avatarUrl} />
                  <AvatarFallback className="text-[10px]">{task.assignee.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline-block">
                  {task.assignee.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
