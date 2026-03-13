'use client';

import { Edit3, Wand2, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function PersonalNotesPanel() {
  const [notes, setNotes] = useState('');
  const [isIntegrating, setIsIntegrating] = useState(false);

  const handleIntegrate = () => {
    setIsIntegrating(true);
    // Simulate integration logic
    setTimeout(() => {
      setIsIntegrating(false);
      // In a real app, this would trigger an update to the Insights panel
    }, 2000);
  };

  return (
    <Card className="border-[#1e293b] bg-[#1e293b]/50 h-full flex flex-col">
      <CardHeader className="p-4 border-b border-[#1e293b] flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-[#e2e8f0] flex items-center">
          <Edit3 className="w-4 h-4 mr-2 text-[#6366f1]" />
          Personal Notes
        </CardTitle>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="h-7 w-7 text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1e293b]">
             <Save className="w-4 h-4" />
           </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-1 flex-col gap-4">
        <Textarea 
          placeholder="Type your notes here during the meeting..."
          className="flex-1 min-h-[150px] bg-[#0f172a]/40 border-[#1e293b] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#6366f1] resize-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <Button 
          onClick={handleIntegrate}
          disabled={isIntegrating || !notes.trim()}
          className="w-full bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white hover:opacity-90 transition-all font-semibold shadow-lg shadow-[#6366f1]/20 h-10"
        >
          {isIntegrating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Integrating Notes...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Integrate Transcript + Notes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
