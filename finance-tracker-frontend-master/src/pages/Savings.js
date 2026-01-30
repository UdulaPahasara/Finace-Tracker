// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// import '../styles/BudgetsStyles.css';
// import '../styles/Dashboard.css';

// const features = [
//   { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
//   { icon: '📋', title: 'Expenses', path: '/expenses' },
//   { icon: '💰', title: 'Budgets', path: '/budgets' },
//   { icon: '🎯', title: 'Savings Goals', path: '/savings' },
//   { icon: '📊', title: 'Analytics', path: '/reports' }, // <- update here
//   { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
// ];


// export default function Savings() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [goals, setGoals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     goalName: '',
//     targetAmount: '',
//     currentAmount: '',
//     deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString().split('T')[0]
//   });

//   useEffect(() => {
//     if (user) fetchGoals();
//   }, [user]);

//   const fetchGoals = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/savings?userId=${user.id}`);
//       setGoals(res.data || []);
//     } catch (err) {
//       setGoals([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const handleOpenModal = (goal = null) => {
//     if (goal) {
//       setEditingId(goal.id);
//       setFormData({
//         goalName: goal.goalName || goal.goal_name,
//         targetAmount: goal.targetAmount || goal.target_amount,
//         currentAmount: goal.currentAmount || goal.current_amount || 0,
//         deadline: goal.deadline
//       });
//     } else {
//       setEditingId(null);
//       setFormData({
//         goalName: '',
//         targetAmount: '',
//         currentAmount: '',
//         deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString().split('T')[0]
//       });
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditingId(null);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.goalName || !formData.targetAmount) {
//       alert('Enter all required fields');
//       return;
//     }
//     try {
//       const payload = {
//         userId: user.id,
//         goalName: formData.goalName,
//         targetAmount: parseFloat(formData.targetAmount),
//         currentAmount: parseFloat(formData.currentAmount || 0),
//         deadline: formData.deadline
//       };
//       if (editingId) {
//         await api.put(`/savings/${editingId}`, payload);
//         alert('Savings goal updated!');
//       } else {
//         await api.post('/savings', payload);
//         alert('Savings goal added!');
//       }
//       handleCloseModal();
//       fetchGoals();
//     } catch (err) {
//       alert('Error saving savings goal');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this goal?')) {
//       try {
//         await api.delete(`/savings/${id}`);
//         alert('Deleted!');
//         fetchGoals();
//       } catch {
//         alert('Error deleting goal');
//       }
//     }
//   };

//   const currentPath = window.location.pathname;

//   return (
//     <div className="dashboard-outer">
//       {/* Sidebar */}
//       <aside className="dashboard-sidebar">
//         <div className="sidebar-logo"><span>💸</span></div>
//         <nav className="sidebar-menu">
//           {features.map(f => (
//             <div
//               className={'menu-item' + (currentPath === f.path ? ' active' : '')}
//               key={f.title}
//               onClick={() => navigate(f.path)}
//             >
//               <span className="menu-icon">{f.icon}</span>
//               <span className="menu-title">{f.title}</span>
//             </div>
//           ))}
//         </nav>
//         <div className="sidebar-footer">
//           <button className="logout-btn" onClick={logout}>
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="dashboard-main savings-main">
//         {/* Profile/topnav */}
       

//         {/* Header actions */}
//         <div className="budgets-header">
//           <h1>🎯 Savings Goals</h1>
//           <div className="header-actions">
//             <button className="add-budget-btn" onClick={() => handleOpenModal()}>
//               + Add Goal
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="budgets-content">
//           <div className="budgets-container">
//             {loading ? (
//               <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
//                 Loading savings...
//               </div>
//             ) : goals.length === 0 ? (
//               <div className="empty-state">
//                 <div className="empty-state-icon">💰</div>
//                 <h3>No savings goals set</h3>
//                 <p>Click "Add Goal" to create your first goal</p>
//               </div>
//             ) : (
//               <div className="budgets-grid">
//                 {goals.map(goal => {
//                   const current = goal.currentAmount || goal.current_amount || 0;
//                   const target = goal.targetAmount || goal.target_amount;
//                   const percentage = Math.round((current / target) * 100);
//                   const remaining = (target - current);

//                   return (
//                     <div key={goal.id} className="budget-card">
//                       <div className="budget-header">
//                         <h3 className="budget-title">{goal.goalName || goal.goal_name}</h3>
//                         <span className={`budget-status ${percentage >= 100 ? 'status-safe' : 'status-warning'}`}>
//                           {percentage}%
//                         </span>
//                       </div>
//                       <div className="budget-info">
//                         <div className="budget-row">
//                           <span>Target:</span>
//                           <strong>Rs. {target.toLocaleString()}</strong>
//                         </div>
//                         <div className="budget-row">
//                           <span>Saved:</span>
//                           <strong>Rs. {current.toLocaleString()}</strong>
//                         </div>
//                         <div className="budget-row">
//                           <span>Remaining:</span>
//                           <strong style={{ color: remaining > 0 ? '#dc3545' : '#27ae60' }}>
//                             Rs. {remaining > 0 ? remaining.toLocaleString() : 0}
//                           </strong>
//                         </div>
//                       </div>
//                       <div className="progress-section">
//                         <div className="progress-bar-bg">
//                           <div
//                             className="progress-bar-fill"
//                             style={{ width: `${Math.min(percentage, 100)}%` }}
//                           ></div>
//                         </div>
//                         <div className="progress-text">
//                           <span>Deadline</span>
//                           <span>{goal.deadline}</span>
//                         </div>
//                       </div>
//                       <div className="budget-actions">
//                         <button
//                           className="edit-budget-btn"
//                           onClick={() => handleOpenModal(goal)}
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           className="delete-budget-btn"
//                           onClick={() => handleDelete(goal.id)}
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Modal */}
//         <div className={`modal ${showModal ? 'show' : ''}`}>
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>{editingId ? 'Edit Savings Goal' : 'Add New Goal'}</h2>
//               <button className="close-btn" onClick={handleCloseModal}>×</button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label>Goal Name</label>
//                 <input
//                   type="text"
//                   name="goalName"
//                   value={formData.goalName}
//                   onChange={handleFormChange}
//                   placeholder="E.g. Laptop, Vacation"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Target Amount (Rs.)</label>
//                 <input
//                   type="number"
//                   name="targetAmount"
//                   value={formData.targetAmount}
//                   onChange={handleFormChange}
//                   min="1"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Current Saved (Rs.)</label>
//                 <input
//                   type="number"
//                   name="currentAmount"
//                   value={formData.currentAmount}
//                   onChange={handleFormChange}
//                   min="0"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Deadline</label>
//                 <input
//                   type="date"
//                   name="deadline"
//                   value={formData.deadline}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>
//               <div className="form-actions">
//                 <button type="submit" className="submit-btn">
//                   {editingId ? 'Update' : 'Add'} Goal
//                 </button>
//                 <button type="button" className="cancel-btn" onClick={handleCloseModal}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
















