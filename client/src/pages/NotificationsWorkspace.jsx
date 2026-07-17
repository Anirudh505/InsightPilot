import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { useNotifications } from '@/hooks/queries/useNotifications';
import { Button } from '@/components/ui/Button';
import { Bell, Check, Trash2, Sparkles, FileText, Settings, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/format';

export default function NotificationsWorkspace() {
  const { projectId } = useParams();
  const { data: notifications, isLoading, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(projectId);

  const getIcon = (type) => {
    switch(type) {
      case 'insight': return <Sparkles className="w-4 h-4 text-primary" />;
      case 'report': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'system': return <Settings className="w-4 h-4 text-muted-foreground" />;
      case 'alert': return <ShieldAlert className="w-4 h-4 text-destructive" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated on insights, reports, and system alerts.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={() => markAllAsRead()} className="gap-2">
            <Check className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center p-8 text-muted-foreground">Loading notifications...</div>
        ) : !notifications || notifications.length === 0 ? (
          <motion.div variants={fadeUp} className="text-center p-12 bg-muted/10 border border-border/50 rounded-xl">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-muted-foreground mt-1">You have no notifications right now.</p>
          </motion.div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={fadeUp}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl border transition-colors",
                notification.isRead ? "bg-background border-border" : "bg-primary/5 border-primary/20"
              )}
            >
              <div className={cn(
                "mt-1 p-2 rounded-full shrink-0",
                notification.isRead ? "bg-muted" : "bg-primary/10"
              )}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={cn("font-medium text-sm", !notification.isRead && "text-primary")}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                {!notification.isRead && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary" onClick={() => markAsRead(notification.id)} title="Mark as read">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(notification.id)} title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
