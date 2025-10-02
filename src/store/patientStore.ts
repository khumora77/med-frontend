// store/patient-store.ts - BACKEND DTO LARGA MOS
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { patientService } from "../service/patientApi";
import type {
  Patient,
  PatientState,
  CreatePatientDto,
  UpdatePatientDto,
} from "../types/patientsType";

interface PatientStore extends PatientState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<PatientState["filters"]>) => void;
  fetchPatients: (params?: any) => Promise<void>;
  createPatient: (patientData: CreatePatientDto) => Promise<boolean>;
  updatePatient: (id: string, patientData: UpdatePatientDto) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
  clearError: () => void;
  resetFilters: () => void;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  pagination: { current: 1, pageSize: 10, total: 0 },
  filters: { page: 1, limit: 10 },
};

export const usePatientStore = create<PatientStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setLoading: (loading) => set({ loading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        setFilters: (filters) =>
          set({
            filters: { ...get().filters, ...filters },
          }),

        resetFilters: () => set({ filters: initialState.filters }),

        fetchPatients: async (params = {}) => {
          set({ loading: true, error: null });
          try {
            const currentFilters = get().filters;

            // Backend ListPatientsDto ga mos parametrlar
            const requestParams: any = {
              page: params.page || currentFilters.page || 1,
              limit: params.limit || currentFilters.limit || 10,
            };

            // Search - backend 'q' parametri
            if (params.search && params.search.trim() !== "") {
              requestParams.search = params.search.trim();
            }
            
            if (params.gender) {
              requestParams.gender = params.gender;
            }

            const data = await patientService.getAll(requestParams);

            // Ma'lumotlarni qayta ishlash
            let patientsArray: Patient[] = [];
            let totalCount = 0;

            if (data) {
              // Backend qanday struktura qaytarishiga qarab
              if (data.data && Array.isArray(data.data)) {
                patientsArray = data.data;
                totalCount = data.pagination?.total || data.total || 0;
              } else if (Array.isArray(data)) {
                patientsArray = data;
                totalCount = data.length;
              } else if (data.items && Array.isArray(data.items)) {
                patientsArray = data.items;
                totalCount = data.total || 0;
              }
            }

            set({
              patients: patientsArray,
              pagination: {
                current: requestParams.page,
                pageSize: requestParams.limit,
                total: totalCount,
              },
              loading: false,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Bemorlarni yuklashda xatolik";
            set({
              error: errorMessage,
              loading: false,
              patients: [],
            });
          }
        },

        createPatient: async (patientData: CreatePatientDto) => {
          set({ loading: true, error: null });
          try {
            await patientService.create(patientData);
            await get().fetchPatients(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Bemor yaratishda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        updatePatient: async (id: string, patientData: UpdatePatientDto) => {
          set({ loading: true, error: null });
          try {
            await patientService.update(id, patientData);
            await get().fetchPatients(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Bemor yangilashda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },

        deletePatient: async (id: string) => {
          set({ loading: true, error: null });
          try {
            await patientService.delete(id);
            await get().fetchPatients(get().filters);
            return true;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Bemor o'chirishda xatolik";
            set({ error: errorMessage });
            return false;
          } finally {
            set({ loading: false });
          }
        },
      }),
      {
        name: "patient-store",
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    )
  )
);