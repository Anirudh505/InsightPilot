import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { JourneyFilterBar } from '@/components/journeys/JourneyFilterBar';
import { UserSummaryProfile } from '@/components/journeys/UserSummaryProfile';
import { SessionTimeline } from '@/components/journeys/SessionTimeline';
import { JourneyAIInsights } from '@/components/journeys/JourneyAIInsights';
import { EventDetailsDrawer } from '@/components/journeys/EventDetailsDrawer';
import { useJourneyData } from '@/hooks/queries/useJourneyData';
import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '@/animations/framer';

export default function JourneyExplorer() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || 'usr_123';
  
  const { dateRange } = useGlobalFilters();

  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data, isLoading } = useJourneyData(projectId, userId, dateRange);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8 overflow-hidden relative">
      {/* Top Filter Bar (Sticky) */}
      <div className="shrink-0 z-10 shadow-sm">
        <JourneyFilterBar dateRange={dateRange} />
      </div>

      {/* Main Investigation Area */}
      <div className="flex-1 overflow-auto bg-muted/10 p-6 lg:p-8 custom-scrollbar">
        <div className="mx-auto max-w-6xl">
          
          <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
            {/* User Profile Header */}
            <motion.div variants={fadeUp}>
              <UserSummaryProfile user={data?.user} isLoading={isLoading} />
            </motion.div>

            {/* Split View: Timeline vs AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Timeline */}
              <motion.div variants={fadeUp} className="lg:col-span-8">
                <h3 className="text-lg font-bold mb-4">Event Stream</h3>
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <SessionTimeline 
                    sessions={data?.sessions} 
                    isLoading={isLoading} 
                    onEventClick={setSelectedEvent}
                    selectedEventId={selectedEvent?.id}
                  />
                </div>
              </motion.div>

              {/* Right Column: AI Insights */}
              <motion.div variants={fadeUp} className="lg:col-span-4 relative">
                <JourneyAIInsights isLoading={isLoading} />
              </motion.div>

            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Overlay Drawer for Event Details */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 md:hidden"
            />
            <EventDetailsDrawer 
              event={selectedEvent} 
              onClose={() => setSelectedEvent(null)} 
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
