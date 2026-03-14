'use client';

import { HeaderBar } from './HeaderBar';
import { VideoFeedPanel } from './VideoFeedPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { TranscriptPanel } from './TranscriptPanel';
import { PersonalNotesPanel } from './PersonalNotesPanel';
import { TimelinePanel } from './TimelinePanel';
import { TaskManagementWindow } from './TaskManagementWindow';
import { FloatingChatbot } from '../chatbot/FloatingChatbot';
import { motion, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

export function DashboardContainer() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const [isTaskWindowOpen, setIsTaskWindowOpen] = useState(false);

  useEffect(() => {
    const handleOpenTaskWindow = () => setIsTaskWindowOpen(true);
    window.addEventListener('open-task-window', handleOpenTaskWindow);
    return () => window.removeEventListener('open-task-window', handleOpenTaskWindow);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <HeaderBar />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* SECTION 1: Two-Column Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          <div className="xl:col-span-7">
            <VideoFeedPanel />
          </div>
          <div className="xl:col-span-5">
            <AIInsightsPanel />
          </div>
        </motion.div>

        {/* SECTION 2: LIVE TRANSCRIPT */}
        <motion.div variants={itemVariants}>
          <TranscriptPanel />
        </motion.div>

        {/* SECTION 3: PERSONAL NOTES */}
        <motion.div variants={itemVariants}>
          <PersonalNotesPanel />
        </motion.div>

        {/* SECTION 5: AI MEETING TIMELINE */}
        <motion.div variants={itemVariants}>
          <TimelinePanel />
        </motion.div>
      </motion.div>

      <FloatingChatbot />
      
      {/* Hidden button for Sidebar to trigger (temporary hack to avoid refactoring Sidebar props if it's deeply nested, but realistically we should just use a global state or pass it down via context. 
          Given the current structure, we'll export a custom event). */}
      <TaskManagementWindow isOpen={isTaskWindowOpen} onClose={() => setIsTaskWindowOpen(false)} />
    </div>
  );
}
