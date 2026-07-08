import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Search, Compass, LogOut, Settings, BarChart2, Filter, Activity, Users, Zap, LayoutDashboard } from 'lucide-react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function CommandPalette({ isOpen, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  
  // Default to a demo workspace if outside context
  const workspaceId = params.workspaceId || 'ws_1';
  const projectId = params.projectId || 'proj_1';
  const basePath = `/workspace/${workspaceId}/project/${projectId}`;

  // Handle global shortcut
  useKeyboardShortcut('k', () => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
      onClose(true); // Assuming onClose actually acts as an open/toggle if passed true, or handled by parent.
      // Wait, standard pattern: parent controls state. The hook should be in DashboardLayout.
    }
  }, { metaKey: true, ctrlKey: false });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Mock results based on search
  const allCommands = [
    { id: 'go-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'Analytics', action: () => navigate(basePath) },
    { id: 'go-metrics', label: 'Metrics Explorer', icon: BarChart2, category: 'Analytics', action: () => navigate(`${basePath}/analytics`) },
    { id: 'go-journeys', label: 'User Journeys', icon: Activity, category: 'Analytics', action: () => navigate(`${basePath}/analytics/journeys`) },
    { id: 'go-funnels', label: 'Funnels', icon: Filter, category: 'Analytics', action: () => navigate(`${basePath}/analytics/funnels`) },
    { id: 'go-retention', label: 'Retention & Cohorts', icon: Users, category: 'Analytics', action: () => navigate(`${basePath}/analytics/retention`) },
    { id: 'go-features', label: 'Feature Adoption', icon: Zap, category: 'Analytics', action: () => navigate(`${basePath}/analytics/features`) },
    
    { id: 'ask-ai', label: 'AI Product Copilot', icon: Compass, category: 'AI Intelligence', action: () => navigate(`${basePath}/copilot`) },
    
    { id: 'go-settings', label: 'Project Settings', icon: Settings, category: 'Configuration', action: () => navigate(`${basePath}/settings`) },
    { id: 'logout', label: 'Log out', icon: LogOut, category: 'Account', action: () => console.log('Logout') },
  ];

  const filteredCommands = search 
    ? allCommands.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
    : allCommands;

  // Handle keyboard navigation inside the palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-0 overflow-hidden bg-background border-border"
    >
      <div className="flex items-center border-b border-border px-4 py-3">
        <Search className="h-5 w-5 text-muted-foreground mr-3" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a command or search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ESC
        </kbd>
      </div>
      
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {filteredCommands.length === 0 ? (
          <div className="py-14 text-center text-sm text-muted-foreground">
            No results found for "{search}"
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => {
                  command.action();
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors",
                  selectedIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <command.icon className={cn("h-4 w-4", selectedIndex === index ? "text-primary-foreground" : "text-muted-foreground")} />
                <span>{command.label}</span>
                <span className={cn(
                  "ml-auto text-xs",
                  selectedIndex === index ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {command.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
