import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Space, message } from "antd";
import { useUserStore } from "../../store/user-store";

const { Option } = Select;

interface CreateUserFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { createUser, loading } = useUserStore();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const userData = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        temporaryPassword: values.temporaryPassword,
      };

      const success = await createUser(userData);
      if (success) {
        message.success("User created successfully");
        form.resetFields();
        onSuccess();
      } else {
        message.error("Error creating user");
      }
    } catch (error) {
      message.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const generateTemporaryPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue("temporaryPassword", password);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Create a New User"
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
        initialValues={{ role: "doctor" }}
        disabled={submitting || loading}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "You must enter an email" },
            { type: "email", message: "Please enter the correct email format" },
          ]}
        >
          <Input placeholder="user@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "You must enter a name" }]}
        >
          <Input placeholder="User name" size="large" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "You must enter a last name" }]}
        >
          <Input placeholder="User lastname" size="large" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "It is necessary to choose a role" }]}
        >
          <Select placeholder="Select a role" size="large">
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="temporaryPassword"
          label="Temporary Password"
          rules={[{ required: true, message: "You must enter a password" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input.Password placeholder="Temporary password" size="large" />
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
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCancel}
              size="large"
              disabled={submitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting || loading}
              size="large"
            >
             Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateUserForm;