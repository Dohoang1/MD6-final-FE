import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Layout.css';

function Layout({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search submitted:', searchTerm);
        if (searchTerm.trim()) {
            const currentSort = new URLSearchParams(window.location.search).get('sort') || 'newest';
            const searchUrl = `/?search=${encodeURIComponent(searchTerm.trim())}&sort=${currentSort}`;
            console.log('Navigating to:', searchUrl);
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
                            <Link to="/add-product" className="nav-link">Thêm sản phẩm</Link>
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