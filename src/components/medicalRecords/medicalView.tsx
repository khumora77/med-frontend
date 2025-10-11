// MedicalRecordViewModal.tsx
import React from "react";
import { Modal, Descriptions, Tag } from "antd";

type MedicalRecordViewModalProps = {
  visible: boolean;
  record: any | null;
  onCancel: () => void;
};

export const MedicalRecordViewModal: React.FC<MedicalRecordViewModalProps> = ({
  visible,
  record,
  onCancel,
}) => {
  if (!record) return null;

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "diagnosis":
        return "blue";
      case "treatment":
        return "green";
      case "note":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <Modal
      title="Medical Record Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={600}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Type">
          <Tag color={getTypeColor(record.type)}>{record.type}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Description">
          {record.description || "—"}
        </Descriptions.Item>

        <Descriptions.Item label="Prescription">
          {record.prescription || "—"}
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {record.createdAt ? new Date(record.createdAt).toLocaleString("uz-UZ") : "—"}
        </Descriptions.Item>

        {record.updatedAt && (
          <Descriptions.Item label="Last Updated">
            {new Date(record.updatedAt).toLocaleString("uz-UZ")}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};