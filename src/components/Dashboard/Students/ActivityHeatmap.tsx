import { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const ActivityHeatmap = ({ userId }: { userId: string }) => {
  const [activity, setActivity] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    fetch(`/api/progress/${userId}`)
      .then(res => res.json())
      .then(data => setActivity(data));
  }, [userId]);

  return (
    <CalendarHeatmap
      startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
      endDate={new Date()}
      values={activity}
      classForValue={(value: { date: string; count: number } | undefined) => {
        if (!value || value.count === 0) return 'color-empty';
        if (value.count < 2) return 'color-scale-1';
        if (value.count < 4) return 'color-scale-2';
        if (value.count < 6) return 'color-scale-3';
        return 'color-scale-4';
      }}
    />
  );
};

export default ActivityHeatmap;