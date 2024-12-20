import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaShoppingCart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
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
                                                <Link 
                                                    to="/profile" 
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    Thông tin cá nhân
                                                </Link>
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
                                                        <Link 
                                                            to="/admin/manage-accounts" 
                                                            onClick={() => setShowDropdown(false)}
                                                        >
                                                            Quản lý tài khoản
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

            <div className="sub-navbar">
                <div className="sub-navbar-container">
                    <div className="sub-navbar-left">
                        <a href="tel:1900.1234" className="sub-nav-item">
                            <i className="fas fa-phone"></i> Gọi mua hàng: 1900.1234
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-shopping-cart"></i> Mua Hàng Online
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-map-marker-alt"></i> Miền Bắc
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-map-marker-alt"></i> Miền Trung
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-map-marker-alt"></i> Miền Nam
                        </a>
                    </div>
                    <div className="sub-navbar-right">
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-comment"></i> Feedback
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-search"></i> Tìm cửa hàng gần nhất
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-question-circle"></i> Hỗ trợ
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-info-circle"></i> Trung tâm dịch vụ
                        </a>
                        <a href="#" className="sub-nav-item">
                            <i className="fas fa-gift"></i> Khuyến mại
                        </a>
                    </div>
                </div>
            </div>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-info-container">
                        <div className="footer-info-item">
                            <FaPhone className="footer-icon" />
                            <div className="footer-info-text">
                                <h4>Hotline</h4>
                                <p>1900 1234</p>
                            </div>
                        </div>
                        <div className="footer-info-item">
                            <FaEnvelope className="footer-icon" />
                            <div className="footer-info-text">
                                <h4>Email</h4>
                                <p>support@unitrade.com</p>
                            </div>
                        </div>
                        <div className="footer-info-item">
                            <FaMapMarkerAlt className="footer-icon" />
                            <div className="footer-info-text">
                                <h4>Địa chỉ</h4>
                                <p>Hà Nội, Việt Nam</p>
                            </div>
                        </div>
                        <div className="footer-info-item">
                            <FaClock className="footer-icon" />
                            <div className="footer-info-text">
                                <h4>Giờ làm việc</h4>
                                <p>8:00 - 22:00</p>
                            </div>
                        </div>
                    </div>
                </div>
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
                    <div className="footer-section">
                        <h3>Hỗ trợ khách hàng</h3>
                        <p><Link to="/tra-cuu-don-hang">Tra cứu đơn hàng</Link></p>
                        <p><Link to="/huong-dan-mua-hang">Hướng dẫn mua hàng trực tuyến</Link></p>
                        <p><Link to="/huong-dan-thanh-toan">Hướng dẫn thanh toán</Link></p>
                        <p><Link to="/huong-dan-tra-gop">Hướng dẫn mua hàng trả góp</Link></p>
                        <p><Link to="/bang-gia">Bảng giá vật tư và dịch vụ sửa chữa lắp đặt</Link></p>
                        <p><Link to="/hoa-don">In hóa đơn điện tử</Link></p>
                        <p><Link to="/gop-y">Góp ý, khiếu nại</Link></p>
                    </div>
                    <div className="footer-section">
                        <h3>Chính sách chung</h3>
                        <p><Link to="/chinh-sach-chung">Chính sách, quy định chung</Link></p>
                        <p><Link to="/chinh-sach-bao-hanh">Chính sách bảo hành</Link></p>
                        <p><Link to="/chinh-sach-doanh-nghiep">Chính sách cho doanh nghiệp</Link></p>
                        <p><Link to="/chinh-sach-hang-chinh-hang">Chính sách hàng chính hãng</Link></p>
                        <p><Link to="/bao-mat">Bảo mật thông tin khách hàng</Link></p>
                        <p><Link to="/chinh-sach-nhap-lai">Chính sách nhập lại tính phí</Link></p>
                        <p><Link to="/chinh-sach-giao-hang">Chính sách giao hàng</Link></p>
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