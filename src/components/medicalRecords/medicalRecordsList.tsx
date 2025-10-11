import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Tooltip, Popconfirm, message } from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  SyncOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getRecords, deleteRecord } from "../../service/medicalRecordsApi";
import CreateMedicalRecordForm from "./createMedicalRecords";
import { MedicalRecordViewModal } from "./medicalView";

const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "diagnosis":
      return "purple";
    case "treatment":
      return "blue";
    case "note":
      return "cyan";
    default:
      return "default";
  }
};

const MedicalRecordsList: React.FC = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [createVisible, setCreateVisible] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getRecords(patientId!);
      setRecords(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchRecords();
  }, [patientId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      message.success("Record deleted");
      fetchRecords();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete record");
    }
  };

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setViewVisible(true);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {type?.charAt(0).toUpperCase() + type?.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Prescription",
      dataIndex: "prescription",
      key: "prescription",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              type="primary"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure delete this record?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/patients/${patientId}`)}> Back to Patient Detail</Button>
        <Button icon={<SyncOutlined />} onClick={fetchRecords}>
          Refresh
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateVisible(true)}
        >
          Add Record
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        loading={loading}
      />

      <CreateMedicalRecordForm
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        onSuccess={fetchRecords}
        patientId={patientId!}
      />

      {/* 🟢 View Modal */}
      <MedicalRecordViewModal
        visible={viewVisible}
        record={selectedRecord}
        onCancel={() => setViewVisible(false)}
      />
    </div>
  );
};

export default MedicalRecordsList;
