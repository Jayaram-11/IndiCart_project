// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import SellProducts from './pages/SellProducts';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseProducts from './pages/BrowseProducts';
import MyAccount from './pages/MyAccount';
import BecomeSeller from './pages/BecomeSeller';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserList from './pages/AdminUserList';
import AdminProductList from './pages/AdminProductList';
import SsoLogoutPage from './pages/SsoLogoutPage'; // ✅ NEW Import

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-6">
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/browse" element={<BrowseProducts />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/become-seller"
            element={
              <ProtectedRoute>
                <BecomeSeller />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />

          {/* 🟠 Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProductList />
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW: SSO Logout Route */}
          <Route path="/auth/sso-logout" element={<SsoLogoutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
