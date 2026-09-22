import React, { useEffect, useState } from "react";
import { getDashboardStatistics } from "../services/dashboardService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    rejectedAppointments: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStatistics();

        setStats(data);
      } catch (error) {
        console.error("Dashboard Service Error:", error);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>🏥 MedAssist</h1>
          <p style={styles.subtitle}>
            Hospital Administration Dashboard
          </p>
        </div>

        <button style={styles.logoutButton}>
          Logout
        </button>
      </header>

      {/* Welcome Section */}
      <section style={styles.welcomeSection}>
        <h2>Welcome, Admin 👋</h2>

        <p>
          Monitor hospital activity, appointments, patients, doctors,
          and revenue from one place.
        </p>
      </section>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <section style={styles.statsGrid}>
        {/* Doctors */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>👨‍⚕️</div>

          <h3>Total Doctors</h3>

          <p style={styles.number}>
            {loading ? "..." : stats.totalDoctors}
          </p>

          <span style={styles.cardText}>
            Registered doctors
          </span>
        </div>

        {/* Patients */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>👥</div>

          <h3>Total Patients</h3>

          <p style={styles.number}>
            {loading ? "..." : stats.totalPatients}
          </p>

          <span style={styles.cardText}>
            Registered patients
          </span>
        </div>

        {/* Appointments */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>📅</div>

          <h3>Appointments</h3>

          <p style={styles.number}>
            {loading ? "..." : stats.totalAppointments}
          </p>

          <span style={styles.cardText}>
            Total appointments
          </span>
        </div>

        {/* Revenue */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>💰</div>

          <h3>Revenue</h3>

          <p style={styles.number}>
            ₹{loading ? "..." : stats.totalRevenue}
          </p>

          <span style={styles.cardText}>
            Revenue available
          </span>
        </div>
      </section>

      {/* Appointment + Revenue Sections */}
      <section style={styles.sectionGrid}>
        {/* Appointment Overview */}
        <div style={styles.panel}>
          <h2>📊 Appointment Overview</h2>

          <div style={styles.appointmentRow}>
            <span>Pending</span>

            <strong>
              {loading ? "..." : stats.pendingAppointments}
            </strong>
          </div>

          <div style={styles.appointmentRow}>
            <span>Accepted</span>

            <strong>
              {loading ? "..." : stats.acceptedAppointments}
            </strong>
          </div>

          <div style={styles.appointmentRow}>
            <span>Completed</span>

            <strong>
              {loading ? "..." : stats.completedAppointments}
            </strong>
          </div>

          <div style={styles.appointmentRow}>
            <span>Cancelled</span>

            <strong>
              {loading ? "..." : stats.cancelledAppointments}
            </strong>
          </div>

          <div style={styles.appointmentRow}>
            <span>Rejected</span>

            <strong>
              {loading ? "..." : stats.rejectedAppointments}
            </strong>
          </div>
        </div>

        {/* Revenue Summary */}
        <div style={styles.panel}>
          <h2>💰 Revenue Summary</h2>

          <div style={styles.revenueBox}>
            <span>Total Revenue</span>

            <strong>
              ₹{loading ? "..." : stats.totalRevenue}
            </strong>
          </div>

          <div style={styles.revenueBox}>
            <span>This Month</span>

            <strong>₹0</strong>
          </div>

          <div style={styles.revenueBox}>
            <span>Today</span>

            <strong>₹0</strong>
          </div>

          <p style={styles.revenueNote}>
            Revenue data will be connected after the payment
            system is implemented.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={styles.panel}>
        <h2>⚡ Quick Actions</h2>

        <div style={styles.actionsGrid}>
          <button style={styles.actionButton}>
            👨‍⚕️ Manage Doctors
          </button>

          <button style={styles.actionButton}>
            👥 Manage Patients
          </button>

          <button style={styles.actionButton}>
            📅 View Appointments
          </button>

          <button style={styles.actionButton}>
            💰 View Revenue
          </button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    paddingBottom: "40px",
  },

  header: {
    backgroundColor: "#ffffff",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
  },

  logoutButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  welcomeSection: {
    padding: "30px 40px 20px",
  },

  errorBox: {
    margin: "0 40px 20px",
    padding: "12px 16px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    padding: "0 40px 25px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  cardIcon: {
    fontSize: "30px",
  },

  number: {
    fontSize: "30px",
    fontWeight: "700",
    margin: "10px 0 5px",
    color: "#2563eb",
  },

  cardText: {
    color: "#6b7280",
    fontSize: "14px",
  },

  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    padding: "0 40px 0",
  },

  panel: {
    backgroundColor: "#ffffff",
    padding: "24px",
    margin: "0 40px 25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  appointmentRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  revenueBox: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    marginTop: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },

  revenueNote: {
    marginTop: "15px",
    color: "#6b7280",
    fontSize: "13px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },

  actionButton: {
    padding: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminDashboard;