// components/PatientsList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <- qo'shing
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
  EyeOutlined,
} from "@ant-design/icons";

import { PatientEditModal } from "./patientEdit";
import { CreatePatientForm } from "./create-patient";
import { PatientViewModal } from "./patientview";
import { usePatientStore } from "../../store/patientStore";
import PatientSearch from "./patient-Search";

const { Text } = Typography;

export const PatientsList: React.FC = () => {
  const navigate = useNavigate();
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

  
  const handleNameClick = (patient: any) => {
    navigate(`/patients/${patient.id}`);
  };

  const handleDelete = async (patient: any) => {
    try {
      const success = await deletePatient(patient.id);
      if (success) {
        message.success("Patient successfully discharged");
      }
    } catch (error) {
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
        return "Male";
      case "female":
        return "Female";
      case "child":
        return "Child";
      default:
        return gender;
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
    return !!(filters.search || filters.gender);
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
      title: "Name",
      dataIndex: "firstName",
      key: "name",
      render: (firstName: string, record: any) => (
        <Button
          type="link"
          onClick={() => handleNameClick(record)} // <- o'zgartirildi
          style={{ padding: 0, height: "auto" }}
        >
          <Text strong>
            {firstName} {record.lastName}
          </Text>
        </Button>
      ),
    },
    {
      title: "Number",
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
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <Tag color={getGenderColor(gender)}>{getGenderText(gender)}</Tag>
      ),
    },

    {
      title: "Date added",
      dataIndex: "createdAt",
      key: "createdAt",
      render: formatDate,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: "right" as const,
      render: (record: any) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>

          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>

          <Popconfirm
            title="Patient remova"
            description="Do you really want to delete this patient?"
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

  if (loading && patients.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading patients...</div>
      </div>
    );
  }

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>Patient Management</span>
          {patients.length > 0 && (
            <Tag color="blue">All: {pagination.total || patients.length}</Tag>
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
            New Patient
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

      <PatientSearch />
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
          emptyText: loading ? "Loading..." : "Patient not founded",
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