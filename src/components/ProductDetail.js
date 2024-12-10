import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaEdit, FaTrash, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${id}`);
            setProduct(response.data);
            setLoading(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải chi tiết sản phẩm');
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/product/edit/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                navigate('/');
            } catch (err) {
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    const handleAddToCart = async () => {
        if (addingToCart) return;
        
        setAddingToCart(true);
        try {
            // Thay thế bằng API thêm vào giỏ hàng thực tế
            await axios.post(`http://localhost:8080/api/cart/add/${id}`);
            alert('Đã thêm sản phẩm vào giỏ hàng');
        } catch (err) {
            alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
        } finally {
            setAddingToCart(false);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === product.imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? product.imageUrls.length - 1 : prev - 1
        );
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin sản phẩm...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p className="error-message">{error}</p>
            <Link to="/" className="back-link">
                <FaArrowLeft /> <span>Quay lại trang chủ</span>
            </Link>
        </div>
    );

    return (
        <div className="product-detail">
            {product && (
                <>
                    <div className="product-detail-header">
                        <h2>{product.name}</h2>
                        <div className="header-actions">
                            <Link to="/" className="back-link">
                                <FaArrowLeft /> <span>Quay lại</span>
                            </Link>
                            <div className="product-actions">
                                <button 
                                    className="action-btn edit-btn"
                                    onClick={handleEdit}
                                    title="Sửa sản phẩm"
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={handleDelete}
                                    title="Xóa sản phẩm"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="product-detail-content">
                        {/* Left Column - Images */}
                        <div className="product-detail-left">
                            <div className="product-detail-image-container">
                                <img 
                                    src={`http://localhost:8080/uploads/${product.imageUrls[currentImageIndex]}`}
                                    alt={product.name}
                                    className="main-image"
                                    onClick={() => setIsModalOpen(true)}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500';
                                    }}
                                />
                                {product.imageUrls.length > 1 && (
                                    <>
                                        <button 
                                            className="image-nav-button prev"
                                            onClick={previousImage}
                                            title="Ảnh trước"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <button 
                                            className="image-nav-button next"
                                            onClick={nextImage}
                                            title="Ảnh tiếp theo"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="image-gallery">
                                {product.imageUrls.map((url, index) => (
                                    <div 
                                        key={index}
                                        className={`gallery-item ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img 
                                            src={`http://localhost:8080/uploads/${url}`}
                                            alt={`${product.name} ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="product-detail-right">
                            <div className="product-info-section">
                                <div className="info-group">
                                    <span className="info-label">Danh mục:</span>
                                    <span className="category-tag">{product.category}</span>
                                </div>

                                <div className="info-group">
                                    <span className="info-label">Mô tả sản phẩm:</span>
                                    <div className="description-content">
                                        {product.description}
                                    </div>
                                </div>

                                <div className="product-purchase-info">
                                    <div className="price-status-section">
                                        <div className="price-section">
                                            <span className="info-label">Giá:</span>
                                            <span className="price-value">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(product.price)}
                                            </span>
                                        </div>
                                        
                                        <div className="status-section">
                                            <span className="info-label">Trạng thái:</span>
                                            <span className={`status-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        className={`add-to-cart-btn ${addingToCart ? 'loading' : ''}`}
                                        disabled={product.quantity < 1 || addingToCart}
                                        onClick={handleAddToCart}
                                    >
                                        <FaShoppingCart className="cart-icon" />
                                        <span>
                                            {addingToCart ? 'Đang thêm...' : 
                                             product.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Modal */}
                    {isModalOpen && (
                        <div className="image-modal" onClick={() => setIsModalOpen(false)}>
                            <span className="modal-close">&times;</span>
                            <img 
                                src={`http://localhost:8080/uploads/${product.imageUrls[currentImageIndex]}`}
                                alt={product.name}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {product.imageUrls.length > 1 && (
                                <>
                                    <button 
                                        className="modal-nav-button prev"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            previousImage();
                                        }}
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button 
                                        className="modal-nav-button next"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProductDetail;