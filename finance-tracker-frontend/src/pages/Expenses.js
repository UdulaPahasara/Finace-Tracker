// import React, { useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// import '../styles/ExpensesStyles.css';
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


// export default function Expenses() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [expenses, setExpenses] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     category: 'Food',
//     amount: '',
//     expenseDate: new Date().toISOString().split('T')[0],
//     description: ''
//   });
//   const [filters, setFilters] = useState({
//     category: '',
//     minAmount: '',
//     maxAmount: ''
//   });

//   useEffect(() => {
//     if (user) fetchExpenses();
//   }, [user]);

//   useEffect(() => {
//     applyFilters();
//   }, [expenses, filters]);

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const fetchExpenses = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/expenses?userId=${user.id}`);
//       setExpenses(response.data || []);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//       setExpenses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = expenses;
//     if (filters.category) filtered = filtered.filter(exp => exp.category === filters.category);
//     if (filters.minAmount) filtered = filtered.filter(exp => exp.amount >= parseFloat(filters.minAmount));
//     if (filters.maxAmount) filtered = filtered.filter(exp => exp.amount <= parseFloat(filters.maxAmount));
//     setFilteredExpenses(filtered);
//   };

//   const categories = ['Food', 'Transport', 'Groceries', 'Entertainment', 'Education', 'Health', 'Utilities', 'Other'];

//   const handleOpenModal = (expense = null) => {
//     if (expense) {
//       setEditingId(expense.id);
//       setFormData({
//         category: expense.category,
//         amount: expense.amount,
//         expenseDate: expense.expense_date || expense.expenseDate,
//         description: expense.description
//       });
//     } else {
//       setEditingId(null);
//       setFormData({
//         category: 'Food',
//         amount: '',
//         expenseDate: new Date().toISOString().split('T')[0],
//         description: ''
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
//     if (!formData.amount) {
//       toast.success('Please enter an amount');
//       return;
//     }
//     try {
//       const payload = {
//         userId: user.id,
//         category: formData.category,
//         amount: parseFloat(formData.amount),
//         expenseDate: formData.expenseDate,
//         description: formData.description
//       };
//       if (editingId) {
//         await api.put(`/expenses/${editingId}`, payload);
//          toast.success('Expense updated successfully!');
//       } else {
//         await api.post('/expenses', payload);
//          toast.success('Expense added successfully!');
//       }
//       handleCloseModal();
//       fetchExpenses();
//     } catch (error) {
//       console.error('Error saving expense:', error);
//        toast.error('Error saving expense');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this expense?')) {
//       try {
//         await api.delete(`/expenses/${id}`);
//         toast.success('Expense deleted successfully!');
//         fetchExpenses();
//       } catch (error) {
//         console.error('Error deleting expense:', error);
//          toast.error('Error deleting expense');
//       }
//     }
//   };

//   const currentPath = window.location.pathname;

//   return (
//        <>
//           <ToastContainer position="top-right" autoClose={3000} />
//     <div className="dashboard-outer">
//       {/* Sidebar (same as Budget) */}
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

//       {/* Main content area, styled to match Budgets page */}
//       <main className="dashboard-main expenses-main">
//         {/* Header actions */}
//         <div className="expenses-header">
//           <h1>📋 Expenses</h1>
//           <div className="header-actions">
//             <button className="add-expense-btn" onClick={() => handleOpenModal()}>
//               + Add Expense
//             </button>
//           </div>
//         </div>

//         {/* Content card */}
//         <div className="expenses-content">
//           <div className="expenses-container">
//             {/* Filters */}
//             <div className="filters-section">
//               <div className="filter-group">
//                 <label>Category</label>
//                 <select 
//                   value={filters.category}
//                   onChange={(e) => setFilters({...filters, category: e.target.value})}
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="filter-group">
//                 <label>Min Amount</label>
//                 <input 
//                   type="number"
//                   placeholder="Min amount"
//                   value={filters.minAmount}
//                   onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
//                 />
//               </div>
//               <div className="filter-group">
//                 <label>Max Amount</label>
//                 <input 
//                   type="number"
//                   placeholder="Max amount"
//                   value={filters.maxAmount}
//                   onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
//                 />
//               </div>
//               <button
//                 style={{
//                   alignSelf: 'flex-end',
//                   padding: '10px 20px',
//                   background: '#667eea',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '5px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//                 onClick={() => setFilters({category: '', minAmount: '', maxAmount: ''})}
//               >
//                 Reset Filters
//               </button>
//             </div>

//             {/* Table */}
//             <div className="expenses-table-section">
//               {loading ? (
//                 <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
//                   Loading expenses...
//                 </div>
//               ) : filteredExpenses.length === 0 ? (
//                 <div className="empty-state">
//                   <div className="empty-state-icon">📭</div>
//                   <h3>No expenses found</h3>
//                   <p>Click "Add Expense" to add your first transaction</p>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="expenses-table">
//                     <thead>
//                       <tr>
//                         <th>Category</th>
//                         <th>Amount</th>
//                         <th>Date</th>
//                         <th>Description</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredExpenses.map(expense => (
//                         <tr key={expense.id}>
//                           <td>
//                             <span className="category-badge">{expense.category}</span>
//                           </td>
//                           <td className="amount">Rs. {expense.amount.toLocaleString()}</td>
//                           <td>
//   {expense.expense_date || expense.expenseDate || expense.date
//     ? new Date(expense.expense_date || expense.expenseDate || expense.date).toLocaleDateString()
//     : ''}
// </td>

//                           <td>{expense.description}</td>
//                           <td>
//                             <div className="action-buttons">
//                               <button
//                                 className="edit-btn"
//                                 onClick={() => handleOpenModal(expense)}
//                               >
//                                 ✏️ Edit
//                               </button>
//                               <button
//                                 className="delete-btn"
//                                 onClick={() => handleDelete(expense.id)}
//                               >
//                                 🗑️ Delete
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Modal for Add/Edit */}
//         <div className={`modal ${showModal ? 'show' : ''}`}>
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
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
//                 <label>Amount (Rs.)</label>
//                 <input 
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleFormChange}
//                   placeholder="Enter amount"
//                   step="0.01"
//                   min="0"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Date</label>
//                 <input 
//                   type="date"
//                   name="expenseDate"
//                   value={formData.expenseDate}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Description</label>
//                 <textarea 
//                   name="description"
//                   value={formData.description}
//                   onChange={handleFormChange}
//                   placeholder="Enter description"
//                 ></textarea>
//               </div>
//               <div className="form-actions">
//                 <button type="submit" className="submit-btn">
//                   {editingId ? 'Update' : 'Add'} Expense
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
//      </>
//   );
// }











import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/ExpensesStyles.css';
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

export default function Expenses() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/expenses?userId=${user.id}`);
      setExpenses(response.data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Only category and date filters remain ----
  const applyFilters = () => {
    let filtered = expenses;
    if (filters.category)
      filtered = filtered.filter(exp => exp.category === filters.category);

    if (filters.dateFrom)
      filtered = filtered.filter(
        exp =>
          new Date(exp.expense_date || exp.expenseDate) >= new Date(filters.dateFrom)
      );

    if (filters.dateTo)
      filtered = filtered.filter(
        exp =>
          new Date(exp.expense_date || exp.expenseDate) <= new Date(filters.dateTo)
      );
    setFilteredExpenses(filtered);
  };

  const categories = [
    'Food',
    'Transport',
    'Groceries',
    'Entertainment',
    'Education',
    'Health',
    'Utilities',
    'Other'
  ];

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingId(expense.id);
      setFormData({
        category: expense.category,
        amount: expense.amount,
        expenseDate: expense.expense_date || expense.expenseDate,
        description: expense.description
      });
    } else {
      setEditingId(null);
      setFormData({
        category: 'Food',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        description: ''
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
    if (!formData.amount) {
      toast.success('Please enter an amount');
      return;
    }
    try {
      const payload = {
        userId: user.id,
        category: formData.category,
        amount: parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        description: formData.description
      };
      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        toast.success('Expense updated successfully!');
      } else {
        await api.post('/expenses', payload);
        toast.success('Expense added successfully!');
      }
      handleCloseModal();
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Error saving expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/expenses/${id}`);
        toast.success('Expense deleted successfully!');
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Error deleting expense');
      }
    }
  };

  const currentPath = window.location.pathname;

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
        <main className="dashboard-main expenses-main">
          {/* Header actions */}
          <div className="expenses-header">
            <h1>📋 Expenses</h1>
            <div className="header-actions">
              <button className="add-expense-btn" onClick={() => handleOpenModal()}>
                + Add Expense
              </button>
            </div>
          </div>

          {/* Content card */}
          <div className="expenses-content">
            <div className="expenses-container">

              {/* Category and Date filters */}
              <div className="filters-section">
                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>
                <div className="filter-group">
                  <label>Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
                <button
                  style={{
                    alignSelf: 'flex-end',
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  onClick={() => setFilters({ category: '', dateFrom: '', dateTo: '' })}
                >
                  Reset Filters
                </button>
              </div>

              {/* Table */}
              <div className="expenses-table-section">
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    Loading expenses...
                  </div>
                ) : filteredExpenses.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h3>No expenses found</h3>
                    <p>Click "Add Expense" to add your first transaction</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="expenses-table">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map(expense => (
                          <tr key={expense.id}>
                            <td>
                              <span className="category-badge">{expense.category}</span>
                            </td>
                            <td className="amount">Rs. {expense.amount.toLocaleString()}</td>
                            <td>
                              {expense.expense_date || expense.expenseDate || expense.date
                                ? new Date(expense.expense_date || expense.expenseDate || expense.date).toLocaleDateString()
                                : ''}
                            </td>
                            <td>{expense.description}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="edit-btn"
                                  onClick={() => handleOpenModal(expense)}
                                >✏️ Edit</button>
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDelete(expense.id)}
                                >🗑️ Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal for Add/Edit */}
          <div className={`modal ${showModal ? 'show' : ''}`}>
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
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
                  <label>Amount (Rs.)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="expenseDate"
                    value={formData.expenseDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter description"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingId ? 'Update' : 'Add'} Expense
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







