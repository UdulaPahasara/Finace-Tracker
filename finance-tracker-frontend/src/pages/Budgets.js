// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// import '../styles/BudgetsStyles.css';
// import '../styles/Dashboard.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const features = [
//   { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
//   { icon: '📋', title: 'Expenses', path: '/expenses' },
//   { icon: '💰', title: 'Budgets', path: '/budgets' },
//   { icon: '🎯', title: 'Savings Goals', path: '/savings' },
//   { icon: '📊', title: 'Analytics', path: '/reports' }, // <- update here
//   { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
// ];


// export default function Budgets() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [budgets, setBudgets] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     category: 'Food',
//     budgetAmount: '',
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
//   });

//   useEffect(() => {
//     if (user) fetchData();
//     // eslint-disable-next-line
//   }, [user]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [budgetsRes, expensesRes] = await Promise.all([
//         api.get(`/budgets?userId=${user.id}`),
//         api.get(`/expenses?userId=${user.id}`),
//       ]);
//       setBudgets(budgetsRes.data || []);
//       setExpenses(expensesRes.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setBudgets([]);
//       setExpenses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const categories = [
//     'Food', 'Transport', 'Groceries', 'Entertainment',
//     'Education', 'Health', 'Utilities', 'Other'
//   ];

//   // Calculate spent for budget category/date range
//   const getSpentAmount = (category, startDate, endDate) => {
//     return expenses
//       .filter(exp =>
//         exp.category === category &&
//         new Date(exp.expenseDate || exp.expense_date) >= new Date(startDate) &&
//         new Date(exp.expenseDate || exp.expense_date) <= new Date(endDate)
//       )
//       .reduce((sum, exp) => sum + exp.amount, 0);
//   };

//   const getStatus = (percentage) => {
//     if (percentage < 70) return 'safe';
//     if (percentage < 100) return 'warning';
//     return 'exceeded';
//   };

//   const handleOpenModal = (budget = null) => {
//     if (budget) {
//       setEditingId(budget.id);
//       setFormData({
//         category: budget.category,
//         budgetAmount: budget.budgetAmount || budget.budget_amount,
//         startDate: budget.startDate || budget.start_date,
//         endDate: budget.endDate || budget.end_date
//       });
//     } else {
//       setEditingId(null);
//       setFormData({
//         category: 'Food',
//         budgetAmount: '',
//         startDate: new Date().toISOString().split('T')[0],
//         endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
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

//     if (!formData.budgetAmount) {
//       alert('Please enter budget amount');
//       return;
//     }

//     try {
//       const payload = {
//         userId: user.id,
//         category: formData.category,
//         budgetAmount: parseFloat(formData.budgetAmount),
//         startDate: formData.startDate,
//         endDate: formData.endDate
//       };

//       if (editingId) {
//         await api.put(`/budgets/${editingId}`, payload);
//         toast.success('Budget updated successfully!');

//       } else {
//         await api.post('/budgets', payload);
//         toast.success('Budget created successfully!');
//       }

//       handleCloseModal();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving budget:', error);
//       toast.error('Error saving budget');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this budget?')) {
//       try {
//         await api.delete(`/budgets/${id}`);
//          toast.success('Budget deleted successfully!');
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting budget:', error);
//         toast.error('Error deleting budget');
//       }
//     }
//   };

  

  
//   const currentPath = window.location.pathname;

  


//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
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

//       {/* Main content area */}
//       <main className="dashboard-main budgets-main">
    

//         {/* Header actions buttons */}
//         <div className="budgets-header">
//           <h1>💰 Budgets</h1>
//           <div className="header-actions">
           
//             <button className="add-budget-btn" onClick={() => handleOpenModal()}>
//               + Add Budget
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="budgets-content">
//           <div className="budgets-container">
//             {loading ? (
//               <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
//                 Loading budgets...
//               </div>
//             ) : budgets.length === 0 ? (
//               <div className="empty-state">
//                 <div className="empty-state-icon">📊</div>
//                 <h3>No budgets yet</h3>
//                 <p>Click "Add Budget" to create your first budget</p>
//               </div>
//             ) : (
//               <div className="budgets-grid">
//                 {budgets.map(budget => {
//                   const spent = getSpentAmount(
//                     budget.category,
//                     budget.startDate || budget.start_date,
//                     budget.endDate || budget.end_date
//                   );
//                   const budgetAmount = budget.budgetAmount || budget.budget_amount;
//                   const percentage = Math.round((spent / budgetAmount) * 100);
//                   const status = getStatus(percentage);
//                   const remaining = budgetAmount - spent;

