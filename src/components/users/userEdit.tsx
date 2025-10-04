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
      if (Object.keys(updateData).length > 0) {
        const success = await updateUser(user.id, updateData);
        if (success) {
          message.success('User updated successfully');
          onSuccess();
        } else {
          message.error('Update error');
        }
      } else {
        message.info('No changes made.');
      }
    } catch (error) {
      message.error('An error occurred.');
    }
  };

  const handleRoleChange = async (role: string) => {
    if (!user) return;
    
    try {
      console.log('🔍 Changing role to:', role);
      const roleData = { role };
      
      const success = await updateUserRole(user.id, roleData);
      if (success) {
        message.success('Role updated successfully');
        form.setFieldValue('role', role);
        onSuccess();
      } else {
        message.error('Error updating role');
        form.setFieldValue('role', user.role);
      }
    } catch (error) {
      message.error('An error occurred');
      form.setFieldValue('role', user.role);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!user) return;
    
    try {
      console.log('🔍 Changing status to:', status);
      const statusData = { status };
      
      const success = await updateUserStatus(user.id, statusData);
      if (success) {
        message.success('Status updated successfully');
        form.setFieldValue('status', status);
        onSuccess();
      } else {
        message.error('Error updating status');
        form.setFieldValue('status', user.status);
      }
    } catch (error) {
      message.error('An error occurred');
      form.setFieldValue('status', user.status);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`${user?.firstName} ${user?.lastName} edit`}
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
            { required: true, message: 'You must enter an email' },
            { type: 'email', message: 'Please enter the correct email format' }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'You must enter a name' }]}
        >
          <Input placeholder="User Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'You must enter a last name' }]}
        >
          <Input placeholder="User Lastname" />
        </Form.Item>

        <Form.Item name="role" label="Role">
          <Select 
            onChange={handleRoleChange} 
            placeholder="Select a role"
            disabled={loading}
          >
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select 
            onChange={handleStatusChange} 
            placeholder="Select a status"
            disabled={loading}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="blocked">Blocked</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} disabled={loading}>
            Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};