import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/BudgetsStyles.css';
import '../styles/Dashboard.css';

const features = [
  { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
  { icon: '📋', title: 'Expenses', path: '/expenses' },
  { icon: '💰', title: 'Budgets', path: '/budgets' },
  { icon: '🎯', title: 'Savings Goals', path: '/savings' },
  { icon: '📊', title: 'Analytics', path: '/reports' },
  { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
];

export default function Savings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString().split('T')[0]
  });
  // NEW: for search
  const [goalSearch, setGoalSearch] = useState('');

  useEffect(() => {
    if (user) fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/savings?userId=${user.id}`);
      setGoals(res.data || []);
    } catch (err) {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingId(goal.id);
      setFormData({
        goalName: goal.goalName || goal.goal_name,
        targetAmount: goal.targetAmount || goal.target_amount,
        currentAmount: goal.currentAmount || goal.current_amount || 0,
        deadline: goal.deadline
      });
    } else {
      setEditingId(null);
      setFormData({
        goalName: '',
        targetAmount: '',
        currentAmount: '',
        deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goalName || !formData.targetAmount) {
      alert('Enter all required fields');
      return;
    }
    try {
      const payload = {
        userId: user.id,
        goalName: formData.goalName,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0),
        deadline: formData.deadline
      };
      if (editingId) {
        await api.put(`/savings/${editingId}`, payload);
        alert('Savings goal updated!');
      } else {
        await api.post('/savings', payload);
        alert('Savings goal added!');
      }
      handleCloseModal();
      fetchGoals();
    } catch (err) {
      alert('Error saving savings goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/savings/${id}`);
        alert('Deleted!');
        fetchGoals();
      } catch {
        alert('Error deleting goal');
      }
    }
  };

  const currentPath = window.location.pathname;

  // Search filter for goals
  const goalsFiltered = goals.filter(goal => {
    const name = (goal.goalName || goal.goal_name || '').toLowerCase();
    return name.includes(goalSearch.trim().toLowerCase());
  });

  return (
    <div className="dashboard-outer">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo"><span>💸</span></div>
        <nav className="sidebar-menu">
          {features.map(f => (
            <div
              className={'menu-item' + (currentPath === f.path ? ' active' : '')}
              key={f.title}
              onClick={() => navigate(f.path)}
            >
              <span className="menu-icon">{f.icon}</span>
              <span className="menu-title">{f.title}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main savings-main">
        <div className="budgets-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
          <h1>🎯 Savings Goals</h1>
          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* NEW: Search box */}
            <input
              type="text"
              placeholder="Search goal name..."
              value={goalSearch}
              onChange={e => setGoalSearch(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 5,
                fontSize: "1rem",
                minWidth: 180
              }}
            />
            <button className="add-budget-btn" onClick={() => handleOpenModal()}>
              + Add Goal
            </button>
          </div>
        </div>
        <div className="budgets-content">
          <div className="budgets-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                Loading savings...
              </div>
            ) : goalsFiltered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <h3>No savings goals found</h3>
                <p>Click "Add Goal" to create your first goal</p>
              </div>
            ) : (
              <div className="budgets-grid">
                {goalsFiltered.map(goal => {
                  const current = goal.currentAmount || goal.current_amount || 0;
                  const target = goal.targetAmount || goal.target_amount;
                  const percentage = Math.round((current / target) * 100);
                  const remaining = (target - current);

                  return (
                    <div key={goal.id} className="budget-card">
                      <div className="budget-header">
                        <h3 className="budget-title">{goal.goalName || goal.goal_name}</h3>
                        <span className={`budget-status ${percentage >= 100 ? 'status-safe' : 'status-warning'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="budget-info">
                        <div className="budget-row">
                          <span>Target:</span>
                          <strong>Rs. {target.toLocaleString()}</strong>
                        </div>
                        <div className="budget-row">
                          <span>Saved:</span>
                          <strong>Rs. {current.toLocaleString()}</strong>
                        </div>
                        <div className="budget-row">
                          <span>Remaining:</span>
                          <strong style={{ color: remaining > 0 ? '#dc3545' : '#27ae60' }}>
                            Rs. {remaining > 0 ? remaining.toLocaleString() : 0}
                          </strong>
                        </div>
                      </div>
                      <div className="progress-section">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          <span>Deadline</span>
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                      <div className="budget-actions">
                        <button
                          className="edit-budget-btn"
                          onClick={() => handleOpenModal(goal)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete-budget-btn"
                          onClick={() => handleDelete(goal.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <div className={`modal ${showModal ? 'show' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Savings Goal' : 'Add New Goal'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleFormChange}
                  placeholder="E.g. Laptop, Vacation"
                  required
                />
              </div>
              <div className="form-group">
                <label>Target Amount (Rs.)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleFormChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Current Saved (Rs.)</label>
                <input
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleFormChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update' : 'Add'} Goal
                </button>
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
