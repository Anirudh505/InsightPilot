import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function NotificationPanel() {
  const notifications = [
    { id: 1, title: 'Insight Detected', message: 'DAU dropped by 20% in the last 7 days.', time: '10m ago', unread: true },
    { id: 2, title: 'Weekly Report', message: 'Your weekly analytics report is ready.', time: '2h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const items = notifications.map(n => ({
    label: (
      <div className={`flex flex-col gap-1 p-2 ${n.unread ? 'opacity-100' : 'opacity-70'}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{n.title}</span>
          <span className="text-[10px] text-muted-foreground">{n.time}</span>
        </div>
        <p className="text-xs text-muted-foreground whitespace-normal line-clamp-2">{n.message}</p>
      </div>
    )
  }));

  if (items.length > 0) {
    items.push({
      label: (
        <div className="flex items-center justify-center gap-2 border-t border-border pt-3 mt-2 text-primary font-medium text-xs">
          <CheckCircle2 className="h-3 w-3" /> Mark all as read
        </div>
      )
    });
  } else {
    items.push({
      label: <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
    });
  }

  return (
    <Dropdown
      align="right"
      className="w-80"
      items={items}
      trigger={
        <button className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
          )}
        </button>
      }
    />
  );
}
