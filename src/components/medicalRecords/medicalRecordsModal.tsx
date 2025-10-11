import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import { api } from "../../service/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId: string;
}

export const MedicalRecordModal: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
  patientId,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!patientId) {
        message.error("Patient ID not found");
        return;
      }

      const payload = {
        type: values.type,
        description: values.description,
        prescription: values.prescription || null,
        followUpDate: values.followUpDate
          ? values.followUpDate.format("YYYY-MM-DD")
          : null,
      };

      console.log("Creating record payload:", payload);

      setLoading(true);
      await api.post(`/patients/${patientId}/records`, payload);
      message.success("Medical record created successfully");
      onSuccess();
      onClose();
      form.resetFields();
    } catch (err: any) {
      console.error("Error creating record:", err);
      message.error(
        err.response?.data?.message || "Failed to create medical record"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Medical Record"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Create"
      confirmLoading={loading}
      width={600}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select record type" }]}
        >
          <Select placeholder="Select type">
            <Select.Option value="diagnosis">Diagnosis</Select.Option>
            <Select.Option value="treatment">Treatment</Select.Option>
            <Select.Option value="note">Note</Select.Option>
            <Select.Option value="followup">Follow-up</Select.Option>
            <Select.Option value="checkup">Check-up</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe diagnosis or treatment..." />
        </Form.Item>

        <Form.Item label="Prescription" name="prescription">
          <Input placeholder="Enter prescription details (optional)" />
        </Form.Item>

        <Form.Item label="Follow-up Date" name="followUpDate">
          <DatePicker className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
