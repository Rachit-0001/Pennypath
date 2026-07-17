import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdAdd, MdClose } from 'react-icons/md';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', currency: user?.currency || 'INR' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const [newCategory, setNewCategory] = useState({ type: 'expense', name: '' });
  const [savingCategory, setSavingCategory] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authService.updateProfile(profileForm);
      updateUser(res.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    setSavingCategory(true);
    try {
      const res = await authService.addCategory(newCategory);
      updateUser({ categories: res.categories });
      toast.success('Category added');
      setNewCategory({ ...newCategory, name: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (type, name) => {
    try {
      const res = await authService.deleteCategory(type, name);
      updateUser({ categories: res.categories });
      toast.success('Category removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-sm text-gray-500">Manage your account details and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Info */}
        <form onSubmit={handleProfileSubmit} className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
          <div>
            <label className="label">Full Name</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input value={user?.email || ''} disabled className="input-field bg-gray-50 text-gray-400" />
          </div>
          <div>
            <label className="label">Preferred Currency</label>
            <select
              value={profileForm.currency}
              onChange={(e) => setProfileForm((f) => ({ ...f, currency: e.target.value }))}
              className="input-field"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordSubmit} className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Categories management */}
      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Manage Categories</h2>

        <form onSubmit={handleAddCategory} className="mb-6 flex flex-col gap-3 sm:flex-row">
          <select
            value={newCategory.type}
            onChange={(e) => setNewCategory((c) => ({ ...c, type: e.target.value }))}
            className="input-field sm:w-40"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            value={newCategory.name}
            onChange={(e) => setNewCategory((c) => ({ ...c, name: e.target.value }))}
            placeholder="New category name"
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary" disabled={savingCategory}>
            <MdAdd size={18} /> Add
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Expense Categories</h3>
            <div className="flex flex-wrap gap-2">
              {(user?.categories?.expense || []).map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {c}
                  <button onClick={() => handleDeleteCategory('expense', c)} className="text-gray-400 hover:text-danger-600">
                    <MdClose size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Income Categories</h3>
            <div className="flex flex-wrap gap-2">
              {(user?.categories?.income || []).map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {c}
                  <button onClick={() => handleDeleteCategory('income', c)} className="text-gray-400 hover:text-danger-600">
                    <MdClose size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
