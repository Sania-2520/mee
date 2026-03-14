'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MeetingCard } from '@/components/cards/MeetingCard';
import MeetingRoom from "../../components/MeetingRoom";
import { api } from '@/lib/api';
import { Meeting } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar } from 'lucide-react';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MeetingsPage() {

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');

  // ⭐ state for live meeting
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    async function fetchMeetings() {
      const data = await api.getMeetings();
      setMeetings(data);
      setIsLoading(false);
    }
    fetchMeetings();
  }, []);

  const projects = Array.from(new Set(meetings.map(m => m.project).filter(Boolean)));

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || m.project === projectFilter;
    return matchesSearch && matchesProject;
  });

  // ⭐ If meeting opened show MeetingRoom
  if (activeMeeting) {
    return (
      <div className="p-6">
        <Button 
          className="mb-4"
          onClick={() => setActiveMeeting(null)}
        >
          Back to Meetings
        </Button>

        <MeetingRoom roomId={activeMeeting.id} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 h-full flex flex-col">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Meetings</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage all your team's meetings.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card/30 p-4 rounded-xl border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search meeting titles..." 
            className="pl-10 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">

          <Select value={projectFilter} onValueChange={(val) => setProjectFilter(val || 'all')}>
            <SelectTrigger className="w-[160px] bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Project" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(p => p && <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>

          </Select>

          <Button variant="outline" className="bg-background">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            Date
          </Button>

        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 rounded-xl bg-card/50 animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : (

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto"
        >

          {filteredMeetings.length > 0 ? (

            filteredMeetings.map((meeting) => (

              <div key={meeting.id} onClick={() => setActiveMeeting(meeting)}>

                <MeetingCard meeting={meeting} />

              </div>

            ))

          ) : (

            <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl bg-card/20">

              <p className="text-muted-foreground">
                No meetings found matching your criteria.
              </p>

              <Button 
                variant="link" 
                onClick={() => { setSearch(''); setProjectFilter('all'); }}
              >
                Clear filters
              </Button>

            </div>

          )}

        </motion.div>

      )}

    </div>
  );
}