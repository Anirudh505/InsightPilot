import {
  LayoutDashboard,
  LineChart,
  Activity,
  Filter,
  Route,
  Users,
  Repeat,
  Sparkles,
  MousePointerClick,
  Settings,
  Bell,
  FileText,
  ShieldAlert
} from "lucide-react";

export const MAIN_NAVIGATION = [
  {
    id: "overview",
    label: "Overview",
    path: "",
    icon: LayoutDashboard,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: LineChart,
    children: [
      { id: "analytics-overview", label: "Overview", path: "analytics", icon: LineChart },
      { id: "analytics-realtime", label: "Realtime", path: "analytics/realtime", icon: Activity },
      { id: "analytics-funnels", label: "Funnels", path: "analytics/funnels", icon: Filter },
      { id: "analytics-journeys", label: "Journeys", path: "analytics/journeys", icon: Route },
      { id: "analytics-retention", label: "Retention", path: "analytics/retention", icon: Repeat },
      { id: "analytics-cohorts", label: "Cohorts", path: "analytics/cohorts", icon: Users },
      { id: "analytics-features", label: "Feature Adoption", path: "analytics/features", icon: MousePointerClick },
      { id: "analytics-segments", label: "Segments", path: "analytics/segments", icon: Users },
    ]
  },
  {
    id: "copilot",
    label: "AI Copilot",
    path: "copilot",
    icon: Sparkles,
  },
  {
    id: "reports",
    label: "Reports",
    path: "reports",
    icon: FileText,
  },
];

export const BOTTOM_NAVIGATION = [
  {
    id: "notifications",
    label: "Notifications",
    path: "notifications",
    icon: Bell,
    badge: 3
  },
  {
    id: "settings",
    label: "Settings",
    path: "settings",
    icon: Settings,
  },
  {
    id: "admin",
    label: "Admin",
    path: "admin",
    icon: ShieldAlert,
    requiredRoles: ["admin"]
  }
];
