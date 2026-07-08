import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { User, Settings, Moon, LogOut, Monitor, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export function UserMenu() {
  const { theme, setTheme } = useTheme();

  const themeIcon = theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;

  const items = [
    {
      label: (
        <div className="flex flex-col py-1">
          <p className="text-sm font-medium leading-none">Anirudh Shetty</p>
          <p className="text-xs text-muted-foreground mt-1">anirudh@example.com</p>
        </div>
      )
    },
    {
      label: <div className="flex items-center gap-2 border-t border-border pt-2 mt-1"><User className="h-4 w-4" /> Profile</div>,
      onClick: () => console.log('Profile')
    },
    {
      label: <div className="flex items-center gap-2"><Settings className="h-4 w-4" /> Preferences</div>,
      onClick: () => console.log('Preferences')
    },
    {
      label: (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">{themeIcon} Theme</div>
          <span className="text-xs text-muted-foreground capitalize">{theme}</span>
        </div>
      ),
      onClick: () => {
        const nextTheme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
        setTheme(nextTheme);
      }
    },
    {
      label: <div className="flex items-center gap-2 border-t border-border pt-2 mt-1 text-destructive"><LogOut className="h-4 w-4" /> Log out</div>,
      onClick: () => console.log('Logout')
    }
  ];

  return (
    <Dropdown
      align="right"
      items={items}
      trigger={
        <button className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm ring-2 ring-transparent hover:ring-border transition-all">
          AS
        </button>
      }
    />
  );
}
