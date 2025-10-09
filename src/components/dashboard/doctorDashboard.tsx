import React, { useEffect } from 'react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuth } from '../../store/authStore';


const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    appointments,
    fetchAppointments, 
    getAppointmentsByDoctorId, 
    loading,
    error
  } = useAppointmentStore();

  useEffect(() => {
    console.log('DoctorDashboard: Fetching appointments...');
    fetchAppointments();
  }, []);

  const myAppointments = user ? getAppointmentsByDoctorId(user.id) : [];

  console.log('DoctorDashboard Debug:', {
    user: user,
    totalAppointments: appointments.length,
    myAppointmentsCount: myAppointments.length,
    userRole: user?.role
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, Dr. {user?.email}
      </h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">My Information</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p><strong>Specialization:</strong>  General Medicine</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Appointments ({myAppointments.length})</h2>

        {myAppointments.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">No appointments found</p>
            <p className="text-sm text-gray-500 mt-2">
              You don't have any appointments scheduled yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAppointments.map(appointment => (
              <div key={appointment.id} className="bg-white p-4 rounded-lg shadow border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.patient?.phone || 'No phone provided'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.startAt).toLocaleDateString()} at {' '}
                      {new Date(appointment.startAt).toLocaleTimeString()}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {appointment.reason && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;