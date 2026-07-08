import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SidebarItem({ item, basePath, isCollapsed }) {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  
  // Check if current route matches this item or any of its children
  const isMatch = (path) => {
    const fullPath = path ? `${basePath}/${path}` : basePath;
    return location.pathname === fullPath || location.pathname.startsWith(`${fullPath}/`);
  };

  const isActive = isMatch(item.path);
  const [isExpanded, setIsExpanded] = useState(isActive);

  // If sidebar is collapsed, we don't show children inline.
  // In a full implementation, you might show a floating popover for children on hover when collapsed.
  
  const content = (
    <>
      <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
      {!isCollapsed && (
        <span className="ml-3 flex-1 truncate text-sm font-medium">
          {item.label}
        </span>
      )}
      {!isCollapsed && item.badge && (
        <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {item.badge}
        </span>
      )}
      {!isCollapsed && hasChildren && (
        <span className="ml-auto opacity-50">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
      )}
    </>
  );

  const buttonClasses = cn(
    "flex w-full items-center rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground",
    isCollapsed && "justify-center px-0"
  );

  if (hasChildren && !isCollapsed) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={buttonClasses}
        >
          {content}
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                {item.children.map((child) => (
                  <SidebarItem 
                    key={child.id} 
                    item={child} 
                    basePath={basePath} 
                    isCollapsed={isCollapsed} 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const fullPath = item.path ? `${basePath}/${item.path}` : basePath;

  return (
    <NavLink
      to={fullPath}
      className={({ isActive }) => cn(
        buttonClasses,
        isActive && "bg-accent text-accent-foreground font-semibold"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      {content}
    </NavLink>
  );
}
