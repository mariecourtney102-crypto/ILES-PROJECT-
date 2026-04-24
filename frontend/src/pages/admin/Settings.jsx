import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Users', path: '/admin/users', icon: '👥' },
  { name: 'Opportunities', path: '/admin/opportunities', icon: '🎯' },
  { name: 'Feedback', path: '/admin/feedback', icon: '💬' },
  { name: 'Reports', path: '/admin/reports', icon: '📈' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const handleLogout = () => {
    // Replace with your actual logout logic
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - White with Teal accent */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-teal-600">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content - White background */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}