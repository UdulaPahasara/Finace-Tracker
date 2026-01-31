import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed
import '../styles/OracleReports.css';
import '../styles/Dashboard.css'; // Reuse global dashboard/sidebar styles
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const features = [
  { icon: '🏠', title: 'Dashboard', path: '/dashboard' },
  { icon: '📋', title: 'Expenses', path: '/expenses' },
  { icon: '💰', title: 'Budgets', path: '/budgets' },
  { icon: '🎯', title: 'Savings Goals', path: '/savings' },
  { icon: '📊', title: 'Analytics', path: '/reports' }, // <- update here
  { icon: '🗃️', title: 'Oracle Reports', path: '/oracle-reports' }
];


const reportTabs = [
  { key: 'monthly', label: 'Monthly Expenditure' },
  { key: 'budget', label: 'Budget Adherence' },
  { key: 'savings', label: 'Savings Progress' },
  { key: 'distribution', label: 'Expense Distribution' },
  { key: 'trends', label: 'Expense Trends' }
];

const BACKEND = 'http://localhost:8083/api/reports';

export default function OracleReports() {
  const { user, logout } = useContext(AuthContext);
  const [active, setActive] = useState('monthly');
  const [navigate] = useState(() => path => window.location.href = path); // Simple nav for non-router pages

  const currentPath = window.location.pathname;

  if (!user) {
    return null;
  }

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

      {/* Main */}
      <main className="dashboard-main">
      

        {/* Header actions */}
        <div className="budgets-header">
          <h1>Oracle Financial Reports</h1>
          <div style={{ height: 36 }} />
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
          </div>
          <div>
            {active === 'monthly' && <MonthlyExpenditureReport />}
            {active === 'budget' && <BudgetAdherenceReport />}
            {active === 'savings' && <SavingsProgressReport />}
            {active === 'distribution' && <ExpenseDistributionReport />}
            {active === 'trends' && <ExpenseTrendsReport />}
          </div>
        </div>
      </main>
    </div>
  );
}


