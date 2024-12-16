import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import './PendingProducts.css';

function PendingProducts() {
    const [pendingProducts, setPendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/products/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPendingProducts(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách sản phẩm chờ duyệt');
            setLoading(false);
        }
    };

    const handleApprove = async (id, approved) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/products/${id}/approve?approved=${approved}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success(approved ? 'Đã duyệt sản phẩm' : 'Đã từ chối sản phẩm');
            fetchPendingProducts();
        } catch (error) {
            toast.error('Lỗi khi xử lý yêu cầu');
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách sản phẩm...</p>
        </div>
    );

    if (pendingProducts.length === 0) {
        return (
            <div className="no-pending-products">
                <h2>Không có sản phẩm nào đang chờ duyệt</h2>
            </div>
        );
    }

    return (
        <div className="pending-products-container">
            <h2>Sản phẩm chờ duyệt</h2>
            <div className="pending-products-grid">
                {pendingProducts.map(product => (
                    <div key={product.id} className="pending-product-card">
                        <div className="product-image">
                            <img 
                                src={`http://localhost:8080/uploads/${product.imageUrls[0]}`}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300';
                                }}
                            />
                            {product.imageUrls.length > 1 && (
                                <span className="image-count">+{product.imageUrls.length - 1}</span>
                            )}
                        </div>
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            <div className="product-details">
                                <p className="product-price">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.price)}
                                </p>
                                <p className="product-quantity">Số lượng: {product.quantity}</p>
                                <p className="product-category">Danh mục: {product.category}</p>
                                <p className="seller-info">Người bán: {product.sellerUsername}</p>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <Link 
                                to={`/product/${product.id}`}
                                className="view-button tooltip"
                            >
                                <FaEye />
                                <span className="tooltip-text">Xem chi tiết</span>
                            </Link>
                            <button 
                                onClick={() => handleApprove(product.id, true)}
                                className="approve-button tooltip"
                            >
                                <FaCheck />
                                <span className="tooltip-text">Duyệt sản phẩm</span>
                            </button>
                            <button 
                                onClick={() => handleApprove(product.id, false)}
                                className="reject-button tooltip"
                            >
                                <FaTimes />
                                <span className="tooltip-text">Từ chối</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PendingProducts; 