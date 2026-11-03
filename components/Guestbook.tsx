'use client';

import { useEffect, useState, useRef } from 'react';

interface GuestEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

function formatDate(ts: string): string {
  try {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch('/api/guestbook')
      .then((r) => r.json())
      .then((d) => { setEntries(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = stripHtml(nameRef.current?.value ?? '');
    const message = stripHtml(msgRef.current?.value ?? '');
    if (!name || !message) { setError('Both name and message are required.'); return; }
    if (name.length > 40) { setError('Name must be 40 characters or less.'); return; }
    if (message.length > 200) { setError('Message must be 200 characters or less.'); return; }

    setError('');
    setSubmitting(true);

    const optimistic: GuestEntry = {
      id: Date.now().toString(),
      name,
      message,
      timestamp: new Date().toISOString(),
    };
    setEntries((prev) => [optimistic, ...prev]);
    if (nameRef.current) nameRef.current.value = '';
    if (msgRef.current) msgRef.current.value = '';

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setEntries((prev) => prev.filter((e) => e.id !== optimistic.id));
      setError('Could not save your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="gb-wrap">
      <h3 className="gb-heading">💌 Leave a message</h3>
      <p className="gb-sub">Say hi, share some love, or just drop a ♡</p>

      <form className="gb-form" onSubmit={handleSubmit}>
        <input
          ref={nameRef}
          className="gb-input"
          type="text"
          placeholder="Your name ✦"
          maxLength={40}
          required
        />
        <textarea
          ref={msgRef}
          className="gb-textarea"
          placeholder="Leave a little message... (max 200 chars)"
          maxLength={200}
          rows={3}
          required
        />
        {error && <p className="gb-error">{error}</p>}
        {success && <p className="gb-success">✦ Message sent! Thank you ♡</p>}
        <button className="gb-submit" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : '✦ Send message'}
        </button>
      </form>

      {loading && (
        <div className="gb-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="gb-skeleton" />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="gb-empty">No messages yet — be the first! ✨</p>
      )}

      {!loading && entries.length > 0 && (
        <div className="gb-list">
          {entries.map((entry) => (
            <div key={entry.id} className="gb-card">
              <div className="gb-card-header">
                <span className="gb-card-name">{entry.name}</span>
                <span className="gb-card-heart">♡</span>
                <span className="gb-card-date">{formatDate(entry.timestamp)}</span>
              </div>
              <p className="gb-card-msg">{entry.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
