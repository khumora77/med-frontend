// components/PatientDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spin,
  Alert,
  Descriptions,
  Tag,
  Typography,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { usePatientStore } from "../../store/patientStore";
import { handleDelete } from "../constants";
import type { Patient } from "../../types/patientsType";

const { Title, Text } = Typography;

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    patients,
    loading: patientLoading,
    error: patientError,
    fetchPatients,
    deletePatient,
  } = usePatientStore();

  const [patient, setPatient] = useState<Patient | null>(null);

  // 🧩 Ma'lumotni olish
  useEffect(() => {
    if (id) {
      const existingPatient = patients.find((p) => p.id === id);
      if (existingPatient) {
        setPatient(existingPatient);
      } else {
        fetchPatients({ search: id, limit: 1 });
      }
    }
  }, [id]);

  useEffect(() => {
    if (id && patients.length > 0) {
      const foundPatient = patients.find((p) => p.id === id);
      if (foundPatient) setPatient(foundPatient);
    }
  }, [patients, id]);

  // 🗑 Patientni o‘chirish
  const onDeletePatient = (patient: Patient) => {
    handleDelete({
      id: patient.id,
      deleteFn: deletePatient,
      successMessage: "Patient successfully deleted",
      errorMessage: "Failed to delete patient",
      onSuccess: () => navigate("/patients"),
    });
  };

  // ⚙️ Helper funksiyalar
  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "blue";
      case "female":
        return "pink";
      case "child":
        return "green";
      default:
        return "default";
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      case "child":
        return "Child";
      default:
        return gender || "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🕓 Yuklanish holati
  if (patientLoading && !patient) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading patient details...</div>
      </div>
    );
  }

  // ❌ Xato yoki topilmagan holat
  if (patientError || !patient) {
    return (
      <Alert
        message={patientError ? "Error loading patient" : "Patient not found"}
        description={patientError || `Patient with ID ${id} not found.`}
        type={patientError ? "error" : "warning"}
        showIcon
        style={{ margin: 16 }}
        action={
          <Button type="primary" onClick={() => navigate("/patients")}>
            Back to Patients
          </Button>
        }
      />
    );
  }

  // ✅ Asosiy return
  return (
    <div style={{ padding: 24 }}>
      {/* 🔙 Orqaga va amallar */}
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/patients")}>
          Back to Patients List
        </Button>

        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/patients/edit/${patient.id}`)}
          >
            Edit Patient
          </Button>

          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => navigate(`/patients/${patient.id}/appointments`)}
          >
            View Appointments
          </Button>

          <Button
            type="default"
            icon={<FileTextOutlined />}
            onClick={() => navigate(`/patients/${patient.id}/records`)}
          >
            View Medical Records
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeletePatient(patient)}
          >
            Delete Patient
          </Button>
        </Space>
      </Space>

      {/* 🧾 Patient ma'lumotlari */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#1890ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <UserOutlined style={{ fontSize: 24, color: "white" }} />
          </div>

          <div>
            <Title level={2} style={{ margin: 0 }}>
              {patient.firstName} {patient.lastName}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Patient ID: {patient.id}
            </Text>
            <Tag color={getGenderColor(patient.gender)} style={{ marginLeft: 8, fontSize: 12 }}>
              {getGenderText(patient.gender)}
            </Tag>
          </div>
        </div>

        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Phone">
            <Space>
              <PhoneOutlined />
              {patient.phone || "-"}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            <Space>
              <MailOutlined />
              {patient.email || "-"}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Date of Birth">
            {patient.dateOfBirth ? formatShortDate(patient.dateOfBirth) : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Age">
            {patient.age ? `${patient.age} years` : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Address" span={2}>
            <Space>
              <EnvironmentOutlined />
              {patient.address || "No address provided"}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Date Added">
            {formatDate(patient.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Last Updated">
            {formatDate(patient.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
