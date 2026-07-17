import React from 'react';
import { MAIN_NAVIGATION, BOTTOM_NAVIGATION } from '@/constants/navigation';
import { SidebarItem } from './SidebarItem';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChevronLeft, ChevronRight, Triangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useNotifications } from '@/hooks/queries/useNotifications';

export function Sidebar({ workspaceId, projectId }) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('insightpilot:sidebar-collapsed', false);
  
  // Base path for all navigation in this context
  const basePath = `/workspace/${workspaceId}/project/${projectId}`;

  const { unreadCount } = useNotifications(projectId);

  const dynamicBottomNav = BOTTOM_NAVIGATION.map(item => {
    if (item.id === 'notifications') {
      return { ...item, badge: unreadCount > 0 ? unreadCount : null };
    }
    return item;
  });

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex h-screen flex-col border-r border-border bg-card z-20"
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Triangle className="h-4 w-4 fill-current" />
          </div>
          {!isCollapsed && (
            <span className="truncate text-lg font-bold tracking-tight">InsightPilot</span>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar">
        <nav className="space-y-1">
          {MAIN_NAVIGATION.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              basePath={basePath}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation & Collapse Toggle */}
      <div className="shrink-0 border-t border-border p-3 space-y-1">
        {dynamicBottomNav.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            basePath={basePath}
            isCollapsed={isCollapsed}
          />
        ))}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "mt-2 flex w-full items-center rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            isCollapsed && "justify-center px-0"
          )}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : (
            <>
              <ChevronLeft className="h-5 w-5 mr-3" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
