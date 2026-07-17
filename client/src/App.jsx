import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontSize: '14px', borderRadius: '10px' },
          success: { iconTheme: { primary: '#22a866', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes share the dashboard Layout (sidebar + navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;