//                   return (
//                     <div key={budget.id} className="budget-card">
//                       <div className="budget-header">
//                         <h3 className="budget-title">{budget.category}</h3>
//                         <span className={`budget-status status-${status}`}>
//                           {percentage}%
//                         </span>
//                       </div>
//                       <div className="budget-info">
//                         <div className="budget-row">
//                           <span>Budget Amount:</span>
//                           <strong>Rs. {budgetAmount.toLocaleString()}</strong>
//                         </div>
//                         <div className="budget-row">
//                           <span>Spent:</span>
//                           <strong>Rs. {spent.toLocaleString()}</strong>
//                         </div>
//                         <div className="budget-row">
//                           <span>Remaining:</span>
//                           <strong style={{ color: remaining > 0 ? '#27ae60' : '#dc3545' }}>
//                             Rs. {remaining.toLocaleString()}
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
//                           <span>Period</span>
//                           <span>{(budget.startDate || budget.start_date)} to {(budget.endDate || budget.end_date)}</span>
//                         </div>
//                       </div>
//                       <div className="budget-actions">
//                         <button 
//                           className="edit-budget-btn"
//                           onClick={() => handleOpenModal(budget)}
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button 
//                           className="delete-budget-btn"
//                           onClick={() => handleDelete(budget.id)}
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
//               <h2>{editingId ? 'Edit Budget' : 'Add New Budget'}</h2>
//               <button className="close-btn" onClick={handleCloseModal}>×</button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label>Category</label>
//                 <select 
//                   name="category"
//                   value={formData.category}
//                   onChange={handleFormChange}
//                 >
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Budget Amount (Rs.)</label>
//                 <input 
//                   type="number"
//                   name="budgetAmount"
//                   value={formData.budgetAmount}
//                   onChange={handleFormChange}
//                   placeholder="Enter budget amount"
//                   step="0.01"
//                   min="0"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Start Date</label>
//                 <input 
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>End Date</label>
//                 <input 
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>
//               <div className="form-actions">
//                 <button type="submit" className="submit-btn">
//                   {editingId ? 'Update' : 'Create'} Budget
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
//     </>
//   );

// }



















