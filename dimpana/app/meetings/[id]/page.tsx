'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Meeting, TranscriptLine, Task, Decision } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TranscriptViewer } from '@/components/transcript/TranscriptViewer';
import { ActionItemList } from '@/components/tasks/ActionItemList';
import { DecisionTimeline } from '@/components/decisions/DecisionTimeline';
import { SpeakingTimeChart } from '@/components/charts/SpeakingTimeChart';
import { Calendar, Clock, Video, List, CheckSquare, GitCommit, Activity, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = params.id as string;
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [m, tr, ts, ds] = await Promise.all([
        api.getMeeting(meetingId),
        api.getTranscript(meetingId),
        api.getTasks(),
        api.getDecisions()
      ]);
      setMeeting(m || null);
      setTranscript(tr);
      setTasks(ts.filter(t => t.meetingId === meetingId));
      setDecisions(ds.filter(d => d.meetingId === meetingId));
      setIsLoading(false);
    }
    loadData();
  }, [meetingId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-muted-foreground">
        <p>Meeting not found.</p>
        <Link href="/meetings"><Button variant="outline">Back to Meetings</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 h-full flex flex-col">
      <Link href="/meetings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-max group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Meetings
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-heading tracking-tight">{meeting.title}</h1>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary">{meeting.project}</Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> {new Date(meeting.date).toLocaleDateString()}</span>
            <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /> {meeting.duration}m</span>
            <span className="flex items-center"><Video className="h-4 w-4 mr-1.5" /> Meeting ID: {meeting.id}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Data</Button>
          <Button className="bg-primary text-primary-foreground">Generate Report</Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="flex-1 flex flex-col mt-6">
        <TabsList className="bg-card w-full justify-start overflow-x-auto overflow-y-hidden border-b border-border/50 p-0 h-12 rounded-none">
          <TabsTrigger value="summary" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full px-6 transition-all font-medium">
            <List className="w-4 h-4 mr-2" /> Summary
          </TabsTrigger>
          <TabsTrigger value="transcript" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full px-6 transition-all font-medium">
            <Video className="w-4 h-4 mr-2" /> Transcript
          </TabsTrigger>
          <TabsTrigger value="action-items" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full px-6 transition-all font-medium">
            <CheckSquare className="w-4 h-4 mr-2" /> Action Items
            <Badge variant="secondary" className="ml-2 bg-background border-border">{tasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="decisions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full px-6 transition-all font-medium">
            <GitCommit className="w-4 h-4 mr-2" /> Decisions
            <Badge variant="secondary" className="ml-2 bg-background border-border">{decisions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full px-6 transition-all font-medium">
            <Activity className="w-4 h-4 mr-2" /> Insights
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 flex-1">
          <TabsContent value="summary" className="h-full m-0 space-y-4 outline-none">
            <Card className="border-border/50 bg-card/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">AI-Generated Key Points</h3>
                <ul className="space-y-3">
                  {meeting.summary.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="leading-relaxed text-sm md:text-base">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript" className="h-full m-0 outline-none">
            <TranscriptViewer transcript={transcript} />
          </TabsContent>

          <TabsContent value="action-items" className="h-full m-0 outline-none">
            <ActionItemList tasks={tasks} />
          </TabsContent>

          <TabsContent value="decisions" className="h-full m-0 outline-none">
            <div className="max-w-3xl">
              <DecisionTimeline decisions={decisions} />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="h-full m-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpeakingTimeChart />
              <Card className="border-border/50 bg-card/40">
                <CardContent className="p-6 flex flex-col justify-center items-center h-full text-center">
                  <div className="h-24 w-24 rounded-full border-4 border-primary flex items-center justify-center text-3xl font-heading font-bold text-primary mb-4 shadow-lg shadow-primary/20 bg-primary/5">
                    {meeting.productivityScore}
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground">Score: Excellent</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                    This meeting was highly productive with {meeting.decisionsCount} concrete decisions and clear action items recorded.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
