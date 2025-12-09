import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Protected & Role-based routing
import ProtectedRoute from './ProtectedRoute';

// Guest Pages
import HomePage from '../pages/guest/HomePage';

// User Pages
import UserProfile from '../pages/user/UserProfile';
import WatchList from '../pages/user/WatchList';
import MyBidding from '../pages/user/MyBidding';
import WonProducts from '../pages/user/WonProducts';
import UpgradeSeller from '../pages/user/UpgradeSeller';

// Products
import ProductList from '../pages/product/ProductList';
import ProductDetail from '../pages/product/ProductDetail';
import PostProduct from '../pages/product/PostProduct';
import MyProducts from '../pages/product/MyProducts';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import CategoryManagePage from '../pages/admin/CategoryManagePage';
import UserManagePage from '../pages/admin/UserManagePage';
import ProductManagePage from '../pages/admin/ProductManagePage';

// Global fallback pages
import Forbidden from '../pages/Forbidden';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Main Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductList />} />
        <Route path="product/:id" element={<ProductDetail />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BIDDER', 'SELLER', 'ADMIN']} />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="watchlist" element={<WatchList />} />
          <Route path="bidding" element={<MyBidding />} />
          <Route path="won-products" element={<WonProducts />} />
        </Route>

        {/* Seller Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
          <Route path="post-product" element={<PostProduct />} />
          <Route path="my-products" element={<MyProducts />} />
        </Route>

        {/* Bidder Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BIDDER', 'ADMIN']} />}>
          <Route path="upgrade" element={<UpgradeSeller />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagePage />} />
          <Route path="users" element={<UserManagePage />} />
          <Route path="products" element={<ProductManagePage />} />
        </Route>
      </Route>

      {/* Forbidden & Not Found Routes */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
