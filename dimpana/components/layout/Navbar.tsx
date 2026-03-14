'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-8 transition-all">
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search meetings, tasks, transcripts..." 
            className="pl-10 bg-card border-none ring-0 w-full focus-visible:ring-1 focus-visible:ring-primary h-9"
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center md:ml-6">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
      </div>
    </header>
  );
}
