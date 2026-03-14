'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';
import { TaskCard } from '@/components/cards/TaskCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const data = await api.getTasks();
      setAllTasks(data);
      setIsLoading(false);
    }
    fetchTasks();
  }, []);

  const filteredTasks = allTasks.filter(task => {
    if (filter === 'my-tasks') return task.assignee.id === 'u2'; // Using Sarah Miller as mock current user
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'high-priority') return task.priority === 'High';
    if (filter === 'pending') return task.status !== 'Completed';
    return true;
  });

  return (
    <div className="space-y-6 pb-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Tasks Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage action items assigned across all meetings.</p>
        </div>
        <Button className="bg-primary text-primary-foreground">Add Task Manually</Button>
      </div>

      <div className="bg-card/40 border border-border/50 p-2 rounded-xl sticky top-0 z-10 backdrop-blur-md">
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full relative">
          <TabsList className="bg-transparent h-10 w-full justify-start overflow-x-auto p-0 border-none space-x-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:hover:bg-muted/50 transition-all">
              All Tasks
            </TabsTrigger>
            <TabsTrigger value="my-tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:hover:bg-muted/50 transition-all">
              My Tasks
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:hover:bg-muted/50 transition-all">
              Pending
            </TabsTrigger>
            <TabsTrigger value="high-priority" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:hover:bg-muted/50 transition-all">
              High Priority
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 border border-transparent data-[state=inactive]:border-border/50 data-[state=inactive]:hover:bg-muted/50 transition-all">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 rounded-xl bg-card/50 animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={filter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-border rounded-xl bg-card/20 text-muted-foreground">
              <p>No tasks found in this category.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
