// types/patientsType.ts
export interface Patient {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  notes?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  notes?: string;
}

export interface UpdatePatientDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  notes?: string;
}

export interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: {
    page: number;
    limit: number;
    search?: string;
    gender?: string;
  };
}

// types/appointmentsType.ts
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;        // Backendda 'appointmentDate' emas
  endAt: string;          // Backendda mavjud
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;        // Backendda 'notes' emas
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  };
  doctor?: {
    id: string;
    firstname: string;    // Backendda 'firstName' emas
    lastname: string;     // Backendda 'lastName' emas
    role: string;
    specialization?: string;
  };
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  startAt: string;        // Backend struktura
  endAt: string;
  status?: string;
  reason?: string;
}

export interface UpdateAppointmentDto {
  patientId?: string;
  doctorId?: string;
  startAt?: string;
  endAt?: string;
  status?: string;
  reason?: string;
}