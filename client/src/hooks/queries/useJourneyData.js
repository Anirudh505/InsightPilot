import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Mocks granular user journey event stream.
 */
export function useJourneyData(projectId, userId, dateRange) {
  return useQuery({
    queryKey: ['journey', projectId, userId, dateRange],
    queryFn: async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
          id: userId || 'usr_unknown',
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
    enabled: !!projectId, // Normally we'd require userId, but we'll mock a default one
  });
}
