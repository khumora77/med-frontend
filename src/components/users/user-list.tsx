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
  Typography,
  Spin,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  FilterOutlined 
} from '@ant-design/icons';

import { UserEditModal } from './userEdit';
import { CreateUserForm } from './create-user';
import { useUserStore } from '../../store/user-store';
import type { User } from '../../types/userType';

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
    clearError,
    resetFilters
  } = useUserStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers(filters);
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

const handleSearch = (value: string) => {
  const newFilters = { 
    ...filters, 
    search: value || undefined, 
    page: 1 
  };
  setFilters(newFilters);
  fetchUsers(newFilters);
};

const handleRoleFilter = (value: string) => {
  const newFilters = { 
    ...filters, 
    role: value || undefined, 
    page: 1 
  };
  setFilters(newFilters);
  fetchUsers(newFilters);
};

const handleStatusFilter = (value: string) => {
  // Faqat active/inactive
  const newFilters = { 
    ...filters, 
    status: (value === 'active' || value === 'inactive') ? value : undefined, 
    page: 1 
  };
  setFilters(newFilters);
  fetchUsers(newFilters);
};

// Statusni ko'rsatish funksiyasini yangilaymiz
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Faol';
    case 'inactive': return 'Nofaol';
    default: return status;
  }
};

  const handleRefresh = () => {
    fetchUsers(filters);
  };

  const handleClearFilters = () => {
    resetFilters();
    fetchUsers(initialState.filters);
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
    fetchUsers(filters);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    fetchUsers(filters);
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


  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('uz-UZ');
    } catch {
      return '-';
    }
  };

  const hasActiveFilters = () => {
    return !!(filters.search || filters.role || filters.status);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id: string) => <Text type="secondary">#{id.slice(0, 8)}</Text>,
    },
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
        <Text strong>{firstName} {record.lastName}</Text>
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
      fixed: 'right' as const,
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

  if (loading && users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Foydalanuvchilar yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Foydalanuvchilar Boshqaruvi</span>
          {users.length > 0 && (
            <Tag color="blue">Jami: {pagination.total || users.length}</Tag>
          )}
          {hasActiveFilters() && (
            <Tag color="orange">Filtrlar qo'llangan</Tag>
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
          {hasActiveFilters() && (
            <Button
              onClick={handleClearFilters}
            >
              Filtrlarni tozalash
            </Button>
          )}
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
          onClose={clearError}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Email yoki ism bo'yicha qidirish..."
            onSearch={handleSearch}
            allowClear
            enterButton
          />
        </Col>
        <Col xs={12} sm={6} md={5} lg={4}>
          <Select
            placeholder="Role"
            style={{ width: '100%' }}
            onChange={handleRoleFilter}
            value={filters.role}
            allowClear
          >
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
            <Option value="user">User</Option>
          </Select>
        </Col>
        <Col xs={12} sm={6} md={5} lg={4}>
         <Select
  placeholder="Status bo'yicha filtrlash"
  style={{ width: 180 }}
  onChange={handleStatusFilter}
  value={filters.status}
  allowClear
>
  <Option value="active">Faol</Option>
  <Option value="inactive">Nofaol</Option>
  {/* <Option value="banned">Bloklangan</Option> - backend qo'llab-quvvatlamaydi */}
</Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={users}
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
          onChange: (page, pageSize) => {
            const newFilters = { ...filters, page, limit: pageSize };
            setFilters(newFilters);
            fetchUsers(newFilters);
          },
        }}
        scroll={{ x: 1000 }}
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

// Initial state for reset
const initialState = {
  filters: { page: 1, limit: 10 }
};