// src/components/medical-records/MedicalRecordForm.tsx - validation qo'shamiz
import React from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  Card,
  Alert
} from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface MedicalRecordFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (data: any) => void;
  patientId: string;
  loading?: boolean;
  error?: string | null;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  patientId,
  loading = false,
  error = null,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);
    
    const formattedData = {
      ...values,
      patientId,
      followUpDate: values.followUpDate?.format('YYYY-MM-DD') || undefined
    };
    
    await onSuccess(formattedData);
    
    // Faqat muvaffaqiyatli bo'lsa formani tozalash
    if (!error) {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          Create Medical Record
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      {error && (
        <Alert
          message="Creation Error"
          description={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          treatment: '',
          notes: '',
          followUpDate: null
        }}
      >
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            name="diagnosis"
            label="Diagnosis"
            rules={[
              { required: true, message: 'Please enter diagnosis' },
              { min: 3, message: 'Diagnosis must be at least 3 characters' },
              { max: 500, message: 'Diagnosis must not exceed 500 characters' }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter primary diagnosis..." 
              showCount 
              maxLength={500}
            />
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            name="treatment"
            label="Treatment Plan"
            rules={[
              { max: 1000, message: 'Treatment plan must not exceed 1000 characters' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe the treatment plan, medications, procedures..." 
              showCount 
              maxLength={1000}
            />
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            name="notes"
            label="Additional Notes"
            rules={[
              { max: 500, message: 'Notes must not exceed 500 characters' }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter any additional notes, observations, or recommendations..." 
              showCount 
              maxLength={500}
            />
          </Form.Item>
        </Card>

        <Card size="small">
          <Form.Item
            name="followUpDate"
            label="Follow-up Date"
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Select follow-up date if needed"
              format="YYYY-MM-DD"
              disabledDate={(current) => {
                return current && current < form.getFieldValue('startDate');
              }}
            />
          </Form.Item>
        </Card>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ float: 'right' }}>
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={!form.getFieldValue('diagnosis')}
            >
              {loading ? 'Creating...' : 'Create Medical Record'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};