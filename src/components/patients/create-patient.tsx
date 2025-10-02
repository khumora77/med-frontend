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
  { value: "male", label: "Erkak" },
  { value: "female", label: "Ayol" },
  { value: "child", label: "Bola" },
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
      
      console.log("Bemor qo'shildi:", data);
      message.success(`Bemor qo'shildi: ${data.firstName} ${data.lastName}`);
      
      form.resetFields();
      setMsg(`Bemor qo'shildi: ${data.firstName} ${data.lastName}`);
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Xatolik:", error);
      
      let errorMessage = "Bemor qo'shishda xatolik yuz berdi";
      
      if (error.response?.status === 403) {
        errorMessage = "Sizda bemor qo'shish uchun ruxsat yo'q";
      } else if (error.response?.status === 409) {
        errorMessage = "Bu email yoki telefon raqami bilan bemor allaqachon mavjud";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "Serverga ulanib bo'lmadi. Internet aloqasini tekshiring";
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
          label="Ism"
          rules={[{ required: true, message: "Ism kiritishingiz shart" }]}
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder="Bemor ismi" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Familiya"
          rules={[{ required: true, message: "Familiya kiritishingiz shart" }]}
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder="Bemor familiyasi" />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: "email", message: "To'g'ri email formatini kiriting" },
        ]}
        style={{ marginBottom: 16 }}
      >
        <Input placeholder="bemor@example.com" />
      </Form.Item>

      <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
        <Form.Item
          name="phone"
          label="Telefon raqami"
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Input placeholder="+998 XX XXX-XX-XX" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Jinsi"
          style={{ flex: 1, marginBottom: 16 }}
        >
          <Select placeholder="Jinsini tanlang">
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
        label="Izoh"
        style={{ marginBottom: 24 }}
      >
        <TextArea 
          placeholder="Bemor haqida qo'shimcha ma'lumot..." 
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
              Bekor qilish
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            {loading ? "Qo'shilyapti..." : "Bemor qo'shish"}
          </Button>
        </Space>
      </Form.Item>

      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        * belgisi bilan ko'rsatilgan maydonlar to'ldirilishi shart
      </Typography.Text>
    </Form>
  );

  if (isModal) {
    return (
      <Modal
        title="Yangi Bemor Qo'shish"
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
            Yangi bemor qo'shish
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