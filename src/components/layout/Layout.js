import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import './Layout.css';
import { useCart } from '../../context/CartContext';

function Layout({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const { cartItemCount, updateCartCount } = useCart();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (user) {
            updateCartCount();
        }
    }, [user, location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Đăng xuất thành công!');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const currentSort = new URLSearchParams(window.location.search).get('sort') || 'newest';
            const searchUrl = `/?search=${encodeURIComponent(searchTerm.trim())}&sort=${currentSort}`;
            navigate(searchUrl);
        }
    };

    return (
        <div className="layout">
            <header className="header">
                <div className="header-container">
                    <Link to="/" className="logo">
                        <h1>UniTrade</h1>
                    </Link>
                    <div className="header-right">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc danh mục..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <FaSearch />
                            </button>
                        </form>
                        <nav className="nav-links">
                            {user ? (
                                <>
                                    <Link to="/cart" className="cart-link">
                                        <FaShoppingCart />
                                        {cartItemCount > 0 && (
                                            <span className="cart-badge">{cartItemCount}</span>
                                        )}
                                    </Link>
                                    <div className="user-dropdown" ref={dropdownRef}>
                                        <button 
                                            className="dropdown-trigger"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            <FaUserCircle />
                                            <span>{user.username}</span>
                                        </button>
                                        {showDropdown && (
                                            <div className="dropdown-menu">
                                                {user.role === 'PROVIDER' && (
                                                    <Link 
                                                        to="/register-product" 
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        Đăng bán sản phẩm
                                                    </Link>
                                                )}
                                                {user.role === 'ADMIN' && (
                                                    <>
                                                        <Link 
                                                            to="/pending-products" 
                                                            onClick={() => setShowDropdown(false)}
                                                        >
                                                            Duyệt sản phẩm đăng bán
                                                        </Link>
                                                        <Link 
                                                            to="/admin/orders" 
                                                            onClick={() => setShowDropdown(false)}
                                                        >
                                                            Quản lý đơn hàng
                                                        </Link>
                                                    </>
                                                )}
                                                {(user.role === 'ADMIN' || user.role === 'SALESPERSON') && (
                                                    <Link 
                                                        to="/add-product" 
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        Thêm sản phẩm
                                                    </Link>
                                                )}
                                                <Link 
                                                    to="/profile" 
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    Thông tin cá nhân
                                                </Link>
                                                <button 
                                                    onClick={() => {
                                                        handleLogout();
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link">Đăng nhập</Link>
                                    <Link to="/register" className="nav-link">Đăng ký</Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>Về chúng tôi</h3>
                        <p>UniTrade - Nền tảng mua sắm trực tuyến hàng đầu</p>
                    </div>
                    <div className="footer-section">
                        <h3>Liên hệ</h3>
                        <p>Email: contact@unitrade.com</p>
                        <p>Điện thoại: (84) 123-456-789</p>
                    </div>
                    <div className="footer-section">
                        <h3>Theo dõi</h3>
                        <div className="social-links">
                            <a href="#" className="social-link">Facebook</a>
                            <a href="#" className="social-link">Instagram</a>
                            <a href="#" className="social-link">Twitter</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 UniTrade. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;