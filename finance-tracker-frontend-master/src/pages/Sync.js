import React, { useState } from 'react';
import api from '../services/api';

// Each sync task below matches your backend endpoints
const syncTasks = [
  { key: 'users', label: 'Users', url: '/sync/users-to-oracle' },
  { key: 'budgets', label: 'Budgets', url: '/sync/sqlite-to-oracle/budgets' },
  { key: 'expenses', label: 'Expenses', url: '/sync/sqlite-to-oracle/expenses' },
  { key: 'savings', label: 'Savings', url: '/sync/sqlite-to-oracle/savings' }
];

export default function Sync() {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState({});

  // Sync an individual item (users, budgets, expenses, savings)
  const handleSync = async (task) => {
    setStatus(s => ({ ...s, [task.key]: 'Synchronizing...' }));
    setLoading(l => ({ ...l, [task.key]: true }));
    try {
      const res = await api.post(task.url);   // IMPORTANT: do NOT add extra /api prefix!
      setStatus(s => ({ ...s, [task.key]: res.data || 'Sync complete!' }));
    } catch (error) {
      setStatus(s => ({
        ...s,
        [task.key]: 'Sync failed: ' + (error.response?.data?.message || error.message)
      }));
    } finally {
      setLoading(l => ({ ...l, [task.key]: false }));
    }
  };

  // Sync all types in order (users → budgets → expenses → savings)
  const handleSyncAll = async () => {
    for (const task of syncTasks) {
      // eslint-disable-next-line no-await-in-loop
      await handleSync(task);
    }
  };

  return (
    <div className="budgets-wrapper" style={{ padding: 40 }}>
      <h1>🔄 Sync SQLite Data to Oracle</h1>
      <button
        className="add-budget-btn"
        onClick={handleSyncAll}
        style={{ marginBottom: 28 }}>
        Sync All
      </button>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {syncTasks.map(task => (
          <div key={task.key} style={{ minWidth: 240 }}>
            <button
              className="add-budget-btn"
              onClick={() => handleSync(task)}
              disabled={loading[task.key]}
            >
              {loading[task.key] ? 'Syncing...' : `Sync ${task.label}`}
            </button>
            <div style={{ padding: 8, minHeight: 24 }}>
              {status[task.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
