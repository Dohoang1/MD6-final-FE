import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách đơn hàng');
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
                status: newStatus
            });
            toast.success('Cập nhật trạng thái đơn hàng thành công');
            fetchOrders();
        } catch (error) {
            toast.error('Lỗi khi cập nhật trạng thái đơn hàng');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return '#ffc107';
            case 'SHIPPING':
                return '#17a2b8';
            case 'COMPLETED':
                return '#28a745';
            case 'REJECTED':
                return '#dc3545';
            case 'CANCELLED':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'SHIPPING':
                return 'Đang giao hàng';
            case 'COMPLETED':
                return 'Đã giao hàng';
            case 'REJECTED':
                return 'Đã từ chối';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="order-management">
            <h2>Quản lý đơn hàng</h2>
            
            <div className="orders-container">
                <div className="orders-list">
                    {orders.map(order => (
                        <div 
                            key={order.id} 
                            className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                            onClick={() => setSelectedOrder(order)}
                        >
                            <div className="order-header">
                                <span className="order-id">Đơn hàng #{order.id}</span>
                                <span 
                                    className="order-status"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className="order-info">
                                <p><strong>Khách hàng:</strong> {order.fullName}</p>
                                <p><strong>Thời gian đặt:</strong> {formatDate(order.createdAt)}</p>
                                <p><strong>Tổng tiền:</strong> {formatPrice(order.totalAmount)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedOrder && (
                    <div className="order-details">
                        <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
                        <div className="customer-info">
                            <h4>Thông tin khách hàng</h4>
                            <p><strong>Họ tên:</strong> {selectedOrder.fullName}</p>
                            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                            <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
                            <p><strong>Email:</strong> {selectedOrder.email}</p>
                            <p><strong>Thời gian nhận hàng:</strong> {formatDate(selectedOrder.deliveryTime)}</p>
                        </div>

                        <div className="order-items">
                            <h4>Sản phẩm</h4>
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="item">
                                    <img 
                                        src={`http://localhost:8080/uploads/${item.product.imageUrls[0]}`}
                                        alt={item.product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/50';
                                        }}
                                    />
                                    <div className="item-info">
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-quantity">x{item.quantity}</span>
                                        <span className="item-price">{formatPrice(item.priceAtAdd)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Tạm tính:</span>
                                <span>{formatPrice(selectedOrder.subtotal)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>{formatPrice(selectedOrder.shippingFee)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>{formatPrice(selectedOrder.totalAmount)}</span>
                            </div>
                        </div>

                        <div className="order-actions">
                            {selectedOrder.status === 'PENDING' && (
                                <>
                                    <button
                                        className="btn-approve"
                                        onClick={() => handleStatusChange(selectedOrder.id, 'SHIPPING')}
                                    >
                                        Xác nhận và giao hàng
                                    </button>
                                    <button
                                        className="btn-reject"
                                        onClick={() => handleStatusChange(selectedOrder.id, 'REJECTED')}
                                    >
                                        Từ chối đơn hàng
                                    </button>
                                </>
                            )}
                            {selectedOrder.status === 'SHIPPING' && (
                                <button
                                    className="btn-complete"
                                    onClick={() => handleStatusChange(selectedOrder.id, 'COMPLETED')}
                                >
                                    Xác nhận đã giao hàng
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
