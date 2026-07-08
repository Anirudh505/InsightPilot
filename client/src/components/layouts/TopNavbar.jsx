import React from 'react';
import { Search } from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { ProjectSwitcher } from './ProjectSwitcher';
import { UserMenu } from './UserMenu';
import { NotificationPanel } from './NotificationPanel';
import { useParams } from 'react-router-dom';

export function TopNavbar({ onOpenCommandPalette }) {
  const { workspaceId, projectId } = useParams();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 z-10">
      
      {/* Left side: Context Switchers */}
      <div className="flex items-center gap-1">
        <WorkspaceSwitcher currentWorkspaceId={workspaceId} />
        <ProjectSwitcher currentProjectId={projectId} />
      </div>

      {/* Right side: Global Actions */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-64"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <div className="h-4 w-[1px] bg-border mx-1 hidden md:block"></div>

        <NotificationPanel />
        <UserMenu />
      </div>
    </header>
  );
}
