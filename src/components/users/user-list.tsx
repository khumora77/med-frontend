import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  message,
  Tooltip,
  Alert,
  Popconfirm,
  Typography,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import { UserEditModal } from "./userEdit";
import { CreateUserForm } from "./create-user";
import { useUserStore } from "../../store/user-store";
import type { User } from "../../types/userType";
import UserSearch from "./user-Search";


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
    resetFilters,
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Faol";
      case "inactive":
        return "Nofaol";
      default:
        return status;
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
        message.success("User successfully deleted");
      }
    } catch (error) {}
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
      case "admin":
        return "red";
      case "doctor":
        return "blue";
      case "reception":
        return "green";
      case "user":
        return "gray";
      default:
        return "default";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "doctor":
        return "Doctor";
      case "reception":
        return "Reception";
      case "user":
        return "User";
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "orange";
      case "banned":
        return "red";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("uz-UZ");
    } catch {
      return "-";
    }
  };

  const hasActiveFilters = () => {
    return !!filters.search;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (id: string) => <Text type="secondary">#{id.slice(0, 8)}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (firstName: string, record: User) => (
        <Text strong>
          {firstName} {record.lastName}
        </Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{getRoleText(role)}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: formatDate,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (record: User) => (
        <Space>
          <Tooltip title="Editing">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete">
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
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading users...</div>
      </div>
    );
  }

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>User Management</span>
          {users.length > 0 && (
            <Tag color="blue">All: {pagination.total || users.length}</Tag>
          )}
          {hasActiveFilters() && <Tag color="orange">Filters applied</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Update
          </Button>
          {hasActiveFilters() && (
            <Button onClick={handleClearFilters}>Cleaning the filters</Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            New User
          </Button>
        </Space>
      }
    >
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={clearError}
          style={{ marginBottom: 16 }}
        />
      )}

      <UserSearch />
      <Table
        columns={columns}
        dataSource={Array.isArray(users) ? users : []}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current || 1,
          pageSize: pagination.pageSize || 10,
          total: pagination.total || 0,
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
          emptyText: loading ? "Loading..." : "Information not found",
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
const initialState = {
  filters: { page: 1, limit: 10 },
};
