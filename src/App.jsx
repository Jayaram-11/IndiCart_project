import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import SellProducts from './pages/SellProducts';
import ProtectedRoute from './components/ProtectedRoute';
import BrowseProducts from './pages/BrowseProducts'; // 1. Import BrowseProducts
import MyAccount from './pages/MyAccount';       // 2. Import MyAccount

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/browse" element={<BrowseProducts />} /> {/* 3. Add /browse route */}

          {/* Protected Routes */}
          <Route path="/sell" element={<ProtectedRoute><SellProducts /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} /> {/* 4. Add /account route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;