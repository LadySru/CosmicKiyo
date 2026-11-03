'use client';

import { useEffect, useState } from 'react';

const GLYPHS = ['✦', '✧', '⋆', '˚', '·', '✿', '◦', '❀', '♡', '★'];

interface Sparkle {
  id: number;
  glyph: string;
  top: string;
  left: string;
  dur: string;
  delay: string;
  size: string;
}

export default function SparkleField() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generated: Sparkle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      dur: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 4}s`,
      size: `${10 + Math.random() * 10}px`,
    }));
    setSparkles(generated);
  }, []);

  return (
    <div className="sparkle-field" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sp"
          style={{
            top: s.top,
            left: s.left,
            '--dur': s.dur,
            '--delay': s.delay,
            fontSize: s.size,
          } as React.CSSProperties}
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}
