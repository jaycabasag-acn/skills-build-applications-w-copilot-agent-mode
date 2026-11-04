import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

type Team = { name: string; members: unknown[] };

export default function Teams() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ teams: Team[] }>('/api/teams').then(({ teams: result }) => {
      if (active) setTeams(result);
    }).catch(() => {
      if (active) setHasError(true);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Teams</h2>
        <p>Manage teams and members.</p>
        {teams === null && !hasError && <p role="status">Loading teams...</p>}
        {hasError && <p role="alert">Unable to load teams. Please try again later.</p>}
        {teams !== null && teams.length === 0 && <p>No teams yet.</p>}
        {teams !== null && teams.length > 0 && (
          <ul>{teams.map((team, index) => <li key={index}>{team.name} ({team.members.length} members)</li>)}</ul>
        )}
      </div>
    </section>
  );
}
