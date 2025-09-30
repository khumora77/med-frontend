// components/CreateUserForm.tsx
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, Space, message } from 'antd';
import { useUserStore } from '../../store/user-store';


const { Option } = Select;

interface CreateUserFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const { createUser, loading } = useUserStore();
  const [submitting, setSubmitting] = useState(false);
// components/CreateUserForm.tsx - submit funksiyasini yangilaymiz
const handleSubmit = async (values: any) => {
  setSubmitting(true);
  try {
    // Backendga mos data tayyorlaymiz
    const userData = {
      email: values.email,
      firstName: values.firstName, // Backend firstname ga o'tadi
      lastName: values.lastName,   // Backend lastname ga o'tadi
      role: values.role,
      temporaryPassword: values.temporaryPassword
    };

    const success = await createUser(userData);
    if (success) {
      message.success('Foydalanuvchi muvaffaqiyatli yaratildi');
      form.resetFields();
      onSuccess();
    } else {
      message.error('Foydalanuvchi yaratishda xatolik');
    }
  } catch (error) {
    message.error('Xatolik yuz berdi');
  } finally {
    setSubmitting(false);
  }
};

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue('temporaryPassword', password);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Yangi Foydalanuvchi Yaratish"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      forceRender 
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role: 'doctor' }}
        disabled={submitting || loading}
      >
        <Form.Item
          name="email"
          label="Email" 
          rules={[
            { required: true, message: 'Email kiritishingiz shart' },
            { type: 'email', message: 'To\'g\'ri email formatini kiriting' }
          ]}
        >
          <Input placeholder="user@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="Ism"
          rules={[{ required: true, message: 'Ism kiritishingiz shart' }]}
        >
          <Input placeholder="Foydalanuvchi ismi" size="large" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Familiya"
          rules={[{ required: true, message: 'Familiya kiritishingiz shart' }]}
        >
          <Input placeholder="Foydalanuvchi familiyasi" size="large" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Roleni tanlash shart' }]}
        >
          <Select placeholder="Roleni tanlang" size="large">
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
            <Option value="user">User</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="temporaryPassword"
          label="Vaqtincha Parol"
          rules={[{ required: true, message: 'Parol kiritishingiz shart' }]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input.Password 
              placeholder="Vaqtincha parol" 
              size="large"
            />
            <Button 
              type="default" 
              onClick={generateTemporaryPassword}
              size="large"
            >
              Avto Generate
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCancel} 
              size="large"
              disabled={submitting || loading}
            >
              Bekor qilish
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting || loading}
              size="large"
            >
              Yaratish
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};