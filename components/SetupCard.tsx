interface Step {
  text: string;
}

interface SetupCardProps {
  icon: string;
  title: string;
  description: string;
  steps: Step[];
}

export default function SetupCard({ icon, title, description, steps }: SetupCardProps) {
  return (
    <div className="setup-card">
      <span className="setup-icon">{icon}</span>
      <h3 className="setup-title">{title}</h3>
      <p className="setup-desc">{description}</p>
      <ol className="setup-steps">
        {steps.map((step, i) => (
          <li key={i}>{step.text}</li>
        ))}
      </ol>
    </div>
  );
}
