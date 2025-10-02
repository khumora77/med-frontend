// components/PatientEditModal.tsx
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
      
      // Faqat o'zgargan maydonlarni yuborish
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
        message.info('Hech qanday o\'zgartirish kiritilmadi');
      }
    } catch (error) {
      message.error('Xatolik yuz berdi');
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
      title={`${patient?.firstName} ${patient?.lastName} ni tahrirlash`}
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
            label="Ism"
            rules={[{ required: true, message: 'Ism kiritishingiz shart' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Bemor ismi" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Familiya"
            rules={[{ required: true, message: 'Familiya kiritishingiz shart' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Bemor familiyasi" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'To\'g\'ri email formatini kiriting' }
          ]}
        >
          <Input placeholder="bemor@example.com" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item
            name="phone"
            label="Telefon raqami"
            style={{ flex: 1 }}
          >
            <Input placeholder="+998 XX XXX-XX-XX" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Jinsi"
            style={{ flex: 1 }}
          >
            <Select placeholder="Jinsini tanlang">
              <Option value="male">Erkak</Option>
              <Option value="female">Ayol</Option>
              <Option value="child">Bola</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="status" label="Status">
          <Select placeholder="Statusni tanlang">
            <Option value="active">Faol</Option>
            <Option value="inactive">Nofaol</Option>
            <Option value="archived">Arxivlangan</Option>
          </Select>
        </Form.Item>

        <Form.Item name="notes" label="Izoh">
          <TextArea 
            placeholder="Bemor haqida qo'shimcha ma'lumot..." 
            rows={3}
          />
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