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