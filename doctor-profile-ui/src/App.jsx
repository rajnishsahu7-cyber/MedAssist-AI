import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointment from "./pages/BookAppointment";

import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
    </Routes>
  );
}

export default App;