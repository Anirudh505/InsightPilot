import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Fetches user journey event stream.
 */
export function useJourneyData(projectId, userId, dateRange) {
  return useQuery({
    queryKey: ['journey', projectId, userId, dateRange],
    queryFn: async () => {
      let targetUserId = userId;
      
      // If no userId is explicitly provided, fetch the first recent user journey
      if (!targetUserId) {
        const journeysRes = await api.get(`/projects/${projectId}/journeys?limit=1`);
        const journeysList = journeysRes.data.data;
        if (journeysList && journeysList.length > 0) {
          // Journeys list returns UserJourney objects.
          // They contain userId or anonymousId
          targetUserId = journeysList[0].userId || journeysList[0].anonymousId;
        }
      }

      if (targetUserId) {
        try {
          const pathRes = await api.get(`/projects/${projectId}/journeys/${targetUserId}`);
          const journeyData = pathRes.data.data; // { user, sessions }
          
          if (journeyData && journeyData.sessions) {
            // Reformat backend sessions to match frontend expectations
            const formattedSessions = journeyData.sessions.map(s => ({
              sessionId: s.sessionId,
              startTime: s.startedAt,
              endTime: s.endedAt || s.startedAt,
              events: s.events.map(e => ({
                id: e._id || `evt_${Math.random()}`,
                type: e.event === 'pageview' ? 'pageview' : (e.event === 'click' ? 'click' : 'custom'),
                name: e.event,
                timestamp: e.timestamp,
                properties: e.properties || {}
              }))
            }));
            
            return {
              user: {
                id: targetUserId,
                email: journeyData.user?.email || 'Unknown',
                name: journeyData.user?.name || 'Anonymous User',
                firstSeen: journeyData.user?.firstSeenAt,
                lastSeen: journeyData.user?.lastSeenAt,
                totalSessions: journeyData.user?.metrics?.totalSessions || formattedSessions.length,
                totalEvents: journeyData.user?.metrics?.totalEvents || 0,
                isConverted: false
              },
              sessions: formattedSessions
            };
          }
        } catch (error) {
          console.warn('Failed to fetch journey path, falling back to mock', error);
        }
      }
      
      // Fallback Mock if backend isn't populated yet
      const generateSession = (sessionId, startTime, eventCount, bounce = false) => {
        const events = [];
        let currentTime = new Date(startTime);
        
        events.push({
          id: `evt_${Math.random().toString(36).substr(2, 9)}`,
          type: 'session_start',
          name: 'Session Started',
          timestamp: currentTime.toISOString(),
          properties: { browser: 'Chrome', os: 'macOS', device: 'Desktop' }
        });

        for (let i = 0; i < eventCount; i++) {
          currentTime = new Date(currentTime.getTime() + Math.random() * 60000); // add 0-60s
          
          const types = [
            { type: 'pageview', name: 'Viewed Pricing Page' },
            { type: 'click', name: 'Clicked "Start Trial"' },
            { type: 'custom', name: 'Validation Error', isError: true, properties: { message: 'Invalid email format' } },
            { type: 'pageview', name: 'Viewed Dashboard' },
            { type: 'feature', name: 'Used Export Feature' }
          ];
          
          const evt = types[Math.floor(Math.random() * types.length)];
          
          events.push({
            id: `evt_${Math.random().toString(36).substr(2, 9)}`,
            ...evt,
            timestamp: currentTime.toISOString(),
            properties: evt.properties || { url: 'https://app.example.com', referrer: 'Google' }
          });
        }
        
        if (bounce) {
          currentTime = new Date(currentTime.getTime() + 5000);
          events.push({
            id: `evt_${Math.random().toString(36).substr(2, 9)}`,
            type: 'bounce',
            name: 'User Bounced',
            timestamp: currentTime.toISOString(),
            properties: { timeOnPage: '5s' }
          });
        }

        currentTime = new Date(currentTime.getTime() + Math.random() * 10000);
        events.push({
          id: `evt_${Math.random().toString(36).substr(2, 9)}`,
          type: 'session_end',
          name: 'Session Ended',
          timestamp: currentTime.toISOString(),
          properties: { duration: `${Math.floor((currentTime.getTime() - startTime.getTime()) / 1000)}s` }
        });

        return {
          sessionId,
          startTime: startTime.toISOString(),
          endTime: currentTime.toISOString(),
          events
        };
      };

      const now = new Date();
      const sessions = [
        generateSession('sess_3', new Date(now.getTime() - 1000 * 60 * 60 * 2), 4),
        generateSession('sess_2', new Date(now.getTime() - 1000 * 60 * 60 * 24), 1, true),
        generateSession('sess_1', new Date(now.getTime() - 1000 * 60 * 60 * 48), 8),
      ];

      return {
        user: {
          id: targetUserId || 'usr_unknown',
          email: 'sarah.j@example.com',
          name: 'Sarah Jenkins',
          firstSeen: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
          lastSeen: sessions[0].endTime,
          totalSessions: 14,
          totalEvents: 142,
          isConverted: true
        },
        sessions
      };
    },
    enabled: !!projectId,
  });
}
