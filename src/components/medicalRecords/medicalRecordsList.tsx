import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Empty,
  Card,
  Typography,
  Modal,
  Input,
  Select,
  DatePicker,
  Form,
  Alert,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { api } from "../../service/api";
import dayjs from "dayjs";
import { useParams } from "react-router-dom"; // ✅ Qo‘shildi

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface MedicalRecord {
  id: string;
  type: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  prescription?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

interface MedicalRecordsListProps {
  records?: MedicalRecord[];
  loading?: boolean;
  onRefresh: () => void;
  patientId?: string; // ✅ optional bo‘ldi
  onEdit: (record: MedicalRecord) => void;
  onView: (record: MedicalRecord) => void;
}

export const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({
  records,
  loading = false,
  onRefresh,
  patientId: propPatientId,
  onEdit,
  onView,
}) => {
  const { patientId: routePatientId } = useParams<{ patientId: string }>(); // ✅ Routerdan olish
  const patientId = propPatientId || routePatientId; // ✅ har ikki holatni qo‘llab-quvvatlaydi

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const safeRecords = records || [];

  // 🗑 Delete record
  const handleDelete = async (recordId: string) => {
    if (!patientId) {
      message.error("Patient ID not found!");
      return;
    }
    try {
      await api.delete(`/patients/${patientId}/records/${recordId}`);
      message.success("Medical record deleted successfully");
      onRefresh();
    } catch (err: any) {
      console.error("Error deleting medical record:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete medical record";
      message.error(errorMessage);
    }
  };

  // ➕ Create record
  const handleCreate = async () => {
    try {
      if (!patientId) {
        message.error("Patient ID not found!");
        return;
      }

      setError(null);
      const values = await form.validateFields();

      const payload = {
        type: values.type,
        diagnosis: values.diagnosis || "",
        treatment: values.treatment || "",
        notes: values.notes || "",
        prescription: values.prescription || "",
        followUpDate: values.followUpDate
          ? values.followUpDate.format("YYYY-MM-DD")
          : null,
      };

      console.log("Creating medical record:", payload);

      setSubmitting(true);
      await api.post(`/patients/${patientId}/records`, payload);
      message.success("Medical record created successfully");

      setModalOpen(false);
      form.resetFields();
      onRefresh();
    } catch (err: any) {
      console.error("Error creating record:", err);
      if (err.errorFields) {
        setError("Please fill in all required fields correctly");
      } else {
        const errorMessage = err.response?.data?.message || "Failed to create medical record";
        setError(errorMessage);
        message.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setError(null);
    form.resetFields();
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      diagnosis: "blue",
      treatment: "green",
      checkup: "orange",
      followup: "purple",
      note: "gray",
    };
    return colors[type] || "default";
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag color={getTypeColor(type)} style={{ textTransform: "capitalize" }}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
      width: 200,
      render: (diagnosis: string) => (
        <Tooltip title={diagnosis} placement="topLeft">
          <Text strong style={{ color: "#1890ff" }}>
            {diagnosis ? (
              diagnosis.length > 50
                ? `${diagnosis.substring(0, 50)}...`
                : diagnosis
            ) : (
              <Text type="secondary" italic>
                No diagnosis
              </Text>
            )}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Treatment",
      dataIndex: "treatment",
      key: "treatment",
      width: 200,
      render: (treatment: string) => (
        <Tooltip title={treatment} placement="topLeft">
          <Text>
            {treatment ? (
              treatment.length > 80
                ? `${treatment.substring(0, 80)}...`
                : treatment
            ) : (
              <Text type="secondary" italic>
                No treatment
              </Text>
            )}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      width: 150,
      render: (doctor: any) =>
        doctor ? (
          <Text>{`Dr. ${doctor.firstname} ${doctor.lastname}`}</Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a: MedicalRecord, b: MedicalRecord) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => <Text type="secondary">{formatDate(date)}</Text>,
    },
    {
      title: "Follow-up Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
      width: 120,
      render: (date: string) =>
        date ? <Text>{formatDate(date)}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (_: any, record: MedicalRecord) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
              style={{ color: "#52c41a" }}
            />
          </Tooltip>

          <Tooltip title="Edit Record">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
              style={{ color: "#1890ff" }}
            />
          </Tooltip>

          <Popconfirm
            title={
              <div>
                <div style={{ marginBottom: 8 }}>
                  <ExclamationCircleOutlined
                    style={{ color: "#ff4d4f", marginRight: 8 }}
                  />
                  Delete Medical Record
                </div>
                <Alert
                  message="This action cannot be undone. All record data will be permanently deleted."
                  type="warning"
                  showIcon
                  style={{ fontSize: "12px" }}
                />
              </div>
            }
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okType="danger"
            placement="leftTop"
          >
            <Tooltip title="Delete Record">
              <Button type="link" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <FileTextOutlined /> Medical Records
        </Title>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {safeRecords.length > 0 && (
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {safeRecords.length} record(s)
            </Text>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            New Record
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={safeRecords}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>No medical records found</div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                  >
                    Create First Record
                  </Button>
                </div>
              }
            />
          ),
        }}
      />

      {/* ✅ Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined />
            Create New Medical Record
          </Space>
        }
        open={modalOpen}
        onCancel={handleModalCancel}
        onOk={handleCreate}
        confirmLoading={submitting}
        okText={submitting ? "Creating..." : "Create Record"}
        cancelText="Cancel"
        destroyOnClose={false} // ⚠️ ant design warning fix
        maskClosable={false}
        width={600}
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          layout="vertical"
          form={form}
          initialValues={{
            type: "diagnosis",
          }}
        >
          <Form.Item
            label="Record Type"
            name="type"
            rules={[{ required: true, message: "Please select record type" }]}
          >
            <Select placeholder="Select record type">
              <Option value="diagnosis">Diagnosis</Option>
              <Option value="treatment">Treatment</Option>
              <Option value="checkup">Checkup</Option>
              <Option value="followup">Follow-up</Option>
              <Option value="note">General Note</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Diagnosis"
            name="diagnosis"
            rules={[
              { required: true, message: "Please enter diagnosis" },
              { min: 3, message: "Diagnosis must be at least 3 characters" },
            ]}
          >
            <TextArea rows={3} placeholder="Enter primary diagnosis..." />
          </Form.Item>

          <Form.Item
            label="Treatment Plan"
            name="treatment"
            rules={[
              { required: true, message: "Please enter treatment plan" },
              { min: 5, message: "Treatment must be at least 5 characters" },
            ]}
          >
            <TextArea rows={4} placeholder="Describe treatment plan..." />
          </Form.Item>

          <Form.Item label="Prescription" name="prescription">
            <Input placeholder="Enter prescription details..." />
          </Form.Item>

          <Form.Item label="Additional Notes" name="notes">
            <TextArea rows={3} placeholder="Any extra notes..." />
          </Form.Item>

          <Form.Item label="Follow-up Date" name="followUpDate">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Select follow-up date"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
