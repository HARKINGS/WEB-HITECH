import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import './App.css';


function App() {
  return (
    <ThemeProvider> 
      <Router>
        <div className="App">
          <Header />
          <main>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              {/* <Route path="/products/:productId" element={<ProductDetailPage />} /> 
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} /> */}
            </Routes>
          </main>
          <Footer />
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;