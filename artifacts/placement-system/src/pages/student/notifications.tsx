import React from 'react';
import { useListNotifications, getListNotificationsQueryKey, useMarkNotificationRead, useMarkAllNotificationsRead } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, CalendarCheck, Settings, Bell, Check, CheckCheck } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export default function StudentNotificationsPage() {
  const { data: notifications, isLoading } = useListNotifications({
    query: { queryKey: getListNotificationsQueryKey() }
  });
  
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() })
    });
  };

  const handleMarkAllRead = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markAllRead.mutate(undefined as any, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() })
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-64 w-full" /></div>;

  const getIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'interview': return <CalendarCheck className="h-5 w-5 text-purple-500" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Updates on jobs, interviews, and system alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead} disabled={markAllRead.isPending}>
            <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {(!notifications || notifications.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p>You have no notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 flex gap-4 transition-colors ${notif.isRead ? 'bg-background' : 'bg-primary/5'}`}
                >
                  <div className="mt-1 shrink-0 p-2 bg-background rounded-full border shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-base font-semibold ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${!notif.isRead ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                      {notif.message}
                    </p>
                    {!notif.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-7 text-xs px-2" 
                        onClick={() => handleMarkRead(notif.id)}
                      >
                        <Check className="mr-1.5 h-3 w-3" /> Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}