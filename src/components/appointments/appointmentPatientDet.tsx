import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Alert,
  Spin,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAppointmentStore } from "../../store/appointmentStore";
import { AppointmentViewModal } from "./appointmentView";
import { CreateAppointmentForm } from "./create-appointments";
import { handleDelete } from "../constants";



export const PatientAppointmentsPage: React.FC = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    error,
    pagination,
    fetchAppointments,
    deleteAppointment,
    updateAppointmentStatus,
  } = useAppointmentStore();

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Fetch appointments for this patient
  useEffect(() => {
    if (patientId) {
      fetchAppointments({ patientId, page: 1, limit: 10 });
    }
  }, [patientId]);

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setViewModalVisible(true);
  };

  const handleDeleteAppointment = async (appointment: any) => {
    handleDelete({
      id: appointment.id,
      deleteFn: deleteAppointment,
      successMessage: "Appointment successfully deleted",
      errorMessage: "Failed to delete appointment",
      onSuccess: () => fetchAppointments({ patientId, page: 1, limit: 10 }),
    });
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const success = await updateAppointmentStatus(appointmentId, newStatus);
      if (success) {
        message.success("Status updated successfully");
        fetchAppointments({ patientId, page: 1, limit: 10 });
      }
    } catch {
      message.error("Failed to update status");
    }
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    fetchAppointments({ patientId, page: 1, limit: 10 });
  };

  // Helpers
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "no-show":
        return "orange";
      case "pending":
        return "gold";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "consultation":
        return "purple";
      case "checkup":
        return "cyan";
      case "surgery":
        return "volcano";
      case "follow-up":
        return "gold";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>{type?.toUpperCase() || "UNKNOWN"}</Tag>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (doctor: any) =>
        doctor ? `Dr. ${doctor.firstname} ${doctor.lastname}` : "-",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewAppointment(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Appointment"
            onConfirm={() => handleDeleteAppointment(record)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete">
              <Button type="link" danger icon={<DeleteOutlined />} size="small" />
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
    <div style={{ padding: 24 }}>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/patients/${patientId}`)}>
          Back to Patient Detail
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          New Appointment
        </Button>
      </Space>

      <Card
        title={
          <Space>
            <CalendarOutlined />
            <span>Appointments for Patient #{patientId}</span>
            {appointments.length > 0 && (
              <Tag color="blue">Total: {appointments.length}</Tag>
            )}
          </Space>
        }
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, limit) =>
              fetchAppointments({ patientId, page, limit }),
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: loading ? (
              <Spin size="large" />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No appointments found"
              />
            ),
          }}
        />
      </Card>

      {/* Modals */}
      <AppointmentViewModal
        visible={viewModalVisible}
        appointment={selectedAppointment}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedAppointment(null);
        }}
        onStatusChange={handleStatusChange}
      />

      <CreateAppointmentForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        initialPatientId={patientId!}
      />
    </div>
  );
};
