import React, { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import type { RecordTypeDto } from "../../types"; // agar sizda enum shu joyda bo‘lsa
import { createRecord, updateRecord } from "../../service/medicalRecordsApi"; // backend API funksiyalari

interface EditRecordModalProps {
  open: boolean;
  onClose: () => void;
  record?: any; // tahrirlash rejimi uchun mavjud record
  mode: "create" | "edit";
  onSuccess: () => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({
  open,
  onClose,
  record,
  mode,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Modal ochilganda mavjud ma’lumotlarni forma ichiga yuklash
  React.useEffect(() => {
    if (mode === "edit" && record) {
      form.setFieldsValue({
        type: record.type,
        description: record.description,
        prescription: record.prescription,
      });
    } else {
      form.resetFields();
    }
  }, [mode, record, form]);

  // Formani yuborish
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (mode === "edit" && record?.id) {
        await updateRecord(record.id, values);
        message.success("Record updated successfully!");
      } else {
        await createRecord(values);
        message.success("Record created successfully!");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "edit" ? "Edit Medical Record" : "Add New Record"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnHidden
      okText={mode === "edit" ? "Save Changes" : "Create"}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Record Type"
          name="type"
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Select
            placeholder="Select type"
            options={[
              { label: "Diagnosis", value: "diagnosis" },
              { label: "Treatment", value: "treatment" },
              { label: "Note", value: "note" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ min: 3, message: "Minimum 3 characters" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          label="Prescription"
          name="prescription"
          rules={[{ min: 2, message: "Minimum 2 characters" }]}
        >
          <Input.TextArea rows={2} placeholder="Enter prescription" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRecordModal;
