import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaSearch, FaUserCircle, FaGavel, FaHeart, FaBoxOpen } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);
  
  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Menu Items Config based on Role
  const renderNavLinks = () => {
    if (!isAuthenticated) return null;

    // Menu for Bidder
    if (user.role === 'BIDDER') {
      return (
        <>
          <Link to="/watchlist" className="nav-link flex items-center gap-1 hover:text-primary">Watchlist</Link>
          <Link to="/bidding" className="nav-link flex items-center gap-1 hover:text-primary">Bidding</Link>
          <Link to="/won-products" className="nav-link flex items-center gap-1 hover:text-primary">Won products</Link>
        </>
      );
    }

    // Menu for Seller (including Bidder functionality if wanted, or separate)
    if (user.role === 'SELLER') {
      return (
        <>
          <Link to="/post-product" className="nav-link font-semibold text-secondary hover:text-primary">Post product</Link>
          <Link to="/my-products" className="nav-link hover:text-primary">My products</Link>
          <Link to="/bidding" className="nav-link hover:text-primary">My bidding</Link>
        </>
      );
    }

    // Menu for Admin
    if (user.role === 'ADMIN') {
      return (
        <>
          <Link to="/admin" className="nav-link hover:text-primary font-bold text-primary-dark">Dashboard</Link>
          {/* <Link to="/admin/users" className="nav-link hover:text-primary">Users</Link>
          <Link to="/admin/products" className="nav-link hover:text-primary">Products</Link> */}
        </>
      );
    }
  };

  return (
    <header className="bg-gradient-to-br from-bg to-primary-light min-w-full shadow-md sticky top-0 py-1 z-50">
      <div className="container min-w-full mx-auto px-4 h-16 flex items-center">

        {/* Logo */}
        <Link to="/" className="flex h-full items-center">
          <img 
            src="/TradeBid_honrizontal.png"
            alt="TradeBidz Logo"
            className="h-full w-auto object-contain drop-shadow-2xl hover:scale-105 duration-300"
          />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8 relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:border-primary bg-neutral-light"
          />
          <button className="absolute right-3 top-2.5 text-text-light hover:text-primary">
            <FaSearch />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/products" className="hover:text-primary">Category</Link>

          {/* Role-based menu */}
          {renderNavLinks()}

          {/* Auth Buttons / Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:text-primary"
              >
                <FaUserCircle className="text-2xl text-gray-400" />
                <span className="max-w-[100px] truncate">{user.name || user.email}</span>
              </button>

              {isDropdownOpen && (
                <div 
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg fade-in-reverse"
                >
                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-primary-dark/60 hover:text-white rounded-lg transition-all"
                  >
                    Profile
                  </Link>

                  {user.role === "BIDDER" && (
                    <Link 
                      to="/upgrade" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-secondary hover:bg-primary-dark/60 hover:text-white rounded-lg transition-all"
                    >
                      Upgrade to Seller
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-red-500 hover:text-white hover:bg-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 font-semibold bg-primary text-white hover:bg-primary-dark/60 rounded-md transition"
              >
                Login
              </Link>
              
              <Link
                to="/register"
                className="px-4 py-2 font-semibold bg-primary-dark text-white rounded-md hover:bg-primary-dark/60 transition shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;