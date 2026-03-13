'use client';

import { HeaderBar } from './HeaderBar';
import { VideoFeedPanel } from './VideoFeedPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { TranscriptPanel } from './TranscriptPanel';
import { PersonalNotesPanel } from './PersonalNotesPanel';
import { TimelinePanel } from './TimelinePanel';
import { FloatingChatbot } from '../chatbot/FloatingChatbot';
import { motion } from 'framer-motion';

export function DashboardContainer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

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
    </div>
  );
}
