import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { FaChartPie, FaList, FaUsers, FaBoxOpen, FaSignOutAlt, FaHome, FaThList } from 'react-icons/fa';

const AdminLayout = () => {
  const activeClass = "flex items-center gap-3 px-4 py-3 bg-primary-dark text-white font-bold rounded-lg transition-all shadow-sm";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 text-primary-dark hover:bg-primary-dark/60 hover:text-white rounded-lg transition-all";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-bg to-primary-light p-6 flex flex-col shadow-2xl sticky top-0 h-screen">
        <div className="mb-8 flex items-center gap-2">
           <img src="/TradeBidz.png" alt="Logo"/>
        </div>

        <nav className="space-y-2 text-sm flex-1">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaChartPie /> Dashboard
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaThList /> Categories
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaUsers /> Users & Requests
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <FaBoxOpen /> Products
          </NavLink>
        </nav>

        <div className="border-t border-gray-400 pt-4 space-y-2">
            <Link to="/" className={inactiveClass}>
                <FaHome /> Back to Home
            </Link>
            <button 
              onClick={handleLogout} 
              className={`${inactiveClass} w-full font-bold text-left text-red-500 hover:text-white hover:bg-red-500`}
            >
                <FaSignOutAlt /> Logout
            </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen bg-bg">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;