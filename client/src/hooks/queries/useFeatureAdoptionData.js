import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Mocks granular feature adoption data
 */
export function useFeatureAdoptionData(projectId, dateRange, featureFilter) {
  return useQuery({
    queryKey: ['feature-adoption', projectId, dateRange, featureFilter],
    queryFn: async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const features = [
        {
          id: 'feat_1',
          name: 'Dashboard Export (CSV)',
          adoption: 12.4,
          users: 1245,
          volume: 3420,
          trend: 2.1,
          retentionCorrelation: 'high', // high, medium, low
          timeToFirstUse: '14 days'
        },
        {
          id: 'feat_2',
          name: 'Invite Team Member',
          adoption: 45.2,
          users: 8200,
          volume: 9100,
          trend: 1.5,
          retentionCorrelation: 'high',
          timeToFirstUse: '1 day'
        },
        {
          id: 'feat_3',
          name: 'Custom Dashboard Builder',
          adoption: 8.5,
          users: 850,
          volume: 12400, // high volume, low unique users (power users)
          trend: -0.4,
          retentionCorrelation: 'medium',
          timeToFirstUse: '45 days'
        },
        {
          id: 'feat_4',
          name: 'Dark Mode Toggle',
          adoption: 68.2,
          users: 14500,
          volume: 28000,
          trend: 0.2,
          retentionCorrelation: 'low', // vanity feature
          timeToFirstUse: '1 hour'
        }
      ];

      // Generate trend data (stickiness)
      const trendData = [];
      for(let i=30; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trendData.push({
          date: d.toISOString(),
          firstTime: Math.floor(Math.random() * 200) + 50,
          returning: Math.floor(Math.random() * 800) + 1000,
          adoptionRate: (Math.random() * 2) + 40 // ~40-42%
        });
      }

      return {
        overview: {
          totalFeatures: 42,
          globalAdoption: 48.5,
          mostUsed: 'Dark Mode Toggle',
          avgTimeToUse: '14.2 days',
        },
        features,
        trendData
      };
    },
    enabled: !!projectId,
  });
}

/**
 * Mocks feature dimensional breakdowns
 */
export function useFeatureBreakdown(projectId, dimension) {
  return useQuery({
    queryKey: ['feature-breakdown', projectId, dimension],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return [
        { segment: 'Enterprise Plan', adoptionRate: 65.2 },
        { segment: 'Pro Plan', adoptionRate: 42.1 },
        { segment: 'Free Tier', adoptionRate: 15.4 },
      ];
    },
    enabled: !!projectId,
  });
}
