import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  FolderOpen,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  PanelRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/business' },
  { name: 'Campaigns', icon: Megaphone, path: '/business/campaigns' },
  { name: 'Creators', icon: Users, path: '/business/creators' },
  { name: 'Assets', icon: FolderOpen, path: '/business/assets' },
  { name: 'Analytics', icon: BarChart3, path: '/business/analytics' },
  { name: 'Payments', icon: CreditCard, path: '/business/payments' },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-2xs">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span
            className="text-2xl font-extrabold 
          bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 
          bg-clip-text text-transparent"
          >
            CreatorStop
          </span>

          <PanelRight className="w-5 h-5 cursor-pointer" />
        </div>
      </div>


      {/* Main Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
          Main Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/business'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-gray-50 text-gray-700 shadow-2xs border-l-2 rounded-br-xl rounded-tr-xl'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Settings - Separated */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <NavLink
            to="/business/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-gray-50 text-gray-600 shadow-2xs border-l-2 rounded-br-xl rounded-tr-xl'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
