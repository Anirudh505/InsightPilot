# Sprint FE-11: Product Polish & UX Excellence Implementation Plan

This sprint focuses exclusively on refining the existing frontend architecture, improving performance, and ensuring a premium, consistent UX across the entire InsightPilot application.

## 1. Global Filter Syncing (URL State)
Currently, filters (Date Range, Segments) are local to each workspace page. If a PM changes the date range on the Dashboard and clicks "Journeys", the date range resets. 
- **Action**: I will create a custom hook `useGlobalFilters.js` that leverages React Router's `useSearchParams`. This will persist the `startDate`, `endDate`, and `segment` in the URL query string.
- **Action**: I will update `DashboardOverview`, `AnalyticsWorkspace`, `FunnelWorkspace`, `RetentionWorkspace`, and `FeatureAdoptionWorkspace` to consume this hook, ensuring seamless deep-linking and persistent state during navigation.

## 2. Command Palette Extension
- **Action**: I will update `client/src/components/layouts/CommandPalette.jsx` to include the complete suite of analytical views:
  - Open Funnels (`/analytics/funnels`)
  - Open Retention (`/analytics/retention`)
  - Open Feature Adoption (`/analytics/features`)
  - Open AI Copilot (`/copilot`)
  - Open Journeys (`/analytics/journeys`)
- **Action**: Add categorized sections ("Analytics", "AI", "Navigation") for better scannability.

## 3. Performance & Cache Tuning
- **Action**: In `QueryProvider.jsx`, I will tune the TanStack Query configuration. Currently, `staleTime` is 5 minutes. I will increase `gcTime` (garbage collection time) to 15 minutes to keep previous analytics payloads cached longer in memory, making tab-switching instant.
- **Action**: I will implement aggressive Route Prefetching in the `Sidebar` component. When a user hovers over an analytics link, we will prefetch the JS bundle for that route to eliminate the lazy-loading waterfall.

## 4. Accessibility & UX Microinteractions
- **Action**: Audit the tables (e.g. `FeatureUsageTable`, `FunnelDataTable`) to ensure they have proper `overflow-x-auto` wrappers and sticky headers for better scrolling on smaller screens.
- **Action**: Ensure all interactive rows in tables have appropriate hover states and `cursor-pointer` classes.

## User Review Required
> [!WARNING]
> Moving local filter state to URL Search Parameters is a significant architectural change. It means visiting `/workspace/1/project/1` will automatically default to `?start=...&end=...&segment=all`. 
> 
> Are you comfortable with this global state overriding the mock local state currently embedded in the page components?

Please approve this plan so we can polish InsightPilot to a production-ready state!
