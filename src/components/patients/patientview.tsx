// components/PatientViewModal.tsx
import React from 'react';
import { Modal, Descriptions, Tag, Typography } from 'antd';
import type { Patient } from '../../types/patientsType';

const { Text } = Typography;

interface PatientViewModalProps {
  visible: boolean;
  patient: Patient | null;
  onCancel: () => void;
}

export const PatientViewModal: React.FC<PatientViewModalProps> = ({
  visible,
  patient,
  onCancel
}) => {
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return 'Erkak';
      case 'female': return 'Ayol';
      case 'child': return 'Bola';
      default: return gender;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'archived': return 'gray';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Faol';
      case 'inactive': return 'Nofaol';
      case 'archived': return 'Arxivlangan';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  return (
    <Modal
      title={`Bemor ma'lumotlari: ${patient?.firstName} ${patient?.lastName}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {patient && (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID" span={1}>
            <Text code>#{patient.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={1}>
            <Tag color={getStatusColor(patient.status)}>
              {getStatusText(patient.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ism" span={1}>
            {patient.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="Familiya" span={1}>
            {patient.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {patient.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Telefon" span={1}>
            {patient.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Jinsi" span={1}>
            {getGenderText(patient.gender)}
          </Descriptions.Item>
          <Descriptions.Item label="Qo'shilgan sana" span={2}>
            {formatDate(patient.createdAt)}
          </Descriptions.Item>
          {patient.notes && (
            <Descriptions.Item label="Izoh" span={2}>
              {patient.notes}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};