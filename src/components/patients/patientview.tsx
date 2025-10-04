import React from 'react';
import { Modal, Descriptions, Typography } from 'antd';
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
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'child': return 'Child';
      default: return gender;
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
      title={`Patient information: ${patient?.firstName} ${patient?.lastName}`}
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
          <Descriptions.Item label="Name" span={1}>
            {patient.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name" span={1}>
            {patient.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {patient.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Number" span={1}>
            {patient.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Gender" span={1}>
            {getGenderText(patient.gender)}
          </Descriptions.Item>
          <Descriptions.Item label="Date added" span={2}>
            {formatDate(patient.createdAt)}
          </Descriptions.Item>
          {patient.notes && (
            <Descriptions.Item label="Note" span={2}>
              {patient.notes}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
};