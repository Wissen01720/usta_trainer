import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsAdmin: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading notifications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Management</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 && <div className="text-muted-foreground">No notifications found.</div>}
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-medium">{n.title}</p>
                <span className="text-xs text-muted-foreground">{n.message}</span>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="mr-2">{n.type}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">{n.created_at}</span>
                  {!n.is_read && <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">Unread</Badge>}
                </div>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsAdmin;