// import React, { useContext, useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// import '../styles/BudgetsStyles.css';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const features = [
//   { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
//   { icon: '📋', title: 'Expenses', path: '/expenses' },
//   { icon: '📊', title: 'Analytics', path: '/reports' },
//   { icon: '💰', title: 'Budgets', path: '/budgets' },
//   { icon: '🎯', title: 'Savings Goals', path: '/savings' },
//   { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
// ];

// const reportTabs = [
//   { key: 'budget', label: 'Budget vs Expenses' },
//   { key: 'categories', label: 'Category Breakdown' },
//   { key: 'trends', label: 'Monthly Trends' },
//   { key: 'transactions', label: 'Transactions' },
//   { key: 'savings', label: 'Savings Progress' }
// ];

// export default function Reports() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [active, setActive] = useState('budget');
//   const [loading, setLoading] = useState(true);
//   const [budgets, setBudgets] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [savings, setSavings] = useState([]);
//   const [transSearch, setTransSearch] = useState('');
//   const [transCategory, setTransCategory] = useState('');
//   const [transDateFrom, setTransDateFrom] = useState('');
//   const [transDateTo, setTransDateTo] = useState('');

//   const contentRefs = {
//     budget: useRef(null),
//     categories: useRef(null),
//     trends: useRef(null),
//     transactions: useRef(null),
//     savings: useRef(null)
//   };

//   useEffect(() => {
//     if (user) fetchData();
//     // eslint-disable-next-line
//   }, [user]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [budgetsRes, expensesRes, savingsRes] = await Promise.all([
//         api.get(`/budgets?userId=${user.id}`),
//         api.get(`/expenses?userId=${user.id}`),
//         api.get(`/savings?userId=${user.id}`)
//       ]);
//       setBudgets(budgetsRes.data || []);
//       setExpenses(expensesRes.data || []);
//       setSavings(savingsRes.data || []);
//     } catch (err) {
//       setBudgets([]); setExpenses([]); setSavings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportPDF = async () => {
//     const node = contentRefs[active]?.current;
//     if (!node) return;
//     const canvas = await html2canvas(node);
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${active}_report.pdf`);
//   };

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const getSpent = (category, startDate, endDate) =>
//     expenses
//       .filter(exp =>
//         exp.category === category &&
//         new Date(exp.expenseDate || exp.expense_date) >= new Date(startDate) &&
//         new Date(exp.expenseDate || exp.expense_date) <= new Date(endDate)
//       )
//       .reduce((sum, e) => sum + e.amount, 0);

//   function renderBudgetVsExpenses() {
//     return (
//       <div ref={contentRefs['budget']}>
//         <h2>Budget vs Expenses</h2>
//         <div className="budgets-grid">
//           {budgets.length === 0 ? (
//             <div style={{ textAlign: 'center', color: '#999' }}>No budgets set</div>
//           ) : (
//             budgets.map((b) => {
//               const spent = getSpent(
//                 b.category,
//                 b.startDate || b.start_date,
//                 b.endDate || b.end_date
//               );
//               const amount = b.budgetAmount || b.budget_amount;
//               const pct = Math.round((spent / amount) * 100);
//               const rem = amount - spent;
//               return (
//                 <div key={b.id} className="budget-card">
//                   <div className="budget-header">
//                     <h3 className="budget-title">{b.category}</h3>
//                     <span className={`budget-status status-${pct >= 100 ? 'exceeded' : pct >= 70 ? 'warning' : 'safe'}`}>{pct}%</span>
//                   </div>
//                   <div className="budget-info">
//                     <div className="budget-row"><span>Budget:</span> <strong>Rs. {amount.toLocaleString()}</strong></div>
//                     <div className="budget-row"><span>Spent:</span> <strong>Rs. {spent.toLocaleString()}</strong></div>
//                     <div className="budget-row"><span>Remaining:</span> <strong style={{ color: rem >= 0 ? "#27ae60" : "#dc3545" }}>Rs. {rem.toLocaleString()}</strong></div>
//                   </div>
//                   <div className="progress-section">
//                     <div className="progress-bar-bg">
//                       <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }}></div>
//                     </div>
//                     <div className="progress-text">
//                       <span>Period:</span>
//                       <span>{b.startDate || b.start_date} to {b.endDate || b.end_date}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     );
//   }

//   function renderCategoryBreakdown() {
//     const byCategory = {};
//     expenses.forEach(exp => {
//       const cat = exp.category || 'Other';
//       byCategory[cat] = (byCategory[cat] || 0) + exp.amount;
//     });
//     const categories = Object.keys(byCategory);
//     const amounts = Object.values(byCategory);
//     return (
//       <div ref={contentRefs['categories']}>
//         <h2>Expense Breakdown by Category</h2>
//         {categories.length === 0 ? (
//           <div style={{ textAlign: 'center', color: '#999' }}>No expenses to report</div>
//         ) : (
//           <>
//             <div style={{ display: 'flex', justifyContent: 'center', margin: '24px' }}>
//               <svg width="220" height="220" viewBox="0 0 220 220">
//                 {(() => {
//                   let total = amounts.reduce((a, b) => a + b, 0), prev = 0;
//                   return amounts.map((amt, idx) => {
//                     const r = 100, c = 110, colors = ['#667eea', '#23c6c8', '#f59e42', '#dc3545', '#4caf50', '#9c27b0', '#ff9800', '#009688', '#607d8b'];
//                     const len = amt / total * 2 * Math.PI;
//                     const arcStart = prev, arcEnd = prev + len;
//                     prev += len;
//                     const x1 = c + r * Math.sin(arcStart), y1 = c - r * Math.cos(arcStart);
//                     const x2 = c + r * Math.sin(arcEnd), y2 = c - r * Math.cos(arcEnd);
//                     const largeArc = len > Math.PI ? 1 : 0;
//                     return (
//                       <path
//                         key={categories[idx]}
//                         d={`M${c},${c} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
//                         fill={colors[idx % colors.length]}
//                         stroke="#fff"
//                         strokeWidth="2"
//                       />
//                     );
//                   });
//                 })()}
//               </svg>
//             </div>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
//               {categories.map((cat, idx) => (
//                 <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <div style={{
//                     width: 14, height: 14, borderRadius: 4,
//                     background: ['#667eea', '#23c6c8', '#f59e42', '#dc3545', '#4caf50', '#9c27b0', '#ff9800', '#009688', '#607d8b'][idx % 9]
//                   }} />
//                   <span>{cat}: Rs. {byCategory[cat].toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//             <table className="expenses-table" style={{ marginTop: 30, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
//               <thead>
//                 <tr>
//                   <th>Category</th>
//                   <th>Amount Spent (Rs.)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categories.map(cat => (
//                   <tr key={cat}>
//                     <td>{cat}</td>
//                     <td>Rs. {byCategory[cat].toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     );
//   }

//   function renderTrends() {
//     const byMonth = {};
//     expenses.forEach(exp => {
//       const d = new Date(exp.expenseDate || exp.expense_date);
//       const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
//       byMonth[m] = (byMonth[m] || 0) + exp.amount;
//     });
//     const months = Object.keys(byMonth).sort();
//     const values = months.map(month => byMonth[month]);
//     const maxAmt = Math.max(...values, 1);
//     return (
//       <div ref={contentRefs['trends']}>
//         <h2>Monthly Trends</h2>
//         {months.length === 0 ? (
//           <div style={{ textAlign: 'center', color: '#999' }}>No expenses for trends</div>
//         ) : (
//           <>
//             <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', minHeight: 200, margin: '24px 0', justifyContent: 'center' }}>
//               {months.map((month, idx) => (
//                 <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                   <div style={{
//                     background: '#667eea',
//                     width: '32px',
//                     height: `${150 * (byMonth[month] / maxAmt)}px`,
//                     borderRadius: '8px 8px 0 0',
//                     transition: 'height 0.3s'
//                   }} title={byMonth[month]}></div>
//                   <small style={{ marginTop: 8, color: '#555', letterSpacing: '0.5px' }}>{month}</small>
//                 </div>
//               ))}
//             </div>
//             <table className="expenses-table"
//               style={{ maxWidth: 480, margin: '20px auto' }}>
//               <thead>
//                 <tr>
//                   <th>Month</th>
//                   <th>Total Spent (Rs.)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {months.map(month => (
//                   <tr key={month}>
//                     <td>{month}</td>
//                     <td>Rs. {byMonth[month].toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     );
//   }

//   function renderTransactions() {
//     const filtered = expenses.filter(exp => {
//       const matchDesc = !transSearch || (exp.description || '').toLowerCase().includes(transSearch.toLowerCase());
//       const matchCat = !transCategory || exp.category === transCategory;
//       const d = new Date(exp.expenseDate || exp.expense_date);
//       const matchFrom = !transDateFrom || d >= new Date(transDateFrom);
//       const matchTo = !transDateTo || d <= new Date(transDateTo);
//       return matchDesc && matchCat && matchFrom && matchTo;
//     });
//     const allCategories = Array.from(new Set(expenses.map(x => x.category))).filter(Boolean);

//     function downloadCSV() {
//       const rows = [
//         ['Category', 'Amount', 'Date', 'Description'],
//         ...filtered.map(e => [e.category, e.amount, (e.expenseDate || e.expense_date), e.description])
//       ];
//       const csv = rows.map(r => r.map(v =>
//         `"${String(v).replace(/"/g, '""')}"`
//       ).join(',')).join('\n');
//       const blob = new Blob([csv], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url; link.download = 'expenses.csv';
//       document.body.appendChild(link);
//       link.click(); document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     }

//     return (
//       <div ref={contentRefs['transactions']}>
//         <h2>All Transactions</h2>
//         <div style={{ margin: '16px 0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
//           <input type="text" placeholder="Search description..." value={transSearch} onChange={e => setTransSearch(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }} />
//           <select value={transCategory} onChange={e => setTransCategory(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
//             <option value="">All Categories</option>
//             {allCategories.map(cat => <option value={cat} key={cat}>{cat}</option>)}
//           </select>
//           <input type="date" value={transDateFrom} onChange={e => setTransDateFrom(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }} />
//           <span>to</span>
//           <input type="date" value={transDateTo} onChange={e => setTransDateTo(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }} />
//           <button onClick={downloadCSV} className="add-budget-btn">Download CSV</button>
//         </div>
//         <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
//           <table className="expenses-table" style={{ minWidth: 500 }}>
//             <thead>
//               <tr>
//                 <th>Category</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//                 <th>Description</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>No matching records</td></tr>
//               ) : filtered.map(exp => (
//                 <tr key={exp.id}>
//                   <td>{exp.category}</td>
//                   <td>Rs. {exp.amount.toLocaleString()}</td>
//                   <td>{exp.expenseDate || exp.expense_date}</td>
//                   <td>{exp.description}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }

//   function renderSavingsProgress() {
//     return (
//       <div ref={contentRefs['savings']}>
//         <h2>Savings Progress</h2>
//         {savings.length === 0 ? (
//           <div style={{ textAlign: 'center', color: '#999' }}>No savings goals found.</div>
//         ) : (
//           <div className="budgets-grid">
//             {savings.map(goal => {
//               const target = goal.targetAmount || goal.target_amount;
//               const current = goal.currentAmount || goal.current_amount || 0;
//               const percent = Math.round((current / target) * 100);
//               const rem = target - current;
//               return (
//                 <div key={goal.id} className="budget-card">
//                   <div className="budget-header">
//                     <h3 className="budget-title">{goal.goalName || goal.goal_name}</h3>
//                     <span className={`budget-status ${percent >= 100 ? 'status-safe' : 'status-warning'}`}>{percent}%</span>
//                   </div>
//                   <div className="budget-info">
//                     <div className="budget-row"><span>Target:</span> <strong>Rs. {target.toLocaleString()}</strong></div>
//                     <div className="budget-row"><span>Saved:</span> <strong>Rs. {current.toLocaleString()}</strong></div>
//                     <div className="budget-row"><span>Remaining:</span>
//                       <strong style={{ color: rem > 0 ? '#dc3545' : '#27ae60' }}>
//                         Rs. {rem > 0 ? rem.toLocaleString() : 0}
//                       </strong>
//                     </div>
//                   </div>
//                   <div className="progress-section">
//                     <div className="progress-bar-bg">
//                       <div className="progress-bar-fill"
//                         style={{ width: `${Math.min(percent, 100)}%` }}></div>
//                     </div>
//                     <div className="progress-text">
//                       <span>Deadline</span>
//                       <span>{goal.deadline}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="budgets-wrapper">
//       <div className="budgets-header">
//         <h1>📊 Reports</h1>
//         <div className="header-actions">
//           <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
//         </div>
//       </div>
//       <div className="budgets-content">
//         <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
//           {reportTabs.map(tab => (
//             <button
//               key={tab.key}
//               className="add-budget-btn"
//               style={active === tab.key ? { background: '#667eea', color: 'white' } : {}}
//               onClick={() => setActive(tab.key)}
//             >{tab.label}</button>
//           ))}
//           <button className="add-budget-btn" onClick={handleExportPDF}>Download PDF</button>
//         </div>
//         <div>
//           {loading ? (
//             <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Loading...</div>
//           ) : active === 'budget' ? renderBudgetVsExpenses()
//             : active === 'categories' ? renderCategoryBreakdown()
//             : active === 'trends' ? renderTrends()
//             : active === 'transactions' ? renderTransactions()
//             : active === 'savings' ? renderSavingsProgress()
//             : null}
//         </div>
//       </div>
//     </div>
//   );
// }















import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/BudgetsStyles.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const features = [
  { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
  { icon: '📋', title: 'Expenses', path: '/expenses' },
  { icon: '📊', title: 'Analytics', path: '/reports' },
  { icon: '💰', title: 'Budgets', path: '/budgets' },
  { icon: '🎯', title: 'Savings Goals', path: '/savings' },
  { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
];

const reportTabs = [
  { key: 'budget', label: 'Budget vs Expenses' },
  { key: 'categories', label: 'Category Breakdown' },
  { key: 'trends', label: 'Monthly Trends' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'savings', label: 'Savings Progress' }
];

export default function Reports() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [active, setActive] = useState('budget');
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [transSearch, setTransSearch] = useState('');
  const [transCategory, setTransCategory] = useState('');
  const [transDateFrom, setTransDateFrom] = useState('');
  const [transDateTo, setTransDateTo] = useState('');

  const contentRefs = {
    budget: useRef(null),
    categories: useRef(null),
    trends: useRef(null),
    transactions: useRef(null),
    savings: useRef(null)
  };

  useEffect(() => {
    if (user) fetchData();
    // eslint-disable-next-line
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, expensesRes, savingsRes] = await Promise.all([
        api.get(`/budgets?userId=${user.id}`),
        api.get(`/expenses?userId=${user.id}`),
        api.get(`/savings?userId=${user.id}`)
      ]);
      setBudgets(budgetsRes.data || []);
      setExpenses(expensesRes.data || []);
      setSavings(savingsRes.data || []);
    } catch (err) {
      setBudgets([]); setExpenses([]); setSavings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const node = contentRefs[active]?.current;
    if (!node) return;
    const canvas = await html2canvas(node);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${active}_report.pdf`);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const getSpent = (category, startDate, endDate) =>
    expenses
      .filter(exp =>
        exp.category === category &&
        new Date(exp.expenseDate || exp.expense_date) >= new Date(startDate) &&
        new Date(exp.expenseDate || exp.expense_date) <= new Date(endDate)
      )
      .reduce((sum, e) => sum + e.amount, 0);

  function renderBudgetVsExpenses() {
    return (
      <div ref={contentRefs['budget']} className="analytics-table-scroll">
        <h2>Budget vs Expenses</h2>
        <div className="budgets-grid">
          {budgets.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999' }}>No budgets set</div>
          ) : (
            budgets.map((b) => {
              const spent = getSpent(
                b.category,
                b.startDate || b.start_date,
                b.endDate || b.end_date
              );
              const amount = b.budgetAmount || b.budget_amount;
              const pct = Math.round((spent / amount) * 100);
              const rem = amount - spent;
              return (
                <div key={b.id} className="budget-card">
                  <div className="budget-header">
                    <h3 className="budget-title">{b.category}</h3>
                    <span className={`budget-status status-${pct >= 100 ? 'exceeded' : pct >= 70 ? 'warning' : 'safe'}`}>{pct}%</span>
                  </div>
                  <div className="budget-info">
                    <div className="budget-row"><span>Budget:</span> <strong>Rs. {amount.toLocaleString()}</strong></div>
                    <div className="budget-row"><span>Spent:</span> <strong>Rs. {spent.toLocaleString()}</strong></div>
                    <div className="budget-row"><span>Remaining:</span> <strong style={{ color: rem >= 0 ? "#27ae60" : "#dc3545" }}>Rs. {rem.toLocaleString()}</strong></div>
                  </div>
                  <div className="progress-section">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                    </div>
                    <div className="progress-text">
                      <span>Period:</span>
                      <span>{b.startDate || b.start_date} to {b.endDate || b.end_date}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  function renderCategoryBreakdown() {
    const byCategory = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      byCategory[cat] = (byCategory[cat] || 0) + exp.amount;
    });
    const categories = Object.keys(byCategory);
    const amounts = Object.values(byCategory);
    return (
      <div ref={contentRefs['categories']} className="analytics-table-scroll">
        <h2>Expense Breakdown by Category</h2>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999' }}>No expenses to report</div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px' }}>
              <svg width="220" height="220" viewBox="0 0 220 220">
                {(() => {
                  let total = amounts.reduce((a, b) => a + b, 0), prev = 0;
                  return amounts.map((amt, idx) => {
                    const r = 100, c = 110, colors = ['#667eea', '#23c6c8', '#f59e42', '#dc3545', '#4caf50', '#9c27b0', '#ff9800', '#009688', '#607d8b'];
                    const len = amt / total * 2 * Math.PI;
                    const arcStart = prev, arcEnd = prev + len;
                    prev += len;
                    const x1 = c + r * Math.sin(arcStart), y1 = c - r * Math.cos(arcStart);
                    const x2 = c + r * Math.sin(arcEnd), y2 = c - r * Math.cos(arcEnd);
                    const largeArc = len > Math.PI ? 1 : 0;
                    return (
                      <path
                        key={categories[idx]}
                        d={`M${c},${c} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
                        fill={colors[idx % colors.length]}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  });
                })()}
              </svg>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
              {categories.map((cat, idx) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 4,
                    background: ['#667eea', '#23c6c8', '#f59e42', '#dc3545', '#4caf50', '#9c27b0', '#ff9800', '#009688', '#607d8b'][idx % 9]
                  }} />
                  <span>{cat}: Rs. {byCategory[cat].toLocaleString()}</span>
                </div>
              ))}
            </div>
            <table className="expenses-table" style={{ marginTop: 30, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount Spent (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat}>
                    <td>{cat}</td>
                    <td>Rs. {byCategory[cat].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }

  function renderTrends() {
    const byMonth = {};
    expenses.forEach(exp => {
      const d = new Date(exp.expenseDate || exp.expense_date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth[m] = (byMonth[m] || 0) + exp.amount;
    });
    const months = Object.keys(byMonth).sort();
    const values = months.map(month => byMonth[month]);
    const maxAmt = Math.max(...values, 1);
    return (
      <div ref={contentRefs['trends']} className="analytics-table-scroll">
        <h2>Monthly Trends</h2>
        {months.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999' }}>No expenses for trends</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', minHeight: 200, margin: '24px 0', justifyContent: 'center' }}>
              {months.map((month, idx) => (
                <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    background: '#667eea',
                    width: '32px',
                    height: `${150 * (byMonth[month] / maxAmt)}px`,
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.3s'
                  }} title={byMonth[month]}></div>
                  <small style={{ marginTop: 8, color: '#555', letterSpacing: '0.5px' }}>{month}</small>
                </div>
              ))}
            </div>
            <table className="expenses-table"
              style={{ maxWidth: 480, margin: '20px auto' }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Spent (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {months.map(month => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>Rs. {byMonth[month].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }

  function renderTransactions() {
    const filtered = expenses.filter(exp => {
      const matchDesc = !transSearch || (exp.description || '').toLowerCase().includes(transSearch.toLowerCase());
      const matchCat = !transCategory || exp.category === transCategory;
      const d = new Date(exp.expenseDate || exp.expense_date);
      const matchFrom = !transDateFrom || d >= new Date(transDateFrom);
      const matchTo = !transDateTo || d <= new Date(transDateTo);
      return matchDesc && matchCat && matchFrom && matchTo;
    });
    const allCategories = Array.from(new Set(expenses.map(x => x.category))).filter(Boolean);

    function downloadCSV() {
      const rows = [
        ['Category', 'Amount', 'Date', 'Description'],
        ...filtered.map(e => [e.category, e.amount, (e.expenseDate || e.expense_date), e.description])
      ];
      const csv = rows.map(r => r.map(v =>
        `"${String(v).replace(/"/g, '""')}"`
      ).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'expenses.csv';
      document.body.appendChild(link);
      link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return (
      <div ref={contentRefs['transactions']} className="analytics-table-scroll">
        <h2>All Transactions</h2>
        <div style={{ margin: '16px 0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <input type="text" placeholder="Search description..." value={transSearch} onChange={e => setTransSearch(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }} />
          <select value={transCategory} onChange={e => setTransCategory(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">All Categories</option>
            {allCategories.map(cat => <option value={cat} key={cat}>{cat}</option>)}
          </select>
          <input type="date" value={transDateFrom} onChange={e => setTransDateFrom(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }} />
          <span>to</span>
          <input type="date" value={transDateTo} onChange={e => setTransDateTo(e.target.value)} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }} />
          <button onClick={downloadCSV} className="add-budget-btn">Download CSV</button>
        </div>
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table className="expenses-table" style={{ minWidth: 500 }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>No matching records</td></tr>
              ) : filtered.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.category}</td>
                  <td>Rs. {exp.amount.toLocaleString()}</td>
                  <td>{exp.expenseDate || exp.expense_date}</td>
                  <td>{exp.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderSavingsProgress() {
    return (
      <div ref={contentRefs['savings']} className="analytics-table-scroll">
        <h2>Savings Progress</h2>
        {savings.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999' }}>No savings goals found.</div>
        ) : (
          <div className="budgets-grid">
            {savings.map(goal => {
              const target = goal.targetAmount || goal.target_amount;
              const current = goal.currentAmount || goal.current_amount || 0;
              const percent = Math.round((current / target) * 100);
              const rem = target - current;
              return (
                <div key={goal.id} className="budget-card">
                  <div className="budget-header">
                    <h3 className="budget-title">{goal.goalName || goal.goal_name}</h3>
                    <span className={`budget-status ${percent >= 100 ? 'status-safe' : 'status-warning'}`}>{percent}%</span>
                  </div>
                  <div className="budget-info">
                    <div className="budget-row"><span>Target:</span> <strong>Rs. {target.toLocaleString()}</strong></div>
                    <div className="budget-row"><span>Saved:</span> <strong>Rs. {current.toLocaleString()}</strong></div>
                    <div className="budget-row"><span>Remaining:</span>
                      <strong style={{ color: rem > 0 ? '#dc3545' : '#27ae60' }}>
                        Rs. {rem > 0 ? rem.toLocaleString() : 0}
                      </strong>
                    </div>
                  </div>
                  <div className="progress-section">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill"
                        style={{ width: `${Math.min(percent, 100)}%` }}></div>
                    </div>
                    <div className="progress-text">
                      <span>Deadline</span>
                      <span>{goal.deadline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-outer">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo"><span>💸</span></div>
        <nav className="sidebar-menu">
          {features.map(f => (
            <div
              className={'menu-item' + (window.location.pathname === f.path ? ' active' : '')}
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

      <main className="dashboard-main reports-main">
    
        <div className="budgets-header">
          <h1>📊 Analytics</h1>
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          </div>
        </div>
        <div className="budgets-content">
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            {reportTabs.map(tab => (
              <button
                key={tab.key}
                className="add-budget-btn"
                style={active === tab.key ? { background: '#667eea', color: 'white' } : {}}
                onClick={() => setActive(tab.key)}
              >{tab.label}</button>
            ))}
            <button className="add-budget-btn" onClick={handleExportPDF}>Download PDF</button>
          </div>
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Loading...</div>
            ) : active === 'budget' ? renderBudgetVsExpenses()
              : active === 'categories' ? renderCategoryBreakdown()
              : active === 'trends' ? renderTrends()
              : active === 'transactions' ? renderTransactions()
              : active === 'savings' ? renderSavingsProgress()
              : null}
          </div>
        </div>
      </main>
    </div>
  );
}

