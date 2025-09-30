// components/UsersList.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Select,
  Input,
  message,
  Tooltip,
  Alert,
  Popconfirm,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';

import { UserEditModal } from './userEdit';
import { useUserStore } from '../../store/user-store';
import type { User } from '../../types/userType';
import { CreateUserForm } from './create-user';


const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

export const UsersList: React.FC = () => {
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    deleteUser,
    setFilters,
    setError
  } = useUserStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value, page: 1 };
    setFilters(newFilters);
    // Backend search bo'lsa shu yerda fetchUsers(newFilters) chaqiramiz
  };

  const handleRoleFilter = (value: string) => {
    const newFilters = { ...filters, role: value, page: 1 };
    setFilters(newFilters);
  };

  const handleStatusFilter = (value: string) => {
    const newFilters = { ...filters, status: value, page: 1 };
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleDelete = async (user: User) => {
    try {
      const success = await deleteUser(user.id);
      if (success) {
        message.success('Foydalanuvchi muvaffaqiyatli o\'chirildi');
      }
    } catch (error) {
      // Error store orqali avtomatik handle qilinadi
    }
  };

  const handleUpdateSuccess = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
    message.success('Foydalanuvchi muvaffaqiyatli yangilandi');
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    message.success('Foydalanuvchi muvaffaqiyatli yaratildi');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'doctor': return 'blue';
      case 'reception': return 'green';
      case 'user': return 'gray';
      default: return 'default';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'doctor': return 'Doctor';
      case 'reception': return 'Reception';
      case 'user': return 'User';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'banned': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Faol';
      case 'inactive': return 'Nofaol';
      case 'banned': return 'Bloklangan';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('uz-UZ');
    } catch {
      return '-';
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Ism',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (firstName: string, record: User) => (
        <span>
          {firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {getRoleText(role)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Yaratilgan',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: formatDate,
    },
    {
      title: 'Harakatlar',
      key: 'actions',
      width: 120,
      render: (record: User) => (
        <Space>
          <Tooltip title="Tahrirlash">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          
          <Popconfirm
            title="Foydalanuvchini o'chirish"
            description="Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record)}
            okText="Ha"
            cancelText="Yo'q"
            okType="danger"
          >
            <Tooltip title="O'chirish">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <span>Foydalanuvchilar Boshqaruvi</span>
          {users.length > 0 && (
            <Tag color="blue">Jami: {users.length}</Tag>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Yangilash
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Yangi Foydalanuvchi
          </Button>
        </Space>
      }
    >
      {error && (
        <Alert
          message="Xatolik"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Qidirish..."
          onSearch={handleSearch}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          placeholder="Role"
          style={{ width: 140 }}
          onChange={handleRoleFilter}
          value={filters.role}
          allowClear
        >
          <Option value="admin">Admin</Option>
          <Option value="doctor">Doctor</Option>
          <Option value="reception">Reception</Option>
          <Option value="user">User</Option>
        </Select>
        <Select
          placeholder="Status"
          style={{ width: 140 }}
          onChange={handleStatusFilter}
          value={filters.status}
          allowClear
        >
          <Option value="active">Faol</Option>
          <Option value="inactive">Nofaol</Option>
          <Option value="banned">Bloklangan</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={users || []}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} dan ${total} ta`,
        }}
        scroll={{ x: 800 }}
        locale={{
          emptyText: loading ? 'Yuklanmoqda...' : 'Ma\'lumot topilmadi'
        }}
      />

      <CreateUserForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      <UserEditModal
        visible={editModalVisible}
        user={selectedUser}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
        }}
        onSuccess={handleUpdateSuccess}
      />
    </Card>
  );
};