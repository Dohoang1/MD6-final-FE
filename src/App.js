import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail';
import EditProduct from './components/EditProduct';

function App() {
    return (
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
                    
                    {/* Có thể thêm route cho 404 Not Found */}
                    <Route path="*" element={
                        <div className="not-found">
                            <h2>404 - Không tìm thấy trang</h2>
                        </div>
                    } />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;