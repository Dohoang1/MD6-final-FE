import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductList.css';

function ProductList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 12;

    const sortOption = searchParams.get('sort') || 'newest';
    const searchTerm = searchParams.get('search') || '';

    const getSortParams = (option) => {
        switch(option) {
            case 'newest':
                return 'id,desc';
            case 'priceAsc':
                return 'price,asc';
            case 'priceDesc':
                return 'price,desc';
            default:
                return 'id,desc';
        }
    };

    const fetchProducts = async () => {
        try {
            const sortParam = getSortParams(sortOption);
            let url = `http://localhost:8080/api/products/page?page=${currentPage}&size=${pageSize}&sort=${sortParam}`;
            
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }
            
            console.log('Fetching products with URL:', url);
            
            const response = await axios.get(url);
            console.log('API Response:', response.data);
            
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setLoading(false);
        } catch (err) {
            console.error('Error details:', err.response || err);
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('URL changed:', location.search);
        console.log('Current search params:', Object.fromEntries(searchParams));
        console.log('Search term:', searchTerm);
        console.log('Sort option:', sortOption);
        fetchProducts();
    }, [location.search]);

    useEffect(() => {
        console.log('Products updated:', products);
    }, [products]);

    const handleSortChange = (event) => {
        const newSortOption = event.target.value;
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('sort', newSortOption);
            if (searchTerm) {
                newParams.set('search', searchTerm);
            }
            return newParams;
        });
    };

    const handleEdit = (id) => {
        navigate(`/product/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                fetchProducts();
            } catch (err) {
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
<div className="product-list">
        <div className="list-header">
            <h2 className="page-title">
                {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : 'Danh sách sản phẩm'}
            </h2>
            <div className="sort-container">
                <select 
                    value={sortOption}
                    onChange={handleSortChange}
                    className="sort-select"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                </select>
            </div>
        </div>

        {searchTerm && (
            <p className="search-results">
                Tìm thấy {totalElements} sản phẩm
            </p>
        )}

        <div className="products-grid">
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <Link 
                        to={`/product/${product.id}`} 
                        className="product-link tooltip" 
                        data-tooltip={product.description}
                    >
                        <div className="product-image-container">
                            <img 
                                src={`http://localhost:8080/uploads/${product.imageUrls[0]}`} 
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300';
                                }}
                            />
                        </div>
                    </Link>
                    <div className="product-info">
                        <Link 
                            to={`/product/${product.id}`} 
                            className="product-name-link tooltip" 
                            data-tooltip={product.description}
                        >
                            <h3>{product.name}</h3>
                        </Link>
                            <span className="product-category">{product.category}</span>
                            <div className="product-status">
                                {product.quantity > 0 ? (
                                    <span className="in-stock">Còn hàng</span>
                                ) : (
                                    <span className="out-of-stock">Hết hàng</span>
                                )}
                            </div>
                            <p className="product-price">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(product.price)}
                            </p>
                            <div className="product-actions">
                                <button 
                                    className="action-btn cart-btn"
                                    disabled={product.quantity < 1}
                                    title="Thêm vào giỏ hàng"
                                >
                                    <FaShoppingCart />
                                </button>
                                <button 
                                    className="action-btn edit-btn"
                                    onClick={() => handleEdit(product.id)}
                                    title="Sửa sản phẩm"
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(product.id)}
                                    title="Xóa sản phẩm"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="pagination-button"
                >
                    Trang trước
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={`pagination-button ${currentPage === index ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="pagination-button"
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
}

export default ProductList;