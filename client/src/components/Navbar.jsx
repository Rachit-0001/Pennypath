import { MdMenu, MdLogout, MdPerson } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 lg:px-8">
      <button onClick={onMenuClick} className="text-gray-600 lg:hidden">
        <MdMenu size={24} />
      </button>

      <div className="hidden lg:block">
        <h1 className="text-sm font-medium text-gray-500">
          Welcome back, <span className="font-semibold text-gray-900">{user?.name?.split(' ')[0]}</span>
        </h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{user?.name}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate('/profile');
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <MdPerson size={18} /> Profile
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-gray-50"
            >
              <MdLogout size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
