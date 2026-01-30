import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Savings from './pages/Savings';
import Reports from './pages/Reports';
import Sync from './pages/Sync';
import OracleReports from './pages/OracleReports';










function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />

      {/* Default Route */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />

      <Route path="/expenses" element={user ? <Expenses /> : <Navigate to="/login" />} />

      <Route path="/budgets" element={user ? <Budgets /> : <Navigate to="/login" />} />

      <Route path="/savings" element={user ? <Savings /> : <Navigate to="/login" />} />

      <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />

      <Route path="/sync" element={user ? <Sync /> : <Navigate to="/login" />} />

      <Route path="/oracle-reports" element={user ? <OracleReports /> : <Navigate to="/login" />} />

   


    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
