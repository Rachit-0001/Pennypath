import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white">
            P
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your PennyPath account</h1>
          <p className="mt-1 text-sm text-gray-500">Start tracking expenses and building better habits</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="input-field"
            />
            {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field"
            />
            {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="input-field"
            />
            {errors.password && <p className="mt-1 text-xs text-danger-600">{errors.password}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="input-field"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-danger-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
