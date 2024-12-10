import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Layout.css';

function Layout({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        // Đảm bảo event listener được thêm vào document
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Thêm event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Empty dependency array

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowDropdown(false);
        navigate('/login');
        
        // Hiển thị thông báo thành công
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
                                            {(user.role === 'PROVIDER' || user.role === 'ADMIN') && (
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