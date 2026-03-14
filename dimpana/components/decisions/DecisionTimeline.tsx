import { Decision } from '@/lib/types';
import { GitCommit, AlertTriangle, CheckCircle, RefreshCw, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface DecisionTimelineProps {
  decisions: Decision[];
}

export function DecisionTimeline({ decisions }: DecisionTimelineProps) {
  if (decisions.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/20">
        <p className="text-muted-foreground">No decisions recorded.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l border-border ml-4 md:ml-6 space-y-8 py-4">
      {decisions.map((decision, idx) => {
        const isConflict = decision.status === 'Conflict detected';
        const isUpdated = decision.status === 'Updated';
        const isConfirmed = decision.status === 'Confirmed';
        
        const date = new Date(decision.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <div key={decision.id} className="relative pl-8 md:pl-10">
            {/* Timeline dot/icon */}
            <div className={cn(
              "absolute left-[-16px] top-1 h-8 w-8 rounded-full border-4 border-background flex items-center justify-center",
              isConflict ? "bg-destructive text-destructive-foreground" :
              isUpdated ? "bg-amber-500 text-amber-50" :
              "bg-primary text-primary-foreground"
            )}>
              {isConflict ? <AlertTriangle className="h-3 w-3" /> :
               isUpdated ? <RefreshCw className="h-3 w-3" /> :
               <CheckCircle className="h-3 w-3" />}
            </div>

            <Card className={cn(
              "border-border/50 bg-card/40 transition-all hover:bg-card hover:shadow-md",
              isConflict && "border-destructive/30 bg-destructive/5"
            )}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-heading font-semibold text-base">{decision.title}</h4>
                      <span className={cn(
                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                        isConflict ? "border-destructive bg-destructive/10 text-destructive" :
                        isUpdated ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                        "border-primary/30 bg-primary/10 text-primary"
                      )}>
                        {decision.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {decision.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex items-center text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {date}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
