import SparkleField from './SparkleField';

export default function Hero() {
  return (
    <section className="hero">
      <SparkleField />

      {/* Floating Avatar */}
      <div className="avatar-wrap">
        <div className="avatar-orbit" />
        <div className="avatar-inner">🌸</div>
      </div>

      {/* Name */}
      <h1 className="hero-name">Kiyo Dreams</h1>

      {/* Handle */}
      <p className="hero-handle">˚₊· cosplayer · gamer · dreamer ·˚</p>

      {/* Stars */}
      <div className="stars-row" aria-label="5 stars">
        {['★', '★', '★', '★', '★'].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      {/* Heart divider */}
      <div className="heart-divider">
        <span>♡</span>
      </div>

      {/* Pill row */}
      <div className="pill-row">
        <span className="pill pill-a">🎀 cosplay queen</span>
        <span className="pill pill-b">✨ magical girl</span>
        <span className="pill pill-c">🌸 anime lover</span>
        <span className="pill pill-d">🎮 gamer girl</span>
      </div>
    </section>
  );
}
