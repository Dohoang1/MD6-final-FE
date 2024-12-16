import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        email: '',
        deliveryTime: '',
        paymentMethod: 'COD'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Lấy dữ liệu giỏ hàng từ API
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/cart');
                setCartItems(response.data.items);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
            }
        };
        fetchCartItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'deliveryTime') {
            const selectedTime = new Date(value);
            const minTime = new Date();
            minTime.setHours(minTime.getHours() + 2); // Thêm 2 tiếng vào thời gian hiện tại

            if (selectedTime < minTime) {
                setError('Thời gian nhận hàng phải sau thời điểm hiện tại ít nhất 2 tiếng');
            } else {
                setError('');
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.priceAtAdd * item.quantity), 0);
    };

    const calculateShippingFee = () => {
        // Có thể thay đổi logic tính phí ship tùy theo yêu cầu
        return 30000; // Phí ship cố định 30,000 VND
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShippingFee();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra validation thời gian
        const selectedTime = new Date(formData.deliveryTime);
        const minTime = new Date();
        minTime.setHours(minTime.getHours() + 2);

        if (selectedTime < minTime) {
            setError('Thời gian nhận hàng phải sau thời điểm hiện tại ít nhất 2 tiếng');
            return;
        }

        try {
            const orderData = {
                ...formData,
                items: cartItems,
                subtotal: calculateSubtotal(),
                shippingFee: calculateShippingFee(),
                totalAmount: calculateTotal()
            };
            
            const response = await axios.post('http://localhost:8080/api/orders', orderData);
            
            if (response.data) {
                // Xóa giỏ hàng sau khi đặt hàng thành công
                await axios.delete('http://localhost:8080/api/cart/clear');
                alert('Đặt hàng thành công!');
                navigate('/');
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        }
    };

    return (
        <div className="checkout-container">
            <h2>Thanh Toán</h2>
            <div className="checkout-content">
                <div className="order-summary">
                    <h3>Đơn hàng của bạn</h3>
                    <div className="order-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="order-item">
                                <div className="item-info">
                                    <img 
                                        src={`http://localhost:8080/uploads/${item.product.imageUrls[0]}`}
                                        alt={item.product.name}
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-quantity">Số lượng: {item.quantity}</span>
                                    </div>
                                </div>
                                <span className="item-price">
                                    {formatPrice(item.priceAtAdd * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="order-totals">
                        <div className="total-row">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(calculateSubtotal())}</span>
                        </div>
                        <div className="total-row">
                            <span>Phí vận chuyển:</span>
                            <span>{formatPrice(calculateShippingFee())}</span>
                        </div>
                        <div className="total-row grand-total">
                            <span>Tổng cộng:</span>
                            <span>{formatPrice(calculateTotal())}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Thời gian nhận hàng:</label>
                        <input
                            type="datetime-local"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleInputChange}
                            min={new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                            required
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <div className="form-group">
                        <label>Phương thức thanh toán:</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                        >
                            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                            <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                        </select>
                    </div>

                    <button type="submit" className="checkout-button" disabled={!!error}>
                        Xác nhận đặt hàng
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
