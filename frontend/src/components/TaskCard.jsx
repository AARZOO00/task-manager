import styles from './TaskCard.module.css';

const STATUS_CONFIG = {
  'todo': { label: 'To Do', color: '#8888aa' },
  'in-progress': { label: 'In Progress', color: '#4da6ff' },
  'done': { label: 'Done', color: '#00d68f' },
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: '#00d68f' },
  'medium': { label: 'Medium', color: '#ffb347' },
  'high': { label: 'High', color: '#ff6b6b' },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const nextStatus = { 'todo': 'in-progress', 'in-progress': 'done', 'done': 'todo' };

  return (
    <div className={`${styles.card} ${task.status === 'done' ? styles.done : ''}`}>
      <div className={styles.topRow}>
        <button
          className={styles.statusBadge}
          style={{ '--status-color': status.color }}
          onClick={() => onStatusChange(task._id, nextStatus[task.status])}
          title="Click to advance status"
        >
          <span className={styles.statusDot} />
          {status.label}
        </button>
        <span className={styles.priority} style={{ '--p-color': priority.color }}>
          {priority.label}
        </span>
      </div>

      <h3 className={styles.title}>{task.title}</h3>

      {task.description && (
        <p className={styles.desc}>{task.description}</p>
      )}

      <div className={styles.footer}>
        {task.dueDate && (
          <span className={`${styles.due} ${isOverdue ? styles.overdue : ''}`}>
            {isOverdue ? '⚠ ' : '📅 '}
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => onEdit(task)} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className={styles.deleteBtn} onClick={() => onDelete(task._id)} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
