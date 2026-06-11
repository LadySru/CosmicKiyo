interface Step {
  text: React.ReactNode;
}

interface SetupCardProps {
  icon: string;
  platform?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  steps: Step[];
}

export default function SetupCard({ icon, platform, title, subtitle, description, steps }: SetupCardProps) {
  const displayTitle = platform ?? title ?? '';
  const displaySubtitle = subtitle ?? description ?? '';

  return (
    <div className="setup-card">
      <div className="setup-card-header">
        <span className="setup-card-icon">{icon}</span>
        <div>
          <div className="setup-card-title">{displayTitle}</div>
          {displaySubtitle && <div className="setup-card-subtitle">{displaySubtitle}</div>}
        </div>
      </div>
      <ol className="setup-steps">
        {steps.map((step, i) => (
          <li key={i} className="setup-step">
            <span className="step-num">{i + 1}</span>
            <span className="step-text">{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
