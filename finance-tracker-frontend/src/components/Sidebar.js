import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/expenses', icon: '💰', label: 'Expenses' },
    { path: '/budgets', icon: '📋', label: 'Budgets' },
    { path: '/savings', icon: '🎯', label: 'Savings' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/sync', icon: '🔄', label: 'Sync Data' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">💰 Finance</div>
      <nav>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`${isActive(item.path)}`}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