import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/BudgetsStyles.css';
import '../styles/Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const features = [
  { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
  { icon: '📋', title: 'Expenses', path: '/expenses' },
  { icon: '💰', title: 'Budgets', path: '/budgets' },
  { icon: '🎯', title: 'Savings Goals', path: '/savings' },
  { icon: '📊', title: 'Analytics', path: '/reports' },
  { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
];

export default function Budgets() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Food',
    budgetAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });

  // --- NEW: month filter state ---
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    if (user) fetchData();
    // eslint-disable-next-line
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, expensesRes] = await Promise.all([
        api.get(`/budgets?userId=${user.id}`),
        api.get(`/expenses?userId=${user.id}`),
      ]);
      setBudgets(budgetsRes.data || []);
      setExpenses(expensesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBudgets([]);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const categories = [
    'Food', 'Transport', 'Groceries', 'Entertainment',
    'Education', 'Health', 'Utilities', 'Other'
  ];

  // Calculate spent for budget category/date range
  const getSpentAmount = (category, startDate, endDate) => {
    return expenses
      .filter(exp =>
        exp.category === category &&
        new Date(exp.expenseDate || exp.expense_date) >= new Date(startDate) &&
        new Date(exp.expenseDate || exp.expense_date) <= new Date(endDate)
      )
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getStatus = (percentage) => {
    if (percentage < 70) return 'safe';
    if (percentage < 100) return 'warning';
    return 'exceeded';
  };

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditingId(budget.id);
      setFormData({
        category: budget.category,
        budgetAmount: budget.budgetAmount || budget.budget_amount,
        startDate: budget.startDate || budget.start_date,
        endDate: budget.endDate || budget.end_date
      });
    } else {
      setEditingId(null);
      setFormData({
        category: 'Food',
        budgetAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
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
    if (!formData.budgetAmount) {
      alert('Please enter budget amount');
      return;
    }
    try {
      const payload = {
        userId: user.id,
        category: formData.category,
        budgetAmount: parseFloat(formData.budgetAmount),
        startDate: formData.startDate,
        endDate: formData.endDate
      };
      if (editingId) {
        await api.put(`/budgets/${editingId}`, payload);
        toast.success('Budget updated successfully!');
      } else {
        await api.post('/budgets', payload);
        toast.success('Budget created successfully!');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Error saving budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        toast.success('Budget deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting budget:', error);
        toast.error('Error deleting budget');
      }
    }
  };

  const currentPath = window.location.pathname;

  // --- NEW: Filtered Budgets for selected month ---
  const filteredBudgets = budgets.filter((budget) => {
    if (!selectedMonth) return true;
    // Budget range overlaps the selected month
    const [year, month] = selectedMonth.split("-");
    const filterStart = new Date(`${year}-${month}-01`);
    const filterEnd = new Date(year, parseInt(month), 0); // last day of month
    const budgetStart = new Date(budget.startDate || budget.start_date);
    const budgetEnd = new Date(budget.endDate || budget.end_date);
    // Overlap test: end >= filterStart && start <= filterEnd
    return budgetEnd >= filterStart && budgetStart <= filterEnd;
  });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="dashboard-outer">
        {/* Sidebar */}
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

        {/* Main content area */}
        <main className="dashboard-main budgets-main">

          {/* Header actions buttons, include month picker */}
          <div className="budgets-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            <h1>💰 Budgets</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* <-- MONTH FILTER ADDED HERE --> */}
              <label className="month-select-label" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                Filter by Month:
                <input
                  type="month"
                  value={selectedMonth}
                  max="2099-12"
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="month-select-input"
                  style={{ minWidth: 130 }}
                />
              </label>
              <button className="add-budget-btn" onClick={() => handleOpenModal()}>
                + Add Budget
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="budgets-content">
            <div className="budgets-container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  Loading budgets...
                </div>
              ) : filteredBudgets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <h3>No budgets for this month</h3>
                  <p>Click "Add Budget" to create your first budget</p>
                </div>
              ) : (
                <div className="budgets-grid">
                  {filteredBudgets.map(budget => {
                    const spent = getSpentAmount(
                      budget.category,
                      budget.startDate || budget.start_date,
                      budget.endDate || budget.end_date
                    );
                    const budgetAmount = budget.budgetAmount || budget.budget_amount;
                    const percentage = Math.round((spent / budgetAmount) * 100);
                    const status = getStatus(percentage);
                    const remaining = budgetAmount - spent;
                    return (
                      <div key={budget.id} className="budget-card">
                        <div className="budget-header">
                          <h3 className="budget-title">{budget.category}</h3>
                          <span className={`budget-status status-${status}`}>{percentage}%</span>
                        </div>
                        <div className="budget-info">
                          <div className="budget-row">
                            <span>Budget Amount:</span>
                            <strong>Rs. {budgetAmount.toLocaleString()}</strong>
                          </div>
                          <div className="budget-row">
                            <span>Spent:</span>
                            <strong>Rs. {spent.toLocaleString()}</strong>
                          </div>
                          <div className="budget-row">
                            <span>Remaining:</span>
                            <strong style={{ color: remaining > 0 ? '#27ae60' : '#dc3545' }}>
                              Rs. {remaining.toLocaleString()}
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
                            <span>Period</span>
                            <span>{(budget.startDate || budget.start_date)} to {(budget.endDate || budget.end_date)}</span>
                          </div>
                        </div>
                        <div className="budget-actions">
                          <button
                            className="edit-budget-btn"
                            onClick={() => handleOpenModal(budget)}
                          >✏️ Edit</button>
                          <button
                            className="delete-budget-btn"
                            onClick={() => handleDelete(budget.id)}
                          >🗑️ Delete</button>
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
                <h2>{editingId ? 'Edit Budget' : 'Add New Budget'}</h2>
                <button className="close-btn" onClick={handleCloseModal}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget Amount (Rs.)</label>
                  <input
                    type="number"
                    name="budgetAmount"
                    value={formData.budgetAmount}
                    onChange={handleFormChange}
                    placeholder="Enter budget amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingId ? 'Update' : 'Create'} Budget
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
    </>
  );
}
