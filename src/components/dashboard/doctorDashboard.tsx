import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  blue,
  green,
  red,
  orange,
  grey,
  deepPurple,
  teal,
} from "@mui/material/colors";
import { useAppointmentStore } from "../../store/appointmentStore";
import { useAuth } from "../../store/auth.store";
import { AppointmentEditModal } from "../appointments/appointmentEdit";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { CreateAppointmentsD } from "../appointments/createAppointmentsD";

const DoctorDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();
  const {
    appointments,
    fetchAppointmentsByDoctorId,
    deleteAppointment,
    updateAppointmentStatus,
    loading,
    error,
  } = useAppointmentStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    if (user?.id && user?.role === "doctor") {
      fetchAppointmentsByDoctorId(user.id);
    }
  }, [user?.id, fetchAppointmentsByDoctorId]);

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setEditModalVisible(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      await deleteAppointment(appointmentId);
      fetchAppointmentsByDoctorId(user?.id || "");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointmentsByDoctorId(user?.id || "");
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setCreateModalVisible(false);
    setSelectedAppointment(null);
  };

  const handleModalSuccess = () => {
    handleModalCancel();
    fetchAppointmentsByDoctorId(user?.id || "");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: green[50], text: green[800], border: green[200] };
      case "scheduled":
        return { bg: blue[50], text: blue[800], border: blue[200] };
      case "cancelled":
      case "canceled":
        return { bg: red[50], text: red[800], border: red[200] };
      case "no-show":
        return { bg: orange[50], text: orange[800], border: orange[200] };
      default:
        return { bg: grey[50], text: grey[800], border: grey[200] };
    }
  };

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length,
      color: blue[600],
      icon: <EventAvailableIcon fontSize="large" />,
      description: "All appointments",
    },
    {
      title: "Completed",
      value: appointments.filter((a) => a.status === "completed").length,
      color: green[600],
      icon: <DoneAllIcon fontSize="large" />,
      description: "Successfully completed appointments",
    },
    {
      title: "Scheduled",
      value: appointments.filter((a) => a.status === "scheduled").length,
      color: deepPurple[500],
      icon: <ScheduleIcon fontSize="large" />,
      description: "Upcoming appointments",
    },
    {
      title: "Cancelled",
      value: appointments.filter((a) =>
        ["cancelled", "canceled"].includes(a.status)
      ).length,
      color: red[600],
      icon: <CancelIcon fontSize="large" />,
      description: "Cancelled appointments",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: blue[600], mb: 2 }}
        />
        <Typography variant="h6" color={grey[600]} fontWeight={500}>
          Loading Dashboard...
        </Typography>
        <Typography variant="body2" color={grey[500]} mt={1}>
          Please wait a moment
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            An error occurred
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 1400, margin: "0 auto", p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box
          sx={{
            mb: 6,
            textAlign: "center",
            background: "white",
            borderRadius: 4,
            p: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <MedicalInformationIcon
            sx={{ fontSize: 60, color: blue[600], mb: 2 }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            color={blue[800]}
            gutterBottom
          >
            Doctor’s Dashboard
          </Typography>
          <Typography variant="h6" color={grey[600]} sx={{ mb: 1 }}>
            Welcome, Dr. {user?.email?.split("@")[0] || "User"}
          </Typography>
          <Typography variant="body1" color={grey[500]}>
            Manage your patients’ appointments
          </Typography>
        </Box>

        {/* Statistic Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}20`,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 25px ${stat.color}30`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        background: `${stat.color}15`,
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: { color: stat.color },
                      })}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color={stat.color}
                        gutterBottom
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color={grey[800]}
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="body2" color={grey[600]}>
                        {stat.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Appointment List */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    My Appointments
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total: {appointments.length} appointments
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateModalVisible(true)}
                  sx={{
                    background: "white",
                    color: blue[800],
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    "&:hover": {
                      background: grey[100],
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  New Appointment
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              {appointments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8, color: grey[500] }}>
                  <EventAvailableIcon
                    sx={{ fontSize: 80, mb: 2, opacity: 0.5 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No appointments yet
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Click “New Appointment” to create your first appointment
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateModalVisible(true)}
                  >
                    Add First Appointment
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {appointments.map((appointment) => {
                    const statusColors = getStatusColor(appointment.status);
                    return (
                      <Card
                        key={appointment.id}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          border: `1px solid ${statusColors.border}`,
                          background: statusColors.bg,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={7}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  mb: 2,
                                }}
                              >
                                <PersonIcon
                                  sx={{ color: blue[600], mr: 1, mt: 0.5 }}
                                  fontSize="small"
                                />
                                <Typography variant="h6" fontWeight={600}>
                                  {appointment.patient?.firstName}{" "}
                                  {appointment.patient?.lastName}
                                </Typography>
                              </Box>

                              <Stack spacing={1}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <PhoneIcon
                                    sx={{
                                      color: grey[500],
                                      mr: 1,
                                      fontSize: 18,
                                    }}
                                  />
                                  <Typography variant="body2" color={grey[700]}>
                                    {appointment.patient?.phone ||
                                      "No phone number"}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <CalendarTodayIcon
                                    sx={{
                                      color: grey[500],
                                      mr: 1,
                                      fontSize: 18,
                                    }}
                                  />
                                  <Typography variant="body2" color={grey[700]}>
                                    {new Date(
                                      appointment.startAt
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <AccessTimeIcon
                                    sx={{
                                      color: grey[500],
                                      mr: 1,
                                      fontSize: 18,
                                    }}
                                  />
                                  <Typography variant="body2" color={grey[700]}>
                                    {new Date(
                                      appointment.startAt
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Typography>
                                </Box>

                                {appointment.reason && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontStyle: "italic",
                                        color: grey[700],
                                        pl: 2,
                                        borderLeft: `3px solid ${teal[500]}`,
                                      }}
                                    >
                                      <strong>Reason:</strong>{" "}
                                      {appointment.reason}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </Grid>

                            {/* Actions */}
                            <Grid item xs={12} md={5}>
                              <Stack spacing={2}>
                                <FormControl size="small" fullWidth>
                                  <InputLabel>Status</InputLabel>
                                  <Select
                                    value={appointment.status}
                                    label="Status"
                                    onChange={(e) =>
                                      handleStatusUpdate(
                                        appointment.id,
                                        e.target.value
                                      )
                                    }
                                    sx={{
                                      background: "white",
                                      "& .MuiSelect-select": {
                                        color: statusColors.text,
                                        fontWeight: 500,
                                      },
                                    }}
                                  >
                                    <MenuItem value="scheduled">
                                      Scheduled
                                    </MenuItem>
                                    <MenuItem value="completed">
                                      Completed
                                    </MenuItem>
                                    <MenuItem value="cancelled">
                                      Cancelled
                                    </MenuItem>
                                    <MenuItem value="no-show">No-show</MenuItem>
                                  </Select>
                                </FormControl>

                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexDirection: isMobile ? "column" : "row",
                                  }}
                                >
                                  <Tooltip title="Edit">
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      startIcon={<EditIcon />}
                                      onClick={() => handleEdit(appointment)}
                                      fullWidth={isMobile}
                                      size="small"
                                    >
                                      Edit
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      startIcon={<DeleteIcon />}
                                      onClick={() =>
                                        handleDeleteAppointment(appointment.id)
                                      }
                                      fullWidth={isMobile}
                                      size="small"
                                    >
                                      Delete
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>

        <AppointmentEditModal
          visible={editModalVisible}
          appointment={selectedAppointment}
          onCancel={handleModalCancel}
          onSuccess={handleModalSuccess}
        />
        <CreateAppointmentsD
          visible={createModalVisible}
          onCancel={handleModalCancel}
          onSuccess={handleModalSuccess}
          initialPatientId={undefined} // optional
        />
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
