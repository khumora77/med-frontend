// components/appointments/CreateAppointmentForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  message,
  TimePicker,
  Alert,
  Empty,
} from 'antd';
import { useAppointmentStore } from '../../store/appointmentStore';
import { usePatientStore } from '../../store/patientStore';
import { useDoctorStore } from '../../store/doctorStore';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

interface CreateAppointmentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialPatientId?: string;
}

export const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  initialPatientId,
}) => {
  const [form] = Form.useForm();
  const { createAppointment, loading } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const { doctors, loading: doctorsLoading, error: doctorsError, fetchDoctors } = useDoctorStore();

  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      fetchPatients({ page: 1, limit: 100 });
      fetchDoctors();
      form.resetFields();
      
      if (initialPatientId) {
        form.setFieldsValue({
          patientId: initialPatientId
        });
        const patient = patients.find(p => p.id === initialPatientId);
        setSelectedPatient(patient);
      }
    }
  }, [visible, initialPatientId]);

  const handleSubmit = async (values: any) => {
    try {
      // Date va Timeni birlashtirish
      const startDate = values.date.format('YYYY-MM-DD');
      const startTime = values.startTime.format('HH:mm:ss');
      const startAt = `${startDate}T${startTime}`;
      
      // Duration bo'yicha endAt hisoblash
      const endAt = moment(startAt).add(values.duration, 'minutes').format();

      const appointmentData = {
        patientId: values.patientId,
        doctorId: values.doctorId,
        startAt: startAt,
        endAt: endAt,
        status: 'scheduled',
        reason: values.reason,
      };

      console.log('Sending appointment data:', appointmentData);

      const success = await createAppointment(appointmentData);
      if (success) {
        message.success('Appointment created successfully');
        onSuccess();
        form.resetFields();
        setSelectedDate(null);
      }
    } catch (error) {
      message.error('Failed to create appointment');
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
  };

  const handleRetryDoctors = () => {
    fetchDoctors();
  };

  return (
    <Modal
      title={initialPatientId ? "Create Appointment for Patient" : "Create New Appointment"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          duration: 30,
        }}
      >
        <Form.Item
          name="patientId"
          label="Patient"
          rules={[{ required: true, message: 'Please select a patient' }]}
        >
          <Select
            showSearch
            placeholder="Select patient"
            optionFilterProp="children"
            onChange={handlePatientChange}
            disabled={!!initialPatientId}
            filterOption={(input, option) =>
              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {patients.map(patient => (
              <Option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} ({patient.phone})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedPatient && (
          <div style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
            <strong>Patient Info:</strong> {selectedPatient.phone} | {selectedPatient.email}
          </div>
        )}

        {/* Doctors Section with Error Handling */}
        {doctorsError && (
          <Alert
            message="Doctors Loading Failed"
            description={
              <div>
                <p>{doctorsError}</p>
                <Button type="primary" onClick={handleRetryDoctors} style={{ marginTop: 8 }}>
                  Try Again
                </Button>
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item
          name="doctorId"
          label="Doctor"
          rules={[{ required: true, message: 'Please select a doctor' }]}
        >
          <Select 
            placeholder={doctorsLoading ? "Loading doctors..." : "Select doctor"}
            loading={doctorsLoading}
            disabled={doctorsLoading || !!doctorsError}
            notFoundContent={
              doctorsError ? (
                <Empty description="Failed to load doctors" />
              ) : (
                <Empty description="No doctors available" />
              )
            }
          >
            {doctors.map(doctor => (
              <Option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstname} {doctor.lastname}
                {doctor.specialization && ` - ${doctor.specialization}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Appointment Date"
          rules={[{ required: true, message: 'Please select appointment date' }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            placeholder="Select date"
            onChange={handleDateChange}
          />
        </Form.Item>

        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: 'Please select start time' }]}
        >
          <TimePicker
            format="HH:mm"
            style={{ width: '100%' }}
            placeholder="Select start time"
            disabled={!selectedDate}
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duration (minutes)"
          rules={[{ required: true, message: 'Please enter duration' }]}
        >
          <InputNumber
            min={15}
            max={240}
            style={{ width: '100%' }}
            placeholder="Enter duration in minutes"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
        >
          <TextArea
            rows={3}
            placeholder="Enter appointment reason..."
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={doctors.length === 0 || !!doctorsError}
            >
              Create Appointment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};