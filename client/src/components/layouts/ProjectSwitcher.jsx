import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { ChevronsUpDown, Check, FolderDot } from 'lucide-react';

export function ProjectSwitcher({ currentProjectId }) {
  // In a real app, this data would come from React Query
  const projects = [
    { id: 'proj_1', name: 'Production App' },
    { id: 'proj_2', name: 'Marketing Website' },
  ];
  
  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const items = projects.map(p => ({
    label: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <FolderDot className="h-4 w-4 text-muted-foreground" />
          <span>{p.name}</span>
        </div>
        {p.id === currentProjectId && <Check className="h-4 w-4 text-primary" />}
      </div>
    ),
    onClick: () => console.log(`Switch to ${p.name}`)
  }));

  items.push({
    label: <span className="text-primary font-medium">+ Create Project</span>,
    onClick: () => console.log('Create Project')
  });

  return (
    <Dropdown
      align="left"
      items={items}
      trigger={
        <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
          <span className="text-muted-foreground">/</span>
          <span className="truncate max-w-[150px]">{currentProject.name}</span>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-1 shrink-0" />
        </button>
      }
    />
  );
}
