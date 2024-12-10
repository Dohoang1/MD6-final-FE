import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'CUSTOMER'
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        setError('');
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }
        // Kiểm tra email hợp l��
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return false;
        }
        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Số điện thoại không hợp lệ (10-11 số)');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Tạo object data để gửi lên server
            const registerData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                role: formData.role
            };

            console.log('Sending register data:', registerData); // Log data gửi đi

            // Gọi API đăng ký
            const response = await axios.post('http://localhost:8080/api/auth/register', registerData);

            if (response.data) {
                // Đăng ký thành công
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err); // Log chi tiết lỗi
            console.error('Error response:', err.response); // Log response lỗi
            
            setError(
                err.response?.data?.message || 
                err.response?.data || 
                err.message || 
                'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng ký</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Tên người dùng:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        minLength="3"
                        maxLength="50"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10,11}"
                    />
                </div>
                <div className="form-group">
                    <label>Địa chỉ:</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
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
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Vai trò:</label>
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange}
                    >
                        <option value="CUSTOMER">Khách hàng</option>
                        <option value="PROVIDER">Nhà cung cấp</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="auth-button" 
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>
        </div>
    );
}

export default Register;
