import React from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { api } from "../../service/api";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  patientId: string;
};

const { Option } = Select;

const CreateMedicalRecordForm: React.FC<Props> = ({
  visible,
  onCancel,
  onSuccess,
  patientId,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        type: values.type,
        description: values.description,
        prescription: values.prescription,
      };

      await api.post(`/patients/${patientId}/records`, payload);
      message.success("Medical record added successfully");
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (err: any) {
      console.error("Error:", err);
      message.error("Failed to add medical record");
    }
  };

  return (
    <Modal
      title="Add New Medical Record"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Save"
      okButtonProps={{ type: "primary" }}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Record Type"
          name="type"
          rules={[{ required: true, message: "Please select record type" }]}
        >
          <Select placeholder="Select type">
            <Option value="diagnosis">Diagnosis</Option>
            <Option value="treatment">Treatment</Option>
            <Option value="note">Note</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter description (optional)" rows={3} />
        </Form.Item>

        <Form.Item label="Prescription" name="prescription">
          <Input placeholder="Enter prescription (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMedicalRecordForm;
