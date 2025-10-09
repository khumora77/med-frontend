// components/PatientDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  Button, 
  Spin, 
  Alert, 
  Descriptions, 
  Tag, 
  Typography, 
  Tabs,
  Table,
  Space,
  message,
  Popconfirm,
  Tooltip
} from "antd";
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  EyeOutlined,
  DeleteOutlined,
  CalendarOutlined,
  PlusOutlined 
} from "@ant-design/icons";
import { usePatientStore } from "../../store/patientStore";
import { useAppointmentStore } from "../../store/appointmentStore";
import { AppointmentViewModal } from "../appointments/appointmentView";
import { CreateAppointmentForm } from "../appointments/create-appointments";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    patients, 
    loading: patientLoading, 
    error: patientError, 
    fetchPatients,
    deletePatient 
  } = usePatientStore();
  
  const {
    appointments,
    loading: appointmentLoading,
    error: appointmentError,
    pagination,
    fetchAppointments,
    deleteAppointment,
    updateAppointmentStatus
  } = useAppointmentStore();

  const [patient, setPatient] = useState<any>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (id) {
      // Patient ma'lumotlarini olish
      const existingPatient = patients.find(p => p.id === id);
      if (existingPatient) {
        setPatient(existingPatient);
      } else {
        fetchPatients({ search: id, limit: 1 });
      }

      // Patientning appointmentlarini olish
      fetchAppointments({ patientId: id, page: 1, limit: 10 });
    }
  }, [id, patients]);

  useEffect(() => {
    // Yangi patient topilsa set qilish
    if (id && patients.length > 0) {
      const foundPatient = patients.find(p => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
      }
    }
  }, [patients, id]);

  const handleDeletePatient = async () => {
    if (!patient) return;
    
    try {
      const success = await deletePatient(patient.id);
      if (success) {
        message.success("Patient successfully deleted");
        navigate("/patients");
      }
    } catch (error) {
      message.error("Failed to delete patient");
    }
  };

  const handleDeleteAppointment = async (appointment: any) => {
    try {
      const success = await deleteAppointment(appointment.id);
      if (success) {
        message.success("Appointment successfully deleted");
        fetchAppointments({ patientId: id, page: 1, limit: 10 });
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
        fetchAppointments({ patientId: id, page: 1, limit: 10 });
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setViewModalVisible(true);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    fetchAppointments({ patientId: id, page: 1, limit: 10 });
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "male": return "blue";
      case "female": return "pink";
      case "child": return "green";
      default: return "default";
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male": return "Male";
      case "female": return "Female";
      case "child": return "Child";
      default: return gender;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "blue";
      case "completed": return "green";
      case "cancelled": return "red";
      case "no-show": return "orange";
      default: return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation": return "purple";
      case "checkup": return "cyan";
      case "surgery": return "volcano";
      case "follow-up": return "gold";
      default: return "default";
    }
  };
    const calculateDuration = (startAt: string, endAt: string) => {
    if (!startAt || !endAt) return 0;
    const start = new Date(startAt);
    const end = new Date(endAt);
    return Math.round((end.getTime() - start.getTime()) / 60000);
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

  // Appointments jadvali uchun columnlar
  const appointmentColumns = [
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (record: any) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewAppointment(record)}
              size="small"
            />
          </Tooltip>

          <Popconfirm
            title="Delete Appointment"
            description="Are you sure you want to delete this appointment?"
            onConfirm={() => handleDeleteAppointment(record)}
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

  if (patientLoading && !patient) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading patient details...</div>
      </div>
    );
  }

  if (patientError) {
    return (
      <Alert
        message="Error"
        description={patientError}
        type="error"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  if (!patient) {
    return (
      <Alert
        message="Patient not found"
        description={`Patient with ID ${id} not found.`}
        type="warning"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/patients")}
        >
          Back to Patients List
        </Button>
        
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            New Appointment
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/patients/edit`)}
          >
            Edit Patient
          </Button>
          <Popconfirm
            title="Delete Patient"
            description="Are you sure you want to delete this patient? All appointments will also be deleted."
            onConfirm={handleDeletePatient}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete Patient
            </Button>
          </Popconfirm>
        </Space>
      </Space>

      <Card>
        <Title level={2}>
          {patient.firstName} {patient.lastName}
          <Tag color={getGenderColor(patient.gender)} style={{ marginLeft: 8 }}>
            {getGenderText(patient.gender)}
          </Tag>
        </Title>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Patient Information" key="info">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Patient ID">
                {patient.id}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                <Tag color={getGenderColor(patient.gender)}>
                  {getGenderText(patient.gender)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {patient.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {patient.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Date Added">
                {formatDate(patient.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(patient.updatedAt)}
              </Descriptions.Item>
              {patient.notes && (
                <Descriptions.Item label="Medical Notes" span={2}>
                  {patient.notes}
                </Descriptions.Item>
              )}
            </Descriptions>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <CalendarOutlined />
                Appointments ({appointments.length})
              </span>
            } 
            key="appointments"
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                Showing {appointments.length} appointments for this patient
              </Text>
            </div>

            {appointmentError && (
              <Alert
                message="Error"
                description={appointmentError}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Table
              columns={appointmentColumns}
              dataSource={appointments}
              rowKey="id"
              loading={appointmentLoading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} appointments`,
                onChange: (page, pageSize) => {
                  fetchAppointments({ 
                    patientId: id, 
                    page, 
                    limit: pageSize 
                  });
                },
              }}
              scroll={{ x: 800 }}
              locale={{
                emptyText: appointmentLoading ? "Loading..." : "No appointments found for this patient",
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

     
      <AppointmentViewModal
        visible={viewModalVisible}
        appointment={selectedAppointment}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedAppointment(null);
        }}
      />

      <CreateAppointmentForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
        initialPatientId={patient.id}
      />
    </div>
  );
};