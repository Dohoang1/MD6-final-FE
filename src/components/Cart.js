import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import './Cart.css';
import { useCart } from '../context/CartContext';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { updateCartCount } = useCart();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get('/api/cart');
            setCartItems(response.data.items);
            setTotal(response.data.total);
            setLoading(false);
        } catch (error) {
            toast.error('Lỗi khi tải giỏ hàng');
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            await axiosInstance.put(`/api/cart/${productId}`, null, {
                params: { quantity: newQuantity }
            });
            fetchCartItems();
        } catch (error) {
            if (error.response?.data) {
                toast.error(error.response.data);
            } else {
                toast.error('Lỗi khi cập nhật số lượng');
            }
        }
    };

    const removeItem = async (productId) => {
        try {
            await axiosInstance.delete(`/api/cart/${productId}`);
            fetchCartItems();
            updateCartCount();
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            toast.error('Lỗi khi xóa sản phẩm');
        }
    };

    const clearCart = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
            try {
                await axiosInstance.delete('/api/cart/clear');
                fetchCartItems();
                updateCartCount();
                toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
            } catch (error) {
                toast.error('Lỗi khi xóa giỏ hàng');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Giỏ hàng trống</h2>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                <Link to="/" className="continue-shopping">
                    <FaArrowLeft /> Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2>Giỏ hàng của bạn</h2>
                <button onClick={clearCart} className="clear-cart-btn">
                    Xóa tất cả
                </button>
            </div>

            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-image">
                            <img
                                src={`http://localhost:8080/uploads/${item.product.imageUrls[0]}`}
                                alt={item.product.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                        </div>
                        <div className="item-details">
                            <Link to={`/product/${item.product.id}`} className="item-name">
                                {item.product.name}
                            </Link>
                            <p className="item-price">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(item.priceAtAdd)}
                            </p>
                        </div>
                        <div className="item-quantity">
                            <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <FaMinus />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.quantity}
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <div className="item-total">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(item.priceAtAdd * item.quantity)}
                        </div>
                        <button
                            onClick={() => removeItem(item.product.id)}
                            className="remove-item"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Tổng tiền:</span>
                    <span className="total-amount">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(total)}
                    </span>
                </div>
                <button className="checkout-btn">
                    Tiến hành thanh toán
                </button>
                <Link to="/" className="continue-shopping">
                    <FaArrowLeft /> Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}

export default Cart; 