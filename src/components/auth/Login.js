import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            
            // Lưu token và user info vào localStorage
            localStorage.setItem('token', response.data.token);
            
            // Sử dụng context để cập nhật trạng thái đăng nhập
            login(response.data.user);
            
            // Thêm token vào header mặc định cho các request sau này
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            // Hiển thị thông báo thành công
            toast.success('Đăng nhập thành công!');
            
            // Chuyển hướng về trang chủ
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Nhập email của bạn"
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <button type="submit" className="auth-button">Đăng nhập</button>
                <p className="auth-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
