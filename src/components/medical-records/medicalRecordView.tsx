// src/components/medical-records/MedicalRecordViewModal.tsx
import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Typography,
  Button,
  Space,
  Card
} from 'antd';
import { 
  FileTextOutlined, 
  UserOutlined, 
  CalendarOutlined,
  MedicineBoxOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface MedicalRecordViewModalProps {
  visible: boolean;
  record: any;
  onCancel: () => void;
}

export const MedicalRecordViewModal: React.FC<MedicalRecordViewModalProps> = ({
  visible,
  record,
  onCancel
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
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

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "-";
    }
  };

  if (!record) return null;

  return (
    <Modal
      title="Medical Record Details"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>
      ]}
      width={800}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Diagnosis Card */}
        <Card 
          title={
            <Space>
              <MedicineBoxOutlined />
              <Text strong>Diagnosis</Text>
            </Space>
          }
          size="small"
        >
          <Text>{record.diagnosis || "No diagnosis provided"}</Text>
        </Card>

        {/* Treatment Card */}
        {record.treatment && (
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                <Text strong>Treatment Plan</Text>
              </Space>
            }
            size="small"
          >
            <Text>{record.treatment}</Text>
          </Card>
        )}

        {/* Additional Notes */}
        {record.notes && (
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                <Text strong>Additional Notes</Text>
              </Space>
            }
            size="small"
          >
            <Text>{record.notes}</Text>
          </Card>
        )}

        {/* Information */}
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Doctor">
            <Space>
              <UserOutlined />
              <Text>
                {record.doctor ? 
                  `Dr. ${record.doctor.firstname} ${record.doctor.lastname}` : 
                  "Unknown Doctor"
                }
              </Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Follow-up Date">
            <Space>
              <CalendarOutlined />
              <Text>
                {record.followUpDate ? formatShortDate(record.followUpDate) : "Not scheduled"}
              </Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Created Date">
            <Space>
              <CalendarOutlined />
              <Text>{formatDate(record.createdAt)}</Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Last Updated">
            <Space>
              <CalendarOutlined />
              <Text>{formatDate(record.updatedAt)}</Text>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Modal>
  );
};