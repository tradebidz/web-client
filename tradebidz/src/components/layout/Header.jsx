import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { setWatchlist } from '../../redux/slices/watchlistSlice';
// Thêm FaTimes để làm nút Clear
import { FaSearch, FaUserCircle, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

import { getCategories } from '../../services/productService';
import { getMyWatchlist } from '../../services/userService';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch Watchlist on mount/login
  useEffect(() => {
    if (isAuthenticated) {
      const fetchWatchlist = async () => {
        try {
          const data = await getMyWatchlist();
          dispatch(setWatchlist(data));
        } catch (error) {
          console.error('Failed to fetch watchlist', error);
        }
      };
      fetchWatchlist();
    }
  }, [isAuthenticated, dispatch]);

  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const dropdownRef = useRef(null);
  const catMenuRef = useRef(null);
  const searchInputRef = useRef(null); // Ref để focus lại input sau khi clear

  // Search State
  const [searchKeyword, setSearchKeyword] = useState('');

  // Category Expand State
  const [expandedCats, setExpandedCats] = useState({});
  const toggleCat = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    fetchCats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setShowCatMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = () => {
    // Luôn navigate kể cả khi rỗng (để reset về trang products gốc nếu muốn)
    if (searchKeyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderNavLinks = () => {
    if (!isAuthenticated) return null;
    if (user.role === 'BIDDER') {
      return (
        <>
          <Link to="/watchlist" className="nav-link hover:text-primary">Yêu thích</Link>
          <Link to="/bidding" className="nav-link hover:text-primary">Đang đấu giá</Link>
          <Link to="/won-products" className="nav-link hover:text-primary">Đã thắng</Link>
          <Link to="/orders" className="nav-link hover:text-primary">Đơn hàng</Link>
        </>
      );
    }
    if (user.role === 'SELLER') {
      return (
        <>
          <Link to="/my-products" className="nav-link font-semibold text-secondary hover:text-primary">Sản phẩm của tôi</Link>
          <Link to="/watchlist" className="nav-link hover:text-primary">Yêu thích</Link>
          <Link to="/bidding" className="nav-link hover:text-primary">Đang đấu giá</Link>
          <Link to="/won-products" className="nav-link hover:text-primary">Đã thắng</Link>
          <Link to="/orders" className="nav-link hover:text-primary">Đơn hàng</Link>
        </>
      );
    }
    if (user.role === 'ADMIN') {
      return (
        <Link to="/admin" className="nav-link hover:text-primary font-bold text-primary-dark">Quản trị</Link>
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

        {/* Search Bar - Đã cập nhật nút Clear */}
        <div className="hidden md:flex flex-1 mx-8 relative group">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-neutral-light transition-all"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Nút X: Chỉ hiện khi có text */}
            {searchKeyword && (
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                title="Xóa tìm kiếm"
              >
                <FaTimes size={14} />
              </button>
            )}

            {/* Divider nhỏ ngăn cách nút X và nút Search */}
            <span className="h-5 w-[1px] bg-gray-300"></span>

            {/* Nút Search */}
            <button
              onClick={handleSearch}
              className="text-gray-500 hover:text-primary p-1 transition-colors"
              title="Tìm kiếm"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">

          {/* Categories Dropdown */}
          <div className="relative" ref={catMenuRef}>
            <button
              onClick={() => setShowCatMenu(!showCatMenu)}
              className="hover:text-primary flex items-center gap-1 focus:outline-none"
            >
              Danh mục
            </button>
            {showCatMenu && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-gray-100 fade-in z-50 flex flex-col max-h-[60vh]">
                <div className="p-2 border-b shrink-0 bg-gray-50/50">
                  <Link
                    to="/products"
                    className="block px-3 py-2 text-primary font-bold hover:bg-white hover:shadow-sm rounded transition-all text-center"
                    onClick={() => setShowCatMenu(false)}
                  >
                    Tất cả sản phẩm
                  </Link>
                </div>

                <div className="overflow-y-auto p-2 scrollbar-thin">
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <div key={cat.id} className="group mb-1">
                        <div className="flex items-center justify-between hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                          <Link
                            to={`/products?category_id=${cat.id}`}
                            className="flex-1 font-medium text-gray-700 hover:text-primary truncate py-1"
                            onClick={() => setShowCatMenu(false)}
                          >
                            {cat.name}
                          </Link>
                          {cat.other_categories?.length > 0 && (
                            <button
                              onClick={(e) => toggleCat(e, cat.id)}
                              className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-full transition-all"
                            >
                              {expandedCats[cat.id] ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                            </button>
                          )}
                        </div>

                        {/* Sub Categories (Recursive logic can be added here if deeper levels needed, currently assumed 2 levels) */}
                        {cat.other_categories?.length > 0 && expandedCats[cat.id] && (
                          <div className="ml-3 pl-3 border-l-2 border-gray-100 mt-1 space-y-1">
                            {cat.other_categories.map(sub => (
                              <Link
                                key={sub.id}
                                to={`/products?category_id=${sub.id}`}
                                className="block py-1 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 px-2 rounded truncate transition-colors"
                                onClick={() => setShowCatMenu(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-xs">Đang tải danh mục...</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {renderNavLinks()}

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:text-primary"
              >
                <FaUserCircle className="text-2xl text-gray-400" />
                <span className="max-w-[100px] truncate">{user.fullName || user.name || user.email}</span>
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg fade-in-reverse border border-gray-100"
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-50 hover:text-primary rounded-t-lg transition-all"
                  >
                    Hồ sơ
                  </Link>

                  {user.role === "BIDDER" && (
                    <Link
                      to="/upgrade"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-secondary hover:bg-gray-50 rounded-lg transition-all"
                    >
                      Nâng cấp bán hàng
                    </Link>
                  )}

                  <div className="border-t my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-b-lg transition-all"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 font-semibold bg-primary text-white hover:bg-primary-dark rounded-md transition">
                Đăng nhập
              </Link>
              <Link to="/register" className="px-4 py-2 font-semibold text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition">
                Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;