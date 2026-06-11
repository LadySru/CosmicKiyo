export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text-sm" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <div className="skeleton skeleton-thumb" />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line-sm" />
      </div>
    </div>
  );
}
