import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Entry = { teamName: string; totalPoints: number; rank: number };

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ leaderboard: Entry[] }>('/api/leaderboard').then(({ leaderboard }) => {
      if (active) setEntries(leaderboard);
    }).catch(() => {
      if (active) setHasError(true);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Leaderboard</h2>
        <p>Compare team point totals.</p>
        {entries === null && !hasError && <p role="status">Loading leaderboard...</p>}
        {hasError && <p role="alert">Unable to load leaderboard. Please try again later.</p>}
        {entries !== null && entries.length === 0 && <p>No leaderboard rankings yet.</p>}
        {entries !== null && entries.length > 0 && (
          <ol>{entries.map((entry) => <li key={entry.rank}>{entry.teamName}: {entry.totalPoints} points</li>)}</ol>
        )}
      </div>
    </section>
  );
}
