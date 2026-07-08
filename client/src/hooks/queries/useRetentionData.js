import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

/**
 * Mocks granular retention matrix and lifecycle data
 */
export function useRetentionData(projectId, dateRange, segment) {
  return useQuery({
    queryKey: ['retention', projectId, dateRange, segment],
    queryFn: async () => {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const now = new Date();
      const matrix = [];
      
      // Generate 7 days of cohorts for the matrix
      for (let i = 0; i < 7; i++) {
        const cohortDate = new Date(now);
        cohortDate.setDate(cohortDate.getDate() - (7 - i));
        
        const cohortSize = Math.floor(Math.random() * 500) + 1000;
        const days = [];
        let currentRetained = cohortSize;
        
        // D0 (100%), D1, D2...
        for (let j = 0; j <= (7 - i); j++) {
          if (j === 0) {
            days.push({ dayIndex: 0, retained: cohortSize, percentage: 100 });
          } else {
            // Simulate typical SaaS decay curve
            const decayFactor = 0.5 + (Math.random() * 0.2);
            currentRetained = Math.floor(currentRetained * (j === 1 ? decayFactor : 0.9));
            days.push({ 
              dayIndex: j, 
              retained: currentRetained, 
              percentage: (currentRetained / cohortSize) * 100 
            });
          }
        }
        
        matrix.push({
          cohortDate: cohortDate.toISOString(),
          cohortSize,
          days
        });
      }

      // Generate Lifecycle Data (New, Active, Dormant, Reactivated)
      const lifecycleData = [];
      for(let i=30; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        lifecycleData.push({
          date: d.toISOString(),
          new: Math.floor(Math.random() * 100) + 50,
          active: Math.floor(Math.random() * 500) + 2000,
          resurrected: Math.floor(Math.random() * 30) + 10,
          dormant: Math.floor(Math.random() * 40) + 20, // Negative impact, usually rendered below 0
        });
      }

      // Generate Cohort Table Data
      const cohorts = [
        { id: 'c1', name: 'Black Friday Signups', users: 5420, day30Retention: 42.5, growth: 12.4, ltv: '$124.50' },
        { id: 'c2', name: 'Organic Search (US)', users: 1250, day30Retention: 38.2, growth: 5.2, ltv: '$95.20' },
        { id: 'c3', name: 'Paid Social (Q3)', users: 8900, day30Retention: 22.1, growth: -4.1, ltv: '$45.00' },
      ];

      return {
        overview: {
          day1: 65.4,
          day7: 42.1,
          day30: 28.5,
          churnRate: 15.2,
        },
        matrix,
        lifecycleData,
        cohorts
      };
    },
    enabled: !!projectId,
  });
}
