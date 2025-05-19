import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";

interface Log {
  id: string;
  user_id: string;
  activity: string;
  details: string | null;
  date: string;
  created_at: string;
}

const SystemLogsAdmin: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading system logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 && <div className="text-muted-foreground">No logs found.</div>}
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <p className="font-medium">{log.activity}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="mr-2">{log.user_id}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">{log.date}</span>
                  {log.details && <span className="text-xs text-muted-foreground ml-2">{log.details}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogsAdmin;