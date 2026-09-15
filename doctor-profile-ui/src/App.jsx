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
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* ================= DOCTOR MEDICAL RECORDS ================= */}

      <Route
        path="/medical-records"
        element={
          <RoleProtectedRoute role="doctor">
            <MedicalRecords />
          </RoleProtectedRoute>
        }
      />


      {/* ================= NOTIFICATIONS ================= */}

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />


      {/* ================= PATIENT MEDICAL RECORDS ================= */}

      <Route
        path="/patient-medical-records"
        element={
          <RoleProtectedRoute role="patient">
            <PatientMedicalRecords />
          </RoleProtectedRoute>
        }
      />


      {/* ================= PATIENT ================= */}

      <Route
        path="/patient"
        element={
          <RoleProtectedRoute role="patient">
            <PatientDashboard />
          </RoleProtectedRoute>
        }
      />


      {/* ================= DOCTOR ================= */}

      <Route
        path="/doctor"
        element={
          <RoleProtectedRoute role="doctor">
            <DoctorDashboard />
          </RoleProtectedRoute>
        }
      />


      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <RoleProtectedRoute role="admin">
            <AdminDashboard />
          </RoleProtectedRoute>
        }
      />


      {/* ================= BOOK APPOINTMENT ================= */}

      <Route
        path="/book"
        element={
          <RoleProtectedRoute role="patient">
            <BookAppointment />
          </RoleProtectedRoute>
        }
      />


      {/* ================= MY APPOINTMENTS ================= */}

      <Route
        path="/my-appointments"
        element={
          <RoleProtectedRoute role="patient">
            <MyAppointments />
          </RoleProtectedRoute>
        }
      />


      {/* ================= DOCTOR SEARCH ================= */}

      <Route
        path="/doctor-search"
        element={
          <RoleProtectedRoute role="patient">
            <DoctorSearch />
          </RoleProtectedRoute>
        }
      />


      {/* ================= DOCTOR PROFILE ================= */}

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