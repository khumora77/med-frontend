import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Card,
  Alert,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "../../service/api";

const { TextArea } = Input;
const { Option } = Select;

interface CreateMedicalRecordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId: string;
}

interface MedicalRecordFormData {
  type: "diagnosis" | "treatment" | "note";
  description: string;
  prescription?: string;
}

export const CreateMedicalRecordModal: React.FC<CreateMedicalRecordModalProps> = ({
  open,
  onClose,
  onSuccess,
  patientId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: MedicalRecordFormData) => {
    setLoading(true);
    setError(null);

    try {
      // DTO ga to‘liq mos JSON
      const payload = {
        type: values.type,
        description: values.description,
        prescription: values.prescription,
      };

      console.log("Creating medical record:", payload);
      await api.post(`/patients/${patientId}/records`, payload);

      message.success("Medical record created successfully");
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error creating medical record:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to create medical record";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setError(null);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          Create Medical Record
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
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

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: "diagnosis",
        }}
      >
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            name="type"
            label="Record Type"
            rules={[{ required: true, message: "Please select record type" }]}
          >
            <Select placeholder="Select record type">
              <Option value="diagnosis">Diagnosis</Option>
              <Option value="treatment">Treatment</Option>
              <Option value="note">General Note</Option>
            </Select>
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter description" },
              { min: 3, message: "Description must be at least 3 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe diagnosis, treatment, or notes..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item name="prescription" label="Prescription (optional)">
            <Input
              placeholder="Enter prescription details..."
              maxLength={200}
            />
          </Form.Item>
        </Card>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ float: "right" }}>
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              Create Record
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
