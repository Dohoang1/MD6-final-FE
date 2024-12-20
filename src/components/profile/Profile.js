import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import './Profile.css';

function Profile() {
    const [form] = Form.useForm();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address
            });
        }
    }, [user, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await axiosInstance.put('/api/users/profile', values);
            updateUser(response.data);
            message.success('Cập nhật thông tin thành công');
            setEditing(false);
        } catch (error) {
            message.error('Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <Card title="Thông tin cá nhân" className="profile-card">
                <div className="profile-header">
                    <Avatar size={100} icon={<UserOutlined />} />
                    <h2>{user?.username}</h2>
                    <span className="role-badge">{user?.role}</span>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="profile-form"
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input disabled={!editing} />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                        ]}
                    >
                        <Input disabled={!editing} />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ' }
                        ]}
                    >
                        <Input.TextArea disabled={!editing} />
                    </Form.Item>

                    <div className="profile-actions">
                        {!editing ? (
                            <Button type="primary" onClick={() => setEditing(true)}>
                                Chỉnh sửa
                            </Button>
                        ) : (
                            <>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Lưu thay đổi
                                </Button>
                                <Button onClick={() => {
                                    setEditing(false);
                                    form.resetFields();
                                }}>
                                    Hủy
                                </Button>
                            </>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default Profile;
