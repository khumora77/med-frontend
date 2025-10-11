import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  Space,
  Typography,
  message,
  Spin,
  Alert,
  Tooltip,
  Popconfirm,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { usePatientStore } from "../../store/patientStore";
import { useMedicalRecordStore } from "../../store/medicalRecord";
import { MedicalRecordForm } from "../../components/medical-records/medicalRecords";
import { MedicalRecordViewModal } from "../../components/medical-records/medicalRecordView";
import { handleDelete } from "../../components/constants";

const { Title, Text } = Typography;

export const PatientRecordsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { patients, fetchPatients } = usePatientStore();
  const {
    records,
    loading: recordsLoading,
    error: recordsError,
    pagination: recordsPagination,
    fetchRecords,
    createRecord,
    deleteRecord,
  } = useMedicalRecordStore();

  const [patient, setPatient] = useState<any>(null);
  const [viewRecordModalVisible, setViewRecordModalVisible] = useState(false);
  const [createRecordModalVisible, setCreateRecordModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Patient va recordlarni yuklash
  useEffect(() => {
    if (id) {
      const existing = patients.find((p) => p.id === id);
      if (existing) setPatient(existing);
      else fetchPatients({ search: id });

      fetchRecords({ patientId: id, page: 1, limit: 10 });
    }
  }, [id]);

  // Record yaratish
  const handleCreateRecord = async (data: any) => {
    try {
      const success = await createRecord({ ...data, patientId: id });
      if (success) {
        message.success("Medical record created successfully");
        setCreateRecordModalVisible(false);
        fetchRecords({ patientId: id, page: 1, limit: 10 });
      }
    } catch {
      message.error("Failed to create medical record");
    }
  };

  // Record o‘chirish
  const handleDeleteRecord = async (record: any) => {
    handleDelete({
      id: record.id,
      deleteFn: deleteRecord,
      successMessage: "Medical record deleted successfully",
      errorMessage: "Failed to delete medical record",
      onSuccess: () => fetchRecords({ patientId: id, page: 1, limit: 10 }),
    });
  };

  // Recordni ko‘rish
  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setViewRecordModalVisible(true);
  };

  // Jadval columnlari
  const columns = [
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (text: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text || "No diagnosis"}
        </Text>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (doctor: any) =>
        doctor ? `Dr. ${doctor.firstname} ${doctor.lastname}` : "-",
    },
    {
      title: "Treatment",
      dataIndex: "treatment",
      key: "treatment",
      render: (t: string) =>
        t ? (t.length > 50 ? `${t.substring(0, 50)}...` : t) : "-",
    },
    {
      title: "Follow-up",
      dataIndex: "followUpDate",
      key: "followUpDate",
      render: (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewRecord(record)}
              size="small"
            />
          </Tooltip>

          <Popconfirm
            title="Delete Medical Record"
            onConfirm={() => handleDeleteRecord(record)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Tooltip title="Delete">
              <Button type="link" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (recordsLoading && !records.length) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading medical records...</div>
      </div>
    );
  }

  if (recordsError) {
    return (
      <Alert
        message="Error"
        description={recordsError}
        type="error"
        showIcon
        style={{ margin: 16 }}
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/patients/${id}`)}>
          Back to Patient Detail
        </Button>

        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateRecordModalVisible(true)}
          >
            New Medical Record
          </Button>
        </Space>
      </Space>

      <Card title={<Title level={4}><FileTextOutlined /> Medical Records</Title>}>
        {patient && (
          <Text type="secondary">
            Showing records for <strong>{patient.firstName} {patient.lastName}</strong>
          </Text>
        )}

        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={recordsLoading}
          pagination={{
            current: recordsPagination.current,
            pageSize: recordsPagination.pageSize,
            total: recordsPagination.total,
            showSizeChanger: true,
            onChange: (page, limit) =>
              fetchRecords({ patientId: id!, page, limit }),
          }}
          locale={{
            emptyText: recordsLoading ? (
              <Spin size="large" />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No medical records found"
              />
            ),
          }}
        />
      </Card>

      <MedicalRecordForm
        visible={createRecordModalVisible}
        onCancel={() => setCreateRecordModalVisible(false)}
        onSuccess={handleCreateRecord}
        patientId={id}
        loading={recordsLoading}
        error={recordsError}
      />

      <MedicalRecordViewModal
        visible={viewRecordModalVisible}
        record={selectedRecord}
        onCancel={() => {
          setViewRecordModalVisible(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};
