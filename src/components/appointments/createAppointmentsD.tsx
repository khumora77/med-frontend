import React, { useState, useEffect } from "react";
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
} from "antd";
import { useAppointmentStore } from "../../store/appointmentStore";
import { usePatientStore } from "../../store/patientStore";
import { useDoctorStore } from "../../store/doctorStore";
import { useAuth } from "../../store/auth.store"; // Auth store ni import qilamiz
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

interface CreateAppointmentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialPatientId?: string;
}

export const CreateAppointmentsD: React.FC<CreateAppointmentFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  initialPatientId,
}) => {
  const [form] = Form.useForm();
  const { createAppointment, loading } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
    fetchDoctors,
  } = useDoctorStore();
  const { user } = useAuth(); // Current user ni olamiz

  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Fetch data when modal is opened
  useEffect(() => {
    if (visible) {
      fetchPatients({ page: 1, limit: 100 });
      fetchDoctors();
      form.resetFields();

      // Agar user doctor bo'lsa, doctorId ni avtomatik set qilamiz
      if (user?.role === "doctor" && user?.id) {
        form.setFieldsValue({ doctorId: user.id });
      }

      if (initialPatientId) {
        form.setFieldsValue({ patientId: initialPatientId });
        const patient = patients.find((p) => p.id === initialPatientId);
        setSelectedPatient(patient);
      }
    }
  }, [visible, initialPatientId, patients, fetchDoctors, fetchPatients, form, user]);

  // --- Handle Submit ---
  const handleSubmit = async (values: any) => {
    try {
      const startDate = values.date.format("YYYY-MM-DD");
      const startTime = values.startTime.format("HH:mm:ss");
      const startAt = `${startDate}T${startTime}`;
      const endAt = moment(startAt).add(values.duration, "minutes").format();

      // Doctor ID ni current user dan olamiz
      const doctorId = user?.role === "doctor" ? user.id : values.doctorId;

      const appointmentData = {
        patientId: values.patientId,
        doctorId: doctorId, // Current doctor ID ni ishlatamiz
        startAt,
        endAt,
        status: "scheduled",
        reason: values.reason || "",
      };

      console.log("Creating appointment with data:", appointmentData);

      const success = await createAppointment(appointmentData);
      if (success) {
        message.success("Appointment created successfully");
        onSuccess();
        form.resetFields();
        setSelectedDate(null);
        setSelectedPatient(null);
        
        // Doctor ID ni qayta set qilamiz
        if (user?.role === "doctor" && user?.id) {
          form.setFieldsValue({ doctorId: user.id });
        }
      }
    } catch (error) {
      console.error("Appointment creation error:", error);
      message.error("Failed to create appointment");
    }
  };

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
  };

  const handleRetryDoctors = () => {
    fetchDoctors();
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedDate(null);
    setSelectedPatient(null);
    
    // Doctor ID ni qayta set qilamiz
    if (user?.role === "doctor" && user?.id) {
      form.setFieldsValue({ doctorId: user.id });
    }
    
    onCancel();
  };

  // Agar current user doctor bo'lsa, faqat o'zining ma'lumotlarini ko'rsatish
  const currentDoctor = user?.role === "doctor" 
    ? doctors.find(doctor => doctor.id === user.id)
    : null;

  return (
    <Modal
      title={
        initialPatientId
          ? "Create Appointment for Patient"
          : "Create New Appointment"
      }
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
        initialValues={{ 
          duration: 30,
          // Agar doctor bo'lsa, doctorId ni avtomatik to'ldiramiz
          ...(user?.role === "doctor" && user?.id && { doctorId: user.id })
        }}
      >
        {/* --- PATIENT SELECTION --- */}
        <Form.Item
          name="patientId"
          label="Patient"
          rules={[{ required: true, message: "Please select a patient" }]}
        >
          <Select
            showSearch
            placeholder="Select patient"
            optionFilterProp="children"
            onChange={handlePatientChange}
            disabled={!!initialPatientId}
            filterOption={(input, option) =>
              (option?.children as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {patients.map((patient) => (
              <Option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} ({patient.phone})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedPatient && (
          <div
            style={{
              marginBottom: 16,
              padding: 8,
              background: "#f5f5f5",
              borderRadius: 4,
              border: "1px solid #e0e0e0",
            }}
          >
            <strong>Patient Info:</strong> {selectedPatient.phone} |{" "}
            {selectedPatient.email || "No email"}
          </div>
        )}

        {/* --- DOCTOR SELECTION --- */}
        {user?.role !== "doctor" && (
          <>
            {doctorsError && (
              <Alert
                message="Doctors Loading Failed"
                description={
                  <div>
                    <p>{doctorsError}</p>
                    <Button type="primary" onClick={handleRetryDoctors}>
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
              rules={[{ required: true, message: "Please select a doctor" }]}
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
                {doctors.map((doctor) => (
                  <Option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstname} {doctor.lastname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {/* Agar current user doctor bo'lsa, faqat o'zining ma'lumotlarini ko'rsatamiz */}
        {user?.role === "doctor" && currentDoctor && (
          <Form.Item
            name="doctorId"
            label="Doctor"
          >
            <Input
              value={`Dr. ${currentDoctor.firstname} ${currentDoctor.lastname}`}
              disabled
              style={{
                background: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.85)",
                fontWeight: 500,
              }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              <i>You are automatically assigned as the doctor for this appointment</i>
            </div>
          </Form.Item>
        )}

        {/* Agar current user doctor bo'lsa, lekin doctor ma'lumotlari topilmasa */}
        {user?.role === "doctor" && !currentDoctor && (
          <Alert
            message="Doctor Information"
            description="Loading your doctor profile..."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* --- DATE & TIME --- */}
        <Form.Item
          name="date"
          label="Appointment Date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            placeholder="Select date"
            onChange={handleDateChange}
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please select a start time" }]}
        >
          <TimePicker
            format="HH:mm"
            style={{ width: "100%" }}
            placeholder="Select start time"
            disabled={!selectedDate}
            minuteStep={15}
            showNow={false}
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duration (minutes)"
          rules={[{ required: true, message: "Please enter duration" }]}
        >
          <InputNumber
            min={15}
            max={240}
            step={15}
            style={{ width: "100%" }}
            placeholder="Enter duration"
          />
        </Form.Item>

        <Form.Item name="reason" label="Reason">
          <TextArea 
            rows={3} 
            placeholder="Enter reason for appointment" 
            showCount 
            maxLength={500}
          />
        </Form.Item>

        {/* --- BUTTONS --- */}
        <Form.Item>
          <Space style={{ float: "right" }}>
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={
                // Agar doctor bo'lsa, faqat doctors ro'yxati bo'sh bo'lsa disable qilamiz
                user?.role === "doctor" 
                  ? doctors.length === 0 
                  : doctors.length === 0 || !!doctorsError
              }
            >
              Create Appointment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};