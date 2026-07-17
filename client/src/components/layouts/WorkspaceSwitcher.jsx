import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { ChevronsUpDown, Check, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

export function WorkspaceSwitcher({ currentWorkspaceId }) {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // In a real app, this data would come from React Query
  const workspaces = [
    { id: 'w_123', name: 'Acme Corp' },
    { id: 'w_456', name: 'Globex Inc' },
  ];
  
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];

  const items = workspaces.map(w => ({
    label: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{w.name}</span>
        </div>
        {w.id === currentWorkspaceId && <Check className="h-4 w-4 text-primary" />}
      </div>
    ),
    onClick: () => navigate(`/workspace/${w.id}/project/${projectId || 'p_456'}`)
  }));

  items.push({
    label: <span className="text-primary font-medium">+ Create Workspace</span>,
    onClick: () => console.log('Create Workspace')
  });

  return (
    <Dropdown
      align="left"
      items={items}
      trigger={
        <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
            {currentWorkspace.name.charAt(0)}
          </div>
          <span className="truncate max-w-[120px]">{currentWorkspace.name}</span>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-1 shrink-0" />
        </button>
      }
    />
  );
}
