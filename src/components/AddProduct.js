import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { FaArrowLeft, FaSave, FaImage, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddProduct.css';

// Thêm interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

function AddProduct() {
    const navigate = useNavigate();
    
    // Form states
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    
    // Category states
    const [categories, setCategories] = useState([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    
    // UI states
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch existing categories
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/products');
            const uniqueCategories = [...new Set(response.data.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

        // Create previews
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setShowCustomInput(true);
            setCategory('');
        } else {
            setShowCustomInput(false);
            setCategory(value);
            setCustomCategory('');
        }
    };

    const handleCustomCategoryChange = (e) => {
        const value = e.target.value;
        setCustomCategory(value);
        setCategory(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        
        try {
            setSaving(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Vui lòng đăng nhập để thêm sản phẩm');
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('description', description);
            formData.append('category', category);
            
            files.forEach(file => {
                formData.append('files', file);
            });

            console.log('Sending request with token:', token); // Debug log

            const response = await axiosInstance.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Thêm sản phẩm thành công!');
            navigate('/');
        } catch (err) {
            console.error('Error:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm');
                toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Thêm Sản Phẩm Mới</h2>
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-group">
                    <label htmlFor="name">Tên sản phẩm:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">Giá:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Số lượng:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Nhập số lượng"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Danh mục:</label>
                    <div className="category-input-group">
                        <select
                            value={showCustomInput ? 'custom' : category}
                            onChange={handleCategoryChange}
                            className="category-select"
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                            <option value="custom">+ Thêm danh mục mới</option>
                        </select>
                        
                        {showCustomInput && (
                            <input
                                type="text"
                                value={customCategory}
                                onChange={handleCustomCategoryChange}
                                placeholder="Nhập tên danh mục mới"
                                className="custom-category-input"
                            />
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Mô tả:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nhập mô tả sản phẩm"
                        rows="5"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Hình ảnh:</label>
                    <div className="image-upload-container">
                        <div className="preview-container">
                            {previews.map((preview, index) => (
                                <div key={index} className="image-preview-wrapper">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="image-preview"
                                    />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => removeFile(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <label className="upload-button tooltip">
                            <FaImage /> Thêm ảnh
                            <span className="tooltip-text">Chọn nhiều ảnh để tải lên</span>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className={`save-button ${saving ? 'saving' : ''} tooltip`}
                    disabled={saving}
                >
                    <FaSave />
                    {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    <span className="tooltip-text">
                        {saving ? 'Đang xử lý...' : 'Lưu thông tin sản phẩm'}
                    </span>
                </button>
            </form>
        </div>
    );
}

export default AddProduct;