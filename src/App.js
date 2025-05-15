import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";

// Auth Pages
import Login from "./pages/auth/Login";
import HomePage from "./pages/Home/HomePage";
import ShopPage from "./pages/Shop/ShopPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";
import ContactPage from "./pages/Contact/ContactPage";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import PolicyDetails from "./pages/Policy/PolicyDetails";

import "./App.css";

function App() {
    return (
        <ThemeProvider>
            <CartProvider>
                <AuthProvider>
                    <Router>
                        <Routes>
                            {/* Auth Routes */}
                            <Route
                                path="/login"
                                element={
                                    <>
                                        <Header />
                                        <Login />
                                        <ThemeToggle />
                                    </>
                                }
                            />

                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminRoute />}>
                                <Route element={<AdminLayout />}>
                                    <Route index element={<Dashboard />} />
                                    <Route path="products" element={<Products />} />
                                    <Route path="orders" element={<Orders />} />
                                    <Route path="users" element={<Users />} />
                                    <Route
                                        path="settings"
                                        element={
                                            <div className="admin-page">
                                                <h1>Settings</h1>
                                            </div>
                                        }
                                    />
                                </Route>
                            </Route>

                            {/* Protected Routes */}
                            <Route path="/profile" element={<ProtectedRoute />}>
                                <Route
                                    element={
                                        <>
                                            <Header />
                                            <div className="container">
                                                <h1>Your Profile</h1>
                                                <p>This is a protected route that requires authentication.</p>
                                            </div>
                                            <ThemeToggle />
                                        </>
                                    }
                                />
                            </Route>

                            {/* Public Routes */}
                            <Route
                                element={
                                    <div className="App">
                                        <Header />
                                        <main>
                                            <Routes>
                                                {/* Temporary homepage for demonstration */}
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/shop" element={<ShopPage />} />
                                                <Route
                                                    path="/products/:productId"
                                                    element={<ProductDetailPage />}
                                                />{" "}
                                                {/* Route cho chi tiết SP */}
                                                <Route path="/contact-us" element={<ContactPage />} />
                                                <Route path="/cart" element={<CartPage />} />
                                                <Route path="/checkout" element={<CheckoutPage />} />
                                                <Route path="/policy" element={<PolicyDetails />} />
                                            </Routes>
                                        </main>
                                        <ThemeToggle />
                                        <Footer />
                                    </div>
                                }
                            >
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </Router>
                </AuthProvider>
            </CartProvider>
        </ThemeProvider>
    );
}

export default App;
