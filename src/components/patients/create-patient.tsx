import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Space,
  message,
  Card,
  Alert,
  Grid,
  Typography,
} from "antd";
import { api } from "../../service/api";

const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

interface PatientFormData {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  notes: string;
  phone: string;
}

interface CreatePatientFormProps {
  visible?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "child", label: "Child" },
];

export const CreatePatientForm: React.FC<CreatePatientFormProps> = ({
  visible = true,
  onCancel,
  onSuccess,
  isModal = false,
}) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (values: PatientFormData) => {
    setLoading(true);
    setMsg(null);
    setErr(null);

    try {
      const { data } = await api.post("/patients", values);
      
      console.log("The patient added:", data);
      message.success(`The patient added: ${data.firstName} ${data.lastName}`);
      
      form.resetFields();
      setMsg(`The patient added: ${data.firstName} ${data.lastName}`);
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Error:", error);
      
      let errorMessage = "There was an error adding a patient";
      
      if (error.response?.status === 403) {
        errorMessage = "You do not have permission to add patients";
      } else if (error.response?.status === 409) {
        errorMessage = "A patient with this email or phone number already exists";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "Could not connect to the server. Check your internet connection";
      }
      
      setErr(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMsg(null);
    setErr(null);
    if (onCancel) {
      onCancel();
    }
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={loading}
      size="large"
    >
      <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
        <Form.Item
          name="firstName"
          label="First name"
          rules={[{ required: true, message: "You must enter a name" }]}
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder="Patient Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last name"
          rules={[{ required: true, message: "You must enter a surname" }]}
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder="Patient Surname" />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "Please enter the correct email format" },
        ]}
        style={{ marginBottom: 16 }}
      >
        <Input placeholder="patient@example.com" />
      </Form.Item>

      <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
        <Form.Item
          name="phone"
          label="Phone Number"
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder="+998 XX XXX-XX-XX" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Select placeholder="Select gender">
            {GENDER_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        name="notes"
        label="Note"
        style={{ marginBottom: 24 }}
      >
        <TextArea 
          placeholder="Additional information about the patient..." 
          rows={3}
        />
      </Form.Item>

      {(msg || err) && (
        <Alert
          message={msg || err}
          type={msg ? "success" : "error"}
          showIcon
          closable
          style={{ marginBottom: 16 }}
          onClose={() => {
            setMsg(null);
            setErr(null);
          }}
        />
      )}

      <Form.Item style={{ marginBottom: 0 }}>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          {isModal && (
            <Button
              onClick={handleCancel}
              disabled={loading}
              size="large"
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            {loading ? "Joining..." : "Add patient"}
          </Button>
        </Space>
      </Form.Item>

      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
      Fields marked with * are required
      </Typography.Text>
    </Form>
  );

  if (isModal) {
    return (
      <Modal
        title="Add New Patient"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        forceRender
        styles={{
          body: {
            paddingTop: 16,
          }
        }}
      >
        {formContent}
      </Modal>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "24px 16px",
      }}
    >
      <Card
        title={
          <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
           Add new patient
          </Typography.Title>
        }
        style={{
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        headStyle={{
          backgroundColor: "#1890ff",
          color: "white",
          padding: "16px 24px",
          border: "none",
        }}
        bodyStyle={{
          padding: 24,
        }}
      >
        {formContent}
      </Card>
    </div>
  );
};

export default CreatePatientForm;