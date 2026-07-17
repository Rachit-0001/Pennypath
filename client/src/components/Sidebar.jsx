import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdAttachMoney,
  MdSavings,
  MdBarChart,
  MdPerson,
  MdClose,
} from 'react-icons/md';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/expenses', label: 'Expenses', icon: MdReceiptLong },
  { to: '/income', label: 'Income', icon: MdAttachMoney },
  { to: '/budget', label: 'Budget', icon: MdSavings },
  { to: '/reports', label: 'Reports', icon: MdBarChart },
  { to: '/profile', label: 'Profile', icon: MdPerson },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-gray-100 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
              P
            </div>
            <span className="text-lg font-bold text-gray-900">PennyPath</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <MdClose size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 text-xs text-gray-400">
          PennyPath v1.0 &copy; {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
