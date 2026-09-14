import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import DoctorSearch from "./pages/DoctorSearch";
import DoctorProfile from "./pages/DoctorProfile";
import MedicalRecords from "./pages/MedicalRecords";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";

import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/medical-records"
        element={
          <RoleProtectedRoute role="doctor">
            <MedicalRecords />
          </RoleProtectedRoute>
         }
      />
      <Route
        path="/patient-medical-records"
        element={
          <RoleProtectedRoute role="patient">
            <PatientMedicalRecords />
          </RoleProtectedRoute>
        }
      />

      {/* Patient */}
      <Route
        path="/patient"
        element={
          <RoleProtectedRoute role="patient">
            <PatientDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* Doctor */}
      <Route
        path="/doctor"
        element={
          <RoleProtectedRoute role="doctor">
            <DoctorDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute role="admin">
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* Book Appointment */}
      <Route
        path="/book"
        element={
          <RoleProtectedRoute role="patient">
            <BookAppointment />
          </RoleProtectedRoute>
        }
      />

      {/* My Appointments */}
      <Route
        path="/my-appointments"
        element={
          <RoleProtectedRoute role="patient">
            <MyAppointments />
          </RoleProtectedRoute>
        }
      />

      {/* Doctor Search */}
      <Route
        path="/doctor-search"
        element={
          <RoleProtectedRoute role="patient">
            <DoctorSearch />
          </RoleProtectedRoute>
        }
      />

      {/* Doctor Profile */}
      <Route
        path="/doctor-profile/:doctorId"
        element={
          <RoleProtectedRoute role="patient">
            <DoctorProfile />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;