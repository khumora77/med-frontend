// components/PatientsList.tsx
import React, { useState, useEffect } from "react";
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
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { PatientEditModal } from "./patientEdit";
import { CreatePatientForm } from "./create-patient";
import { PatientViewModal } from "./patientview";
import { usePatientStore } from "../../store/patientStore";

const { Option } = Select;
const { Search } = Input;
const { Text } = Typography;

export const PatientsList: React.FC = () => {
  const {
    patients,
    loading,
    error,
    pagination,
    filters,
    fetchPatients,
    deletePatient,
    updatePatient,
    setFilters,
    clearError,
    resetFilters,
  } = usePatientStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetchPatients(filters);
  }, []);

  const handleSearch = (value: string) => {
    const newFilters = {
      ...filters,
      search: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
    fetchPatients(newFilters);
  };

  const handleGenderFilter = (value: string) => {
    const newFilters = {
      ...filters,
      gender: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
    fetchPatients(newFilters);
  };

  const handleStatusFilter = (value: string) => {
    const newFilters = {
      ...filters,
      status: value || undefined,
      page: 1,
    };
    setFilters(newFilters);
    fetchPatients(newFilters);
  };

  const handleRefresh = () => {
    fetchPatients(filters);
  };

  const handleClearFilters = () => {
    resetFilters();
    fetchPatients({ page: 1, limit: 10 });
  };

  const handleEdit = (patient: any) => {
    setSelectedPatient(patient);
    setEditModalVisible(true);
  };

  const handleView = (patient: any) => {
    setSelectedPatient(patient);
    setViewModalVisible(true);
  };

  const handleDelete = async (patient: any) => {
    try {
      const success = await deletePatient(patient.id);
      if (success) {
        message.success("Bemor muvaffaqiyatli o'chirildi");
      }
    } catch (error) {
      // Error store orqali avtomatik handle qilinadi
    }
  };

  const handleUpdateSuccess = () => {
    setEditModalVisible(false);
    setSelectedPatient(null);
    fetchPatients(filters);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    fetchPatients(filters);
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "blue";
      case "female":
        return "pink";
      case "child":
        return "green";
      default:
        return "default";
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male":
        return "Erkak";
      case "female":
        return "Ayol";
      case "child":
        return "Bola";
      default:
        return gender;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "orange";
      case "archived":
        return "gray";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Faol";
      case "inactive":
        return "Nofaol";
      case "archived":
        return "Arxivlangan";
      default:
        return status;
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

  const formatPhone = (phone: string) => {
    if (!phone) return "-";
    return phone;
  };

  const hasActiveFilters = () => {
    return !!(filters.search || filters.gender || filters.status);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (id: string) => <Text type="secondary">#{id?.slice(0, 6)}</Text>,
    },
    {
      title: "Ism Familiya",
      dataIndex: "firstName",
      key: "name",
      render: (firstName: string, record: any) => (
        <Button
          type="link"
          onClick={() => handleView(record)}
          style={{ padding: 0, height: "auto" }}
        >
          <Text strong>
            {firstName} {record.lastName}
          </Text>
        </Button>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      render: formatPhone,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Jinsi",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <Tag color={getGenderColor(gender)}>{getGenderText(gender)}</Tag>
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
      title: "Qo'shilgan sana",
      dataIndex: "createdAt",
      key: "createdAt",
      render: formatDate,
    },
    {
      title: "Harakatlar",
      key: "actions",
      width: 140,
      fixed: "right" as const,
      render: (record: any) => (
        <Space>
          <Tooltip title="Ko'rish">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Tahrirlash">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>

          <Popconfirm
            title="Bemorni o'chirish"
            description="Haqiqatan ham bu bemorni o'chirmoqchimisiz?"
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

  if (loading && patients.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Bemorlar yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Bemorlar Boshqaruvi</span>
          {patients.length > 0 && (
            <Tag color="blue">Jami: {pagination.total || patients.length}</Tag>
          )}
          {hasActiveFilters() && <Tag color="orange">Filtrlar qo'llangan</Tag>}
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
            <Button onClick={handleClearFilters}>Filtrlarni tozalash</Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Yangi Bemor
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
            placeholder="Ism, familiya yoki email bo'yicha qidirish..."
            onSearch={handleSearch}
            allowClear
            enterButton
          />
        </Col>
        <Col xs={12} sm={6} md={5} lg={4}>
          <Select
            placeholder="Jinsi"
            style={{ width: "100%" }}
            onChange={handleGenderFilter}
            value={filters.gender}
            allowClear
          >
            <Option value="male">Erkak</Option>
            <Option value="female">Ayol</Option>
            <Option value="child">Bola</Option>
          </Select>
        </Col>
        <Col xs={12} sm={6} md={5} lg={4}>
          <Select
            placeholder="Status"
            style={{ width: "100%" }}
            onChange={handleStatusFilter}
            value={filters.status}
            allowClear
          >
            <Option value="active">Faol</Option>
            <Option value="inactive">Nofaol</Option>
            <Option value="archived">Arxivlangan</Option>
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={patients}
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
            fetchPatients(newFilters);
          },
        }}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: loading ? "Yuklanmoqda..." : "Bemor topilmadi",
        }}
      />

      <CreatePatientForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        isModal={true}
      />

      <PatientEditModal
        visible={editModalVisible}
        patient={selectedPatient}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedPatient(null);
        }}
        onSuccess={handleUpdateSuccess}
        onUpdatePatient={updatePatient}
      />

      <PatientViewModal
        visible={viewModalVisible}
        patient={selectedPatient}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedPatient(null);
        }}
      />
    </Card>
  );
};
