import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
} from 'antd';
import {
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons';

interface AppointmentViewModalProps {
  visible: boolean;
  appointment: any;
  onCancel: () => void;
  onEdit?: () => void;
}

export const AppointmentViewModal: React.FC<AppointmentViewModalProps> = ({
  visible,
  appointment,
  onCancel,
  onEdit,
}) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
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

  if (!appointment) return null;

  return (
    <Modal
      title="Appointment Details"
      open={visible}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Close
          </Button>
          {onEdit && (
            <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
              Edit
            </Button>
          )}
        </Space>
      }
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Appointment ID" span={1}>
          {appointment.id}
        </Descriptions.Item>
        
        <Descriptions.Item label="Status" span={1}>
          <Tag color={getStatusColor(appointment.status)}>
            {appointment.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Patient" span={2}>
          <strong>
            {appointment.patient?.firstName} {appointment.patient?.lastName}
          </strong>
          <br />
          Phone: {appointment.patient?.phone}
          {appointment.patient?.email && (
            <>
              <br />
              Email: {appointment.patient?.email}
            </>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Doctor" span={2}>
          <strong>
            Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
          </strong>
          <br />
          Specialization: {appointment.doctor?.specialization}
        </Descriptions.Item>

        <Descriptions.Item label="Appointment Date" span={1}>
          {formatDate(appointment.appointmentDate)}
        </Descriptions.Item>

        <Descriptions.Item label="Duration" span={1}>
          {appointment.duration} minutes
        </Descriptions.Item>

        <Descriptions.Item label="Type" span={1}>
          <Tag color={getTypeColor(appointment.type)}>
            {appointment.type?.replace('-', ' ').toUpperCase()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created At" span={1}>
          {formatDate(appointment.createdAt)}
        </Descriptions.Item>

        {appointment.notes && (
          <Descriptions.Item label="Notes" span={2}>
            {appointment.notes}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};