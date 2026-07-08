import { Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '../components/layouts/Sidebar';
import { TopNavbar } from '../components/layouts/TopNavbar';
import { CommandPalette } from '../components/layouts/CommandPalette';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export default function DashboardLayout() {
  const { workspaceId, projectId } = useParams();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useKeyboardShortcut('k', () => setIsCommandPaletteOpen(true), { metaKey: true, ctrlKey: false });
  // Also support Ctrl+K for windows
  useKeyboardShortcut('k', () => setIsCommandPaletteOpen(true), { ctrlKey: true, metaKey: false });

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
      {/* Dynamic Sidebar */}
      <Sidebar workspaceId={workspaceId} projectId={projectId} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-muted/20">
        <TopNavbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
