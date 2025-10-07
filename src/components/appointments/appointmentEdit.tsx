// components/appointments/AppointmentEditModal.tsx
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
} from 'antd';
import { useAppointmentStore } from '../../store/appointmentStore';
import { usePatientStore } from '../../store/patientStore';
import { useDoctorStore } from '../../store/doctorStore';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

interface AppointmentEditModalProps {
  visible: boolean;
  appointment: any;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AppointmentEditModal: React.FC<AppointmentEditModalProps> = ({
  visible,
  appointment,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { updateAppointment, loading } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const { doctors, fetchDoctors } = useDoctorStore();

  useEffect(() => {
    if (visible) {
      fetchPatients({ page: 1, limit: 100 });
      fetchDoctors();
      
      if (appointment) {
        const startMoment = moment(appointment.startAt);
        form.setFieldsValue({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          date: startMoment,
          startTime: startMoment,
          duration: Math.round((new Date(appointment.endAt).getTime() - new Date(appointment.startAt).getTime()) / 60000),
          reason: appointment.reason,
          status: appointment.status,
        });
      }
    }
  }, [visible, appointment]);

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
        status: values.status,
        reason: values.reason,
      };

      console.log('Updating appointment:', appointmentData);

      const success = await updateAppointment(appointment.id, appointmentData);
      if (success) {
        message.success('Appointment updated successfully');
        onSuccess();
      }
    } catch (error) {
      message.error('Failed to update appointment');
    }
  };

  return (
    <Modal
      title="Edit Appointment"
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

        <Form.Item
          name="doctorId"
          label="Doctor"
          rules={[{ required: true, message: 'Please select a doctor' }]}
        >
          <Select placeholder="Select doctor">
            {doctors.map(doctor => (
              <Option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstname} {doctor.lastname}
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
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="scheduled">Scheduled</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="no-show">No Show</Option>
          </Select>
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
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Appointment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};