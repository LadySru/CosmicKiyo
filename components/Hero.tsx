import Image from 'next/image';
import SparkleField from './SparkleField';

export default function Hero() {
  return (
    <div className="hero">
      <SparkleField />

      <div className="avatar-wrap">
        <div className="avatar-orbit" />
        <div className="avatar-ring" />
        <Image
          src="/avatar.webp"
          alt="Kiyo Dreams"
          width={120}
          height={120}
          className="avatar-photo"
          priority
        />
      </div>

      <h1 className="hero-name">Kiyo Dreams</h1>
      <p className="hero-handle">˚₊· dev · cosplayer · gamer · dreamer ·˚</p>

      <div className="pill-row">
        <span className="pill pill-a">💻 dev & dreamer</span>
        <span className="pill pill-b">✨ magical girl</span>
        <span className="pill pill-c">🌸 anime lover</span>
        <span className="pill pill-d">🎮 gamer girl</span>
      </div>

      <div className="stars-row">★★★★★</div>
      <div className="heart-divider">♡ ✦ ♡ ✦ ♡</div>
    </div>
  );
}
