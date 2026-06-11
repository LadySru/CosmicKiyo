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
        <div className="skeleton skeleton-line" style={{ width: '70%' }} />
        <div className="skeleton skeleton-line" style={{ width: '45%' }} />
      </div>
      <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 999 }} />
    </div>
  );
}
