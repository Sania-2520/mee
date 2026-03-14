'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Decision } from '@/lib/types';
import { DecisionTimeline } from '@/components/decisions/DecisionTimeline';
import { motion } from 'framer-motion';

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await api.getDecisions();
      // Sort by date descending
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDecisions(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Decision Registry</h1>
        <p className="text-muted-foreground mt-1 text-lg">A chronological record of every choice made, linked to the meetings where they happened.</p>
      </div>

      <div className="mt-8 flex-1">
        {isLoading ? (
          <div className="space-y-6 ml-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 h-8 w-8 rounded-full bg-card/50 animate-pulse" />
                <div className="h-32 flex-1 rounded-xl bg-card/50 animate-pulse border border-border/50" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <DecisionTimeline decisions={decisions} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
