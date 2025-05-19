import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  xp_value: number;
  is_secret: boolean;
}

const AchievementsAdmin: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/achievements')
      .then(res => res.json())
      .then(data => {
        setAchievements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading achievements...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements Management</CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 && <div className="text-muted-foreground">No achievements found.</div>}
        <div className="space-y-3">
          {achievements.map(a => (
            <div key={a.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2">
                <img src={a.icon_url} alt={a.name} className="w-8 h-8" />
                <div>
                  <p className="font-medium">{a.name}</p>
                  <span className="text-xs text-muted-foreground">{a.description}</span>
                </div>
                <Badge variant="outline" className="ml-2">{a.xp_value} XP</Badge>
                {a.is_secret && <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800">Secret</Badge>}
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsAdmin;