import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

// Chart.js imports and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  ChartDataLabels
);

const BACKEND = 'http://localhost:8083/api/reports';

const features = [
  { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
  { icon: '📋', title: 'Expenses', path: '/expenses' },
  { icon: '💰', title: 'Budgets', path: '/budgets' },
  { icon: '🎯', title: 'Savings Goals', path: '/savings' },
  { icon: '📊', title: 'Analytics', path: '/reports' }, // <- update here
  { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
];


function formatRs(amount) {
  return 'Rs. ' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [monthly, setMonthly] = useState([]);
  const [trend, setTrend] = useState([]);
  const [budget, setBudget] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sidebar highlight logic
  const currentPath = window.location.pathname;
  const navigate = (path) => window.location.href = path;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    Promise.all([
      fetch(`${BACKEND}/monthly-expenditure-cursor?userId=${user.id}&month=${monthStr}`)
        .then(res => res.json())
        .then(lines => lines.map(parseMonthlyLine)),
      fetch(`${BACKEND}/expense-trends-cursor?userId=${user.id}`)
        .then(res => res.json())
        .then(lines => lines.map(parseTrendLine)),
      fetch(`${BACKEND}/budget-adherence-cursor?userId=${user.id}`)
        .then(res => res.json())
        .then(lines => lines.map(parseBudgetLine)),
      fetch(`${BACKEND}/savings-progress-cursor?userId=${user.id}`)
        .then(res => res.json())
        .then(lines => lines.map(parseSavingsLine)),
    ]).then(([monthly, trend, budget, savings]) => {
      setMonthly(monthly);
      setTrend(trend);
      setBudget(budget);
      setSavings(savings);
      setLoading(false);
    });
  }, [user]);

  const totalSpent = monthly.reduce((sum, row) => sum + parseFloat(row.total || 0), 0);
  const maxCategory = monthly.reduce((max, row) =>
    (parseFloat(row.total) > parseFloat(max.total || 0) ? row : max), { category: '', total: 0 });
  const budgetUsed = budget.length
    ? (budget.reduce((sum, b) => sum + parseFloat(b.pct || 0), 0) / budget.length)
    : 0;
  const savingsProgress = savings.length
    ? (savings.reduce((sum, s) => sum + parseFloat(s.progress || 0), 0) / savings.length)
    : 0;

  // Charts
  const barChart = {
    labels: monthly.map(x => x.category),
    datasets: [{
      label: 'Total by Category (' + new Date().toLocaleString('default', {month: 'long'}) + ')',
      data: monthly.map(x => parseFloat(x.total)),
      backgroundColor: [
        '#6366f1', '#818cf8', '#60a5fa', '#fbbf24', '#34d399', '#f472b6', '#a78bfa', '#f87171'
      ],
    }]
  };
  const barOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'right',
        formatter: (value) => formatRs(value),
        color: '#4941a6',
        font: { weight: 'bold' }
      },
      title: { display: true, text: "Monthly Category Spending" }
    },
    responsive: true,
    scales: {
      x: { grid: {color: '#eef2fd'}, ticks: { callback: v => formatRs(v) } },
      y: { grid: { display: false }, },
    }
  };

  const pieChart = {
    labels: monthly.map(x => x.category),
    datasets: [{
      label: 'Category Share',
      data: monthly.map(x => parseFloat(x.total)),
      backgroundColor: [
        '#6366f1', '#818cf8', '#60a5fa', '#fbbf24', '#34d399', '#f472b6', '#a78bfa', '#f87171'
      ],
      borderWidth: 1,
    }]
  };
  const pieOptions = {
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        formatter: (value, ctx) => formatRs(value),
        color: '#4941a6',
        font: { weight: 'bold' }
      },
      title: { display: true, text: "Expense Distribution (Pie)" }
    }
  };

  if (!user) return null;

  return (
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
      {/* Main Area */}
      <main className="dashboard-main">
        {/* TopNav with tight header and divider */}
        <header className="dashboard-topnav unified-header">
  <div className="topnav-left">
    <h1>Personal Finance Management</h1>
  </div>
  <div className="topnav-right">
    <div className="topnav-profile">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=60`}
        alt="avatar"
        className="user-avatar"
      />
      <span className="user-hello">Hi, <strong>{user.name}</strong> 👋</span>
    </div>
  </div>
</header>
        {loading ? (
          <div style={{ padding: 25, fontSize: '1.2rem', opacity: 0.7 }}>Loading analytics...</div>
        ) : (
          <>
            <section className="dashboard-kpis">
              <div className="kpi-card">
                <div className="kpi-label">Total Spent (This Month)</div>
                <div className="kpi-value">{formatRs(totalSpent)}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Top Category</div>
                <div className="kpi-value">{maxCategory.category || "-"}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Budget Used</div>
                <div className="kpi-value">{budgetUsed.toFixed(1)}%</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Savings Progress</div>
                <div className="kpi-value">{savingsProgress.toFixed(1)}%</div>
              </div>
            </section>
            <section className="dashboard-charts-grid">
              <div className="chart-container">
                <Bar data={barChart} options={barOptions} plugins={[ChartDataLabels]} />
              </div>
              <div className="chart-container">
                <Pie data={pieChart} options={pieOptions} plugins={[ChartDataLabels]} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// Parsing helpers
function parseMonthlyLine(line) {
  const m = line.match(/Category: (.*?) \| Total: (.*?) \| Count: (.*?) \| Avg: (.*)/);
  return m ? { category: m[1], total: m[2], count: m[3], avg: m[4] } : {};
}
function parseTrendLine(line) {
  const m = line.match(/Date: (.*?) \| Daily Total: (.*?) \| Transactions: (.*)/);
  return m ? { date: m[1], dailyTotal: m[2], count: m[3] } : {};
}
function parseBudgetLine(line) {
  const m = line.match(/Category: (.*?) \| Budget: (.*?) \| Spent: (.*?) \| Used: (.*?)% \| Remaining: (.*?) \| Status: (.*)/);
  return m ? { category: m[1], budget: m[2], actual: m[3], pct: m[4], remaining: m[5], status: m[6] } : {};
}
function parseSavingsLine(line) {
  const m = line.match(/Goal: (.*?) \| Target: (.*?) \| Current: (.*?) \| Progress: (.*?)% \| Remaining: (.*?) \| Status: (.*)/);
  return m ? { goal: m[1], target: m[2], current: m[3], progress: m[4], remaining: m[5], status: m[6] } : {};
}
