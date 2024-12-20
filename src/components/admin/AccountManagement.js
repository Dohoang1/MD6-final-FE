import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosConfig';
import './AccountManagement.css';

const { Option } = Select;

function AccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [form] = Form.useForm();

    // Fetch accounts data
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/admin/accounts');
            setAccounts(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách tài khoản');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Handle account update
    const handleUpdate = async (values) => {
        try {
            await axiosInstance.put(`/api/admin/accounts/${selectedAccount.id}`, values);
            message.success('Cập nhật tài khoản thành công');
            setModalVisible(false);
            fetchAccounts();
        } catch (error) {
            message.error('Không thể cập nhật tài khoản');
        }
    };

    // Handle account deletion
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/api/admin/accounts/${id}`);
            message.success('Xóa tài khoản thành công');
            fetchAccounts();
        } catch (error) {
            message.error('Không thể xóa tài khoản');
        }
    };

    // Handle account status toggle
    const handleToggleStatus = async (account) => {
        try {
            await axiosInstance.put(`/api/admin/accounts/${account.id}/toggle-status`);
            message.success(`Tài khoản đã được ${account.active ? 'vô hiệu hóa' : 'kích hoạt'}`);
            fetchAccounts();
        } catch (error) {
            message.error('Không thể thay đổi trạng thái tài khoản');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <span className={active ? 'status-active' : 'status-inactive'}>
                    {active ? 'Hoạt động' : 'Vô hiệu'}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                record.username !== 'Admin' && (
                    <div className="action-buttons">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            className="action-button edit-button"
                            onClick={() => {
                                setSelectedAccount(record);
                                form.setFieldsValue(record);
                                setModalVisible(true);
                            }}
                        />
                        <Button
                            type={record.active ? 'danger' : 'success'}
                            icon={record.active ? <StopOutlined /> : <CheckCircleOutlined />}
                            className={`action-button ${record.active ? 'disable-button' : 'enable-button'}`}
                            onClick={() => handleToggleStatus(record)}
                        />
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            className="action-button delete-button"
                            onClick={() => handleDelete(record.id)}
                        />
                    </div>
                )
            ),
        },
    ];

    return (
        <div className="account-management">
            <h2>Quản lý tài khoản</h2>
            <Table
                loading={loading}
                dataSource={accounts}
                columns={columns}
                rowKey="id"
            />

            <Modal
                title="Chỉnh sửa tài khoản"
                open={modalVisible}
                onOk={() => form.submit()}
                onCancel={() => setModalVisible(false)}
            >
                <Form
                    form={form}
                    onFinish={handleUpdate}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Vui lòng nhập username' }]}
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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select>
                            <Option value="USER">User</Option>
                            <Option value="PROVIDER">Provider</Option>
                            <Option value="SALESPERSON">Salesperson</Option>
                            <Option value="ADMIN">Admin</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AccountManagement;
