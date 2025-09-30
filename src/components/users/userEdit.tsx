// components/UserEditModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { useUserStore } from '../../store/user-store';
import type { User } from '../../types/userType';

const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  visible,
  user,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const { updateUser, updateUserRole, updateUserStatus, loading } = useUserStore();

  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      });
    }
  }, [user, visible, form]);

  const handleSubmit = async (values: any) => {
    if (!user) return;

    try {
      const updateData: any = {};
      
      if (values.email !== user.email) updateData.email = values.email;
      if (values.firstName !== user.firstName) updateData.firstName = values.firstName;
      if (values.lastName !== user.lastName) updateData.lastName = values.lastName;
      if (values.role !== user.role) updateData.role = values.role;
      if (values.status !== user.status) updateData.status = values.status;

      if (Object.keys(updateData).length > 0) {
        const success = await updateUser(user.id, updateData);
        if (success) {
          message.success('Foydalanuvchi muvaffaqiyatli yangilandi');
          onSuccess();
        } else {
          message.error('Yangilashda xatolik');
        }
      } else {
        message.info('Hech qanday o\'zgartirish kiritilmadi');
      }
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleRoleChange = async (role: string) => {
    if (!user) return;
    
    try {
      const success = await updateUserRole(user.id, { role });
      if (success) {
        message.success('Role muvaffaqiyatli yangilandi');
        onSuccess();
      } else {
        message.error('Role yangilashda xatolik');
      }
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!user) return;
    
    try {
      const success = await updateUserStatus(user.id, { status });
      if (success) {
        message.success('Status muvaffaqiyatli yangilandi');
        onSuccess();
      } else {
        message.error('Status yangilashda xatolik');
      }
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`${user?.firstName} ${user?.lastName} ni tahrirlash`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email kiritishingiz shart' },
            { type: 'email', message: 'To\'g\'ri email formatini kiriting' }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="Ism"
          rules={[{ required: true, message: 'Ism kiritishingiz shart' }]}
        >
          <Input placeholder="Foydalanuvchi ismi" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Familiya"
          rules={[{ required: true, message: 'Familiya kiritishingiz shart' }]}
        >
          <Input placeholder="Foydalanuvchi familiyasi" />
        </Form.Item>

        <Form.Item name="role" label="Role">
          <Select onChange={handleRoleChange} placeholder="Roleni tanlang">
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
            <Option value="user">User</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select onChange={handleStatusChange} placeholder="Statusni tanlang">
            <Option value="active">Faol</Option>
            <Option value="inactive">Nofaol</Option>
            <Option value="banned">Bloklangan</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} disabled={loading}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Saqlash
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};