function MonthlyExpenditureReport() {
  const { user } = useContext(AuthContext);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (!user || !month) return;
    setLoading(true); setRows([]);
    fetch(`${BACKEND}/monthly-expenditure-cursor?userId=${user.id}&month=${month}`)
      .then(res => res.json())
      .then(lines => setRows(lines.map(parseMonthlyExpenditureLine)))
      .finally(() => setLoading(false));
  }, [user, month]);

  // Bar chart data
  const chartData = {
    labels: rows.map(row => row.category),
    datasets: [
      {
        label: "Total Spend",
        data: rows.map(row => parseFloat(row.total)),
        backgroundColor: "#667eea"
      }
    ]
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Spend by Category" }
    },
    scales: {
      x: { title: { display: true, text: "Rs." } },
      y: { title: { display: false } }
    }
  };

  return (
    <div>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "16px",
          minWidth: "0",
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        <div style={{ flexShrink: 0, fontWeight: 700, fontSize: "1.35rem" }}>
          Monthly Expenditure Report
        </div>
        <label
          className="month-select-label"
          style={{
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            fontWeight: 500
          }}
        >
          Select Month:
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="month-select-input"
            style={{ minWidth: 130 }}
          />
        </label>
        <button
          onClick={() => setShowChart((c) => !c)}
          className="add-budget-btn"
          style={{ flexShrink: 0, whiteSpace: "nowrap", minWidth: 90 }}
        >
          {showChart ? "Hide Chart" : "View Chart"}
        </button>
      </div>
      {showChart && (
        <div className="trend-chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      <div className="analytics-table-scroll">
        <table className="oracle-report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Amount</th>
              <th>Transaction Count</th>
              <th>Average Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.category}</td>
                <td>{r.total}</td>
                <td>{r.count}</td>
                <td>{r.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function BudgetAdherenceReport() {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true); setRows([]);
    fetch(`${BACKEND}/budget-adherence-cursor?userId=${user.id}`)
      .then(res => res.json())
      .then(lines => setRows(lines.map(parseBudgetAdherenceLine)))
      .finally(() => setLoading(false));
  }, [user]);

  // Bar chart data: % Used per category
  const chartData = {
    labels: rows.map(r => r.category),
    datasets: [
      {
        label: "% Used",
        data: rows.map(r => parseFloat(r.pct)),
        backgroundColor: rows.map(r =>
          parseFloat(r.pct) >= 100
            ? "#dc3545" // Red for exceeded
            : parseFloat(r.pct) >= 70
            ? "#f59e42" // Orange for warning
            : "#4caf50" // Green for safe
        )
      }
    ]
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Budget Usage by Category (%)" }
    },
    scales: {
      x: {
        title: { display: true, text: "% Used" },
        min: 0,
        max: 120 // Allows bars to show overflow
      },
      y: { title: { display: false } }
    }
  };

  return (
    <div>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "8px", // Set small bottom margin for a tight gap to next element
          marginTop: 0 // force no top margin here
        }}
      >
        <h3 className="oracle-report-title" style={{ marginBottom: 0, marginTop: 0 }}>
          Budget Adherence Report
        </h3>
        <button
          onClick={() => setShowChart((x) => !x)}
          className="add-budget-btn"
        >
          {showChart ? "Hide Chart" : "View Chart"}
        </button>
      </div>
      {showChart && (
        <div className="trend-chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      <div className="analytics-table-scroll">
        <table className="oracle-report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budgeted</th>
              <th>Actual Spent</th>
              <th>% Used</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.category}</td>
                <td>{r.budget}</td>
                <td>{r.actual}</td>
                <td>{r.pct}</td>
                <td>{r.remaining}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SavingsProgressReport() {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true); setRows([]);
    fetch(`${BACKEND}/savings-progress-cursor?userId=${user.id}`)
      .then(res => res.json())
      .then(lines => setRows(lines.map(parseSavingsProgressLine)))
      .finally(() => setLoading(false));
  }, [user]);

  // Bar chart: Progress % per savings goal
  const chartData = {
    labels: rows.map(r => r.goal),
    datasets: [
      {
        label: "Progress %",
        data: rows.map(r => parseFloat(r.progress)),
        backgroundColor: "#23c6c8"
      }
    ]
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Savings Progress by Goal (%)" }
    },
    scales: {
      x: {
        title: { display: true, text: "Progress (%)" },
        min: 0,
        max: 100
      },
      y: { title: { display: false } }
    }
  };

  return (
    <div>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "8px", // tight gap after header row
          marginTop: 0
        }}
      >
        <h3 className="oracle-report-title" style={{ marginBottom: 0, marginTop: 0 }}>
          Savings Progress Report
        </h3>
        <button
          onClick={() => setShowChart((x) => !x)}
          className="add-budget-btn"
        >
          {showChart ? "Hide Chart" : "View Chart"}
        </button>
      </div>
      {showChart && (
        <div className="trend-chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      <div className="analytics-table-scroll">
        <table className="oracle-report-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Target Amount</th>
              <th>Current Amount</th>
              <th>Progress %</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.goal}</td>
                <td>{r.target}</td>
                <td>{r.current}</td>
                <td>{r.progress}</td>
                <td>{r.remaining}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function ExpenseDistributionReport() {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true); setRows([]);
    fetch(`${BACKEND}/expense-distribution-cursor?userId=${user.id}`)
      .then(res => res.json())
      .then(lines => setRows(lines.map(parseExpenseDistributionLine)))
      .finally(() => setLoading(false));
  }, [user]);

  // Prep Bar Chart data (category totals)
  const chartData = {
    labels: rows.map(row => row.category),
    datasets: [
      {
        label: "Total Spent",
        data: rows.map(row => parseFloat(row.total)),
        backgroundColor: "#6366f1"
      }
    ]
  };

  const chartOptions = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Expense Distribution by Category" }
    },
    scales: {
      x: { title: { display: true, text: "Rs." } },
      y: { title: { display: false } }
    }
  };

  return (
    <div>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "8px", // tight gap after header row
          marginTop: 0
        }}
      >
        <h3 className="oracle-report-title" style={{ marginBottom: 0, marginTop: 0 }}>
          Expense Distribution Report
        </h3>
        <button
          onClick={() => setShowChart((x) => !x)}
          className="add-budget-btn"
        >
          {showChart ? "Hide Chart" : "View Chart"}
        </button>
      </div>
      {showChart && (
        <div className="trend-chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      <div className="analytics-table-scroll">
        <table className="oracle-report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
              <th>Transaction Count</th>
              <th>Average</th>
              <th>Max</th>
              <th>Min</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.category}</td>
                <td>{r.total}</td>
                <td>{r.count}</td>
                <td>{r.avg}</td>
                <td>{r.max}</td>
                <td>{r.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function ExpenseTrendsReport() {
  const { user } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true); setRows([]);
    fetch(`${BACKEND}/expense-trends-cursor?userId=${user.id}`)
      .then(res => res.json())
      .then(lines => setRows(lines.map(parseExpenseTrendsLine)))
      .finally(() => setLoading(false));
  }, [user]);

  // Prepare chart data
  const chartData = {
    labels: rows.map((r) => r.date),
    datasets: [
      {
        label: "Daily Total",
        data: rows.map((r) => parseFloat(r.dailyTotal)),
        backgroundColor: "#6366f1",
        borderColor: "#6366f1",
        fill: false,
        tension: 0.22
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Expense Trend (Line Chart)" }
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Total" } }
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "8px",
          marginTop: 0
        }}
      >
        <h3 className="oracle-report-title" style={{ marginBottom: 0, marginTop: 0 }}>
          Expense Trends Report
        </h3>
        <button
          onClick={() => setShowChart((c) => !c)}
          className="add-budget-btn"
        >
          {showChart ? "Hide Chart" : "View Chart"}
        </button>
      </div>
      {showChart && (
        <div className="trend-chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      <div className="analytics-table-scroll">
        <table className="oracle-report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Daily Total</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.dailyTotal}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --------- Parsers (same as before) --------------
function parseMonthlyExpenditureLine(line) {
  const m = line.match(/Category: (.*?) \| Total: (.*?) \| Count: (.*?) \| Avg: (.*)/);
  return m ? { category: m[1], total: m[2], count: m[3], avg: m[4] } : {};
}
function parseBudgetAdherenceLine(line) {
  const m = line.match(/Category: (.*?) \| Budget: (.*?) \| Spent: (.*?) \| Used: (.*?)% \| Remaining: (.*?) \| Status: (.*)/);
  return m ? { category: m[1], budget: m[2], actual: m[3], pct: m[4], remaining: m[5], status: m[6] } : {};
}
function parseSavingsProgressLine(line) {
  const m = line.match(/Goal: (.*?) \| Target: (.*?) \| Current: (.*?) \| Progress: (.*?)% \| Remaining: (.*?) \| Status: (.*)/);
  return m ? { goal: m[1], target: m[2], current: m[3], progress: m[4], remaining: m[5], status: m[6] } : {};
}
function parseExpenseDistributionLine(line) {
  const m = line.match(/Category: (.*?) \| Total: (.*?) \| Count: (.*?) \| Avg: (.*?) \| Max: (.*?) \| Min: (.*)/);
  return m ? { category: m[1], total: m[2], count: m[3], avg: m[4], max: m[5], min: m[6] } : {};
}
function parseExpenseTrendsLine(line) {
  const m = line.match(/Date: (.*?) \| Daily Total: (.*?) \| Transactions: (.*)/);
  return m ? { date: m[1], dailyTotal: m[2], count: m[3] } : {};
}

















