'use client';

import { useEffect, useState } from 'react';

const GLYPHS = ['✦', '✧', '⋆', '˚', '·', '✿', '◦', '❀', '♡', '★'];

interface Sparkle {
  id: number;
  glyph: string;
  top: string;
  left: string;
  fontSize: string;
  dur: string;
  delay: string;
}

export default function SparkleField() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generated: Sparkle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      top: `${Math.random() * 92}%`,
      left: `${Math.random() * 96}%`,
      fontSize: `${8 + Math.random() * 12}px`,
      dur: `${1.8 + Math.random() * 2.2}s`,
      delay: `${Math.random() * 3}s`,
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
            fontSize: s.fontSize,
            '--dur': s.dur,
            '--delay': s.delay,
          } as React.CSSProperties}
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}
