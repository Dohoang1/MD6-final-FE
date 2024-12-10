import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import './AddProduct.css';

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
            const response = await axios.get('http://localhost:8080/api/products');
            // Extract unique categories from products
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

            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('description', description.trim());
            formData.append('category', category.trim());

            files.forEach(file => {
                formData.append('files', file);
            });

            await axios.post('http://localhost:8080/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Có lỗi xảy ra khi thêm sản phẩm');
            setSaving(false);
        }
    };

    // Cleanup function for previews
    useEffect(() => {
        return () => {
            previews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [previews]);

    return (
        <div className="add-product">
            <div className="add-product-header">
                <h2>Thêm sản phẩm mới</h2>
                <Link to="/" className="back-link tooltip">
                    <FaArrowLeft /> Quay lại
                    <span className="tooltip-text">Quay về trang danh sách</span>
                </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="add-form">
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
                                        ×
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