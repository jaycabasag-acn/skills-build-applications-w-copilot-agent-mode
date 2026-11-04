import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Activity = { type: string; minutes: number; points: number };

export default function Activities() {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ activities: Activity[] }>('/api/activities').then(({ activities: result }) => {
      if (active) setActivities(result);
    }).catch(() => {
      if (active) setHasError(true);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Activities</h2>
        <p>Track student activity minutes and points.</p>
        {activities === null && !hasError && <p role="status">Loading activities...</p>}
        {hasError && <p role="alert">Unable to load activities. Please try again later.</p>}
        {activities !== null && activities.length === 0 && <p>No activities yet.</p>}
        {activities !== null && activities.length > 0 && (
          <ul>{activities.map((activity, index) => <li key={index}>{activity.type}: {activity.minutes} minutes, {activity.points} points</li>)}</ul>
        )}
      </div>
    </section>
  );
}
