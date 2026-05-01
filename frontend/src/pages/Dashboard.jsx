import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { taskApi } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import styles from './Dashboard.module.css';

const FILTERS = ['all', 'todo', 'in-progress', 'done'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      const { data } = await taskApi.getAll(params);
      setTasks(data.data);
    } catch {
      toast({ message: 'Failed to load tasks', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editingTask?._id) {
        await taskApi.update(editingTask._id, form);
        toast({ message: 'Task updated!', type: 'success' });
      } else {
        await taskApi.create(form);
        toast({ message: 'Task created!', type: 'success' });
      }
      setModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Save failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskApi.delete(id);
      toast({ message: 'Task deleted', type: 'info' });
      setDeleteConfirm(null);
      fetchTasks();
    } catch {
      toast({ message: 'Delete failed', type: 'error' });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await taskApi.update(id, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch {
      toast({ message: 'Status update failed', type: 'error' });
    }
  };

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };

  const filtered = tasks.filter(t =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoIcon}>⬡</span>
          <span>TaskFlow</span>
        </div>

        <div className={styles.userCard}>
          <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userRole}>{user?.role}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLabel}>Filter by Status</div>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.navItem} ${statusFilter === f ? styles.active : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              <span className={styles.navDot} data-status={f} />
              {f === 'all' ? 'All Tasks' : f.replace('-', ' ')}
              <span className={styles.navCount}>
                {f === 'all' ? stats.total : f === 'todo' ? stats.todo : f === 'in-progress' ? stats.inProgress : stats.done}
              </span>
            </button>
          ))}
        </nav>

        <nav className={styles.nav}>
          <div className={styles.navLabel}>Filter by Priority</div>
          {PRIORITIES.map(p => (
            <button
              key={p}
              className={`${styles.navItem} ${priorityFilter === p ? styles.active : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>My Tasks</h1>
            <p className={styles.pageSub}>{filtered.length} task{filtered.length !== 1 ? 's' : ''} {statusFilter !== 'all' ? `· ${statusFilter.replace('-', ' ')}` : ''}</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className={styles.search}
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.createBtn} onClick={openCreate}>
              <span>+</span> New Task
            </button>
          </div>
        </header>

        {/* Stats strip */}
        <div className={styles.stats}>
          {[
            { label: 'Total', value: stats.total, color: '#6c63ff' },
            { label: 'To Do', value: stats.todo, color: '#8888aa' },
            { label: 'In Progress', value: stats.inProgress, color: '#4da6ff' },
            { label: 'Done', value: stats.done, color: '#00d68f' },
          ].map(s => (
            <div key={s.label} className={styles.stat} style={{ '--s-color': s.color }}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tasks grid */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {[1,2,3,4,5,6].map(n => <div key={n} className={styles.skeleton} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✦</div>
            <h3>No tasks found</h3>
            <p>{search ? 'Try a different search term' : 'Create your first task to get started'}</p>
            {!search && (
              <button className={styles.emptyBtn} onClick={openCreate}>Create Task</button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEdit}
                onDelete={(id) => setDeleteConfirm(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onSave={handleSave}
          loading={saving}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>Delete Task?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button onClick={() => setDeleteConfirm(null)} className={styles.confirmCancel}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className={styles.confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
