'use client';

import { useEffect, useState } from 'react';

interface PollOption {
  id: string;
  character: string;
  series: string;
  emoji: string;
  votes: number;
}

const VOTED_KEY = 'kiyo_poll_voted';

export default function CosplayPoll() {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { setVoted(localStorage.getItem(VOTED_KEY)); } catch { /* ignore */ }
    fetch('/api/polls')
      .then((r) => r.json())
      .then((d) => { setOptions(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleVote(id: string) {
    if (voted) return;
    const res = await fetch('/api/polls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOptions((prev) => prev.map((o) => o.id === id ? { ...o, votes: updated.votes } : o));
      setVoted(id);
      try { localStorage.setItem(VOTED_KEY, id); } catch { /* ignore */ }
    }
  }

  const totalVotes = options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="poll-wrap">
      <h3 className="poll-heading">✦ What should Kiyo cosplay next?</h3>
      <p className="poll-sub">vote for your favourite — results update live!</p>
      {loading ? (
        <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Loading poll…</p>
      ) : (
        <div className="poll-grid">
          {options.map((opt) => {
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isVoted = voted === opt.id;
            return (
              <div key={opt.id} className={`poll-card${isVoted ? ' poll-voted' : ''}`}>
                <span className="poll-emoji">{opt.emoji}</span>
                <div className="poll-character">{opt.character}</div>
                <div className="poll-series">{opt.series}</div>
                {voted ? (
                  <div className="poll-bar-wrap">
                    <div className="poll-bar" style={{ width: `${pct}%` }} />
                    <span className="poll-pct">{pct}%</span>
                  </div>
                ) : (
                  <button className="poll-btn" onClick={() => handleVote(opt.id)}>
                    Vote ♡
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {voted && <p className="poll-thanks">✨ Thanks for voting! Results above.</p>}
    </div>
  );
}
