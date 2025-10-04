import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  notes: string;
  status: 'active' | 'inactive' | 'archived';
}

interface PatientEditModalProps {
  visible: boolean;
  patient: Patient | null;
  onCancel: () => void;
  onSuccess: () => void;
  onUpdatePatient: (patientId: string, updateData: any) => Promise<boolean>;
}

export const PatientEditModal: React.FC<PatientEditModalProps> = ({
  visible,
  patient,
  onCancel,
  onSuccess,
  onUpdatePatient
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (patient && visible) {
      form.setFieldsValue({
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone,
        gender: patient.gender,
        notes: patient.notes,
        status: patient.status
      });
    }
  }, [patient, visible, form]);

  const handleSubmit = async (values: any) => {
    if (!patient) return;

    setLoading(true);
    try {
      const updateData: any = {};
      
      if (values.email !== patient.email) updateData.email = values.email;
      if (values.firstName !== patient.firstName) updateData.firstName = values.firstName;
      if (values.lastName !== patient.lastName) updateData.lastName = values.lastName;
      if (values.phone !== patient.phone) updateData.phone = values.phone;
      if (values.gender !== patient.gender) updateData.gender = values.gender;
      if (values.notes !== patient.notes) updateData.notes = values.notes;
      if (values.status !== patient.status) updateData.status = values.status;

      if (Object.keys(updateData).length > 0) {
        const success = await onUpdatePatient(patient.id, updateData);
        if (success) {
          onSuccess();
        }
      } else {
        message.info('No changes made');
      }
    } catch (error) {
      message.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`${patient?.firstName} ${patient?.lastName} edit the`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'You must enter a name' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Patient name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'You must enter a last name' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Patient surname" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Please enter the correct email format' }
          ]}
        >
          <Input placeholder="patient@example.com" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item
            name="phone"
            label="Phone Number"
            style={{ flex: 1 }}
          >
            <Input placeholder="+998 XX XXX-XX-XX" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            style={{ flex: 1 }}
          >
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="child">Child</Option>
            </Select>
          </Form.Item>
        </div>

          <Form.Item name="notes" label="Note">
          <TextArea 
            placeholder="Additional information about the patient..." 
            rows={3}
          />
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