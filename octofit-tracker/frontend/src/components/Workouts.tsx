import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Workout = { title: string; reason: string };
const userEmail = 'mona@example.com';

export default function Workouts() {
  const [suggestions, setSuggestions] = useState<Workout[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ suggestions: Workout[] }>(`/api/workouts/suggestions/${encodeURIComponent(userEmail)}`).then(({ suggestions: result }) => {
      if (active) setSuggestions(result);
    }).catch(() => {
      if (active) setHasError(true);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Workout suggestions</h2>
        <p>Recommend workouts from activity patterns.</p>
        {suggestions === null && !hasError && <p role="status">Loading workout suggestions...</p>}
        {hasError && <p role="alert">Unable to load workout suggestions. Please try again later.</p>}
        {suggestions !== null && suggestions.length === 0 && <p>No workout suggestions available.</p>}
        {suggestions !== null && suggestions.length > 0 && (
          <ul>{suggestions.map((workout, index) => <li key={index}>{workout.title}: {workout.reason}</li>)}</ul>
        )}
      </div>
    </section>
  );
}
