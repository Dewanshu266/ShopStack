


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Addresses from './pages/Addresses.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Wishlist from './pages/Wishlist.jsx';
import OrdersAdmin from './pages/OrdersAdmin.jsx';
import AddressManager from './pages/AddressManager.jsx';
import Profile from './pages/Profile.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminEditProduct from './pages/AdminEditProduct.jsx';
import AdminProductDashboard from './pages/AdminProductDashboard.jsx';
import AdminAddProduct from './pages/AdminAddProduct.jsx';
import ProductCard from './components/ProductCard.jsx'; 

function App() {
  return (
   
 
    

    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/products" element={<PrivateRoute adminOnly={true}><AdminProductDashboard /></PrivateRoute>} />
            <Route path="/admin/products/new" element={<PrivateRoute adminOnly={true}><AdminAddProduct /></PrivateRoute>} />
            <Route path="/admin/products/:id/edit" element={<PrivateRoute adminOnly={true}><AdminEditProduct /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute adminOnly={true}><OrdersAdmin /></PrivateRoute>} />
            <Route path="/addresses/manage" element={<PrivateRoute><AddressManager /></PrivateRoute>} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>

  );
}

export default App;

