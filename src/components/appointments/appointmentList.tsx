
import { useAppointmentStore } from "../../store/appointmentStore";
import { AppointmentEditModal } from "./appointmentEdit";
import { CreateAppointmentForm } from "./create-appointments";
import { AppointmentViewModal } from "./appointmentView";
import { AppointmentSearch } from "./appointmentSearch";
// components/appointments/AppointmentsList.tsx
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
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";


const { Text } = Typography;
const { Option } = Select;

export const AppointmentsList: React.FC = () => {
  const {
    appointments,
    loading,
    error,
    pagination,
    filters,
    fetchAppointments,
    deleteAppointment,
    updateAppointmentStatus,
    setFilters,
    clearError,
    resetFilters,
  } = useAppointmentStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    fetchAppointments(filters);
  }, []);

  const handleRefresh = () => {
    fetchAppointments(filters);
  };

  const handleClearFilters = () => {
    resetFilters();
    fetchAppointments({ page: 1, limit: 10 });
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setEditModalVisible(true);
  };

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment);
    setViewModalVisible(true);
  };

  const handleDelete = async (appointment: any) => {
    try {
      const success = await deleteAppointment(appointment.id);
      if (success) {
        message.success("Appointment successfully deleted");
        fetchAppointments(filters);
      }
    } catch (error) {
      message.error("Failed to delete appointment");
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const success = await updateAppointmentStatus(appointmentId, newStatus);
      if (success) {
        message.success("Status updated successfully");
        fetchAppointments(filters);
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleUpdateSuccess = () => {
    setEditModalVisible(false);
    setSelectedAppointment(null);
    fetchAppointments(filters);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    fetchAppointments(filters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "no-show":
        return "orange";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("uz-UZ", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "-";
    }
  };

  const calculateDuration = (startAt: string, endAt: string) => {
    if (!startAt || !endAt) return 0;
    const start = new Date(startAt);
    const end = new Date(endAt);
    return Math.round((end.getTime() - start.getTime()) / 60000);
  };

  const hasActiveFilters = () => {
    return !!(filters.patientId || filters.doctorId || filters.status || filters.startDate);
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      render: (patient: any) => (
        <Text strong>
          {patient?.firstName} {patient?.lastName}
        </Text>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (doctor: any) => (
        <Text>
          Dr. {doctor?.firstname} {doctor?.lastname}
        </Text>
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startAt",
      key: "startAt",
      render: formatDate,
    },
    {
      title: "End Time",
      dataIndex: "endAt",
      key: "endAt",
      render: formatDate,
    },
    {
      title: "Duration",
      key: "duration",
      render: (record: any) => {
        const duration = calculateDuration(record.startAt, record.endAt);
        return `${duration} min`;
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => reason || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
          size="small"
        >
          <Option value="scheduled">Scheduled</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
          <Option value="no-show">No Show</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
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
            title="Delete Appointment"
            description="Are you sure you want to delete this appointment?"
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

  if (loading && appointments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading appointments...</div>
      </div>
    );
  }

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined />
          <span>Appointment Management</span>
          {appointments.length > 0 && (
            <Tag color="blue">Total: {pagination.total || appointments.length}</Tag>
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
            Refresh
          </Button>
          {hasActiveFilters() && (
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            New Appointment
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

      <AppointmentSearch />
      
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            const newFilters = { ...filters, page, limit: pageSize };
            setFilters(newFilters);
            fetchAppointments(newFilters);
          },
        }}
        scroll={{ x: 1200 }}
        locale={{
          emptyText: loading ? "Loading..." : "No appointments found",
        }}
      />

      <CreateAppointmentForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      <AppointmentEditModal
        visible={editModalVisible}
        appointment={selectedAppointment}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleUpdateSuccess}
      />

      <AppointmentViewModal
        visible={viewModalVisible}
        appointment={selectedAppointment}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedAppointment(null);
        }}
      />
    </Card>
  );
};