export default function StatusBadge({ status }) {
  const colorMap = {
    PENDING: 'bg-warning text-dark',
    CONFIRMED: 'bg-info text-dark',
    IN_PROGRESS: 'bg-primary',
    COMPLETED: 'bg-success',
    CANCELLED: 'bg-secondary',
    ACTIVE: 'bg-success',
    INACTIVE: 'bg-danger',
  };

  return (
    <span className={`badge ${colorMap[status] || 'bg-secondary'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}