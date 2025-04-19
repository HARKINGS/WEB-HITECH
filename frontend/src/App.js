import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              <>
                <Header />
                <Login />
                <ThemeToggle />
              </>
            } />
            <Route path="/register" element={
              <>
                <Header />
                <Register />
                <ThemeToggle />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<div className="admin-page"><h1>Settings</h1></div>} />
              </Route>
            </Route>

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute />}>
              <Route element={
                <>
                  <Header />
                  <div className="container">
                    <h1>Your Profile</h1>
                    <p>This is a protected route that requires authentication.</p>
                  </div>
                  <ThemeToggle />
                </>
              } />
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <div className="App">
                <Header />
                <main>
                  <Routes>
                    {/* Temporary homepage for demonstration */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                  </Routes>
                </main>
                <ThemeToggle />
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;