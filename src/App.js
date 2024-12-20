import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Layout from './components/layout/Layout';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail';
import EditProduct from './components/EditProduct';
import Login from './components/auth/Login';
import Register from './components/auth/Register.js';
import { AuthProvider } from './context/AuthContext';
import RegisterProduct from './components/RegisterProduct';
import PendingProducts from './components/PendingProducts';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderManagement from './components/admin/OrderManagement';
import AccountManagement from './components/admin/AccountManagement';
import Profile from './components/profile/Profile';
import PrivateAdminRoute from './components/auth/PrivateAdminRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <ConfigProvider>
                    <Router>
                        <Layout>
                            <Routes>
                                {/* Đặt các routes cụ thể hơn lên trước */}
                                <Route path="/add-product" element={<AddProduct />} />
                                <Route path="/product/edit/:id" element={<EditProduct />} />
                                <Route path="/product/:id" element={<ProductDetail />} />
                                
                                {/* Đặt các routes chung chung xuống dưới */}
                                <Route path="/products" element={<ProductList />} />
                                <Route path="/" element={<ProductList />} />
                                
                                {/* Routes cho người dùng */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/register-product" element={<RegisterProduct />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/profile" element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                } />
                                
                                {/* Routes cho admin */}
                                <Route path="/pending-products" element={
                                    <PrivateAdminRoute>
                                        <PendingProducts />
                                    </PrivateAdminRoute>
                                } />
                                <Route path="/admin/orders" element={
                                    <PrivateAdminRoute>
                                        <OrderManagement />
                                    </PrivateAdminRoute>
                                } />
                                <Route path="/admin/manage-accounts" element={
                                    <PrivateAdminRoute>
                                        <AccountManagement />
                                    </PrivateAdminRoute>
                                } />
                                
                                {/* Route cho 404 Not Found */}
                                <Route path="*" element={
                                    <div className="not-found">
                                        <h2>404 - Không tìm thấy trang</h2>
                                    </div>
                                } />
                            </Routes>
                        </Layout>
                    </Router>
                </ConfigProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;