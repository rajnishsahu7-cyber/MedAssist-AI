import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>
      </header>

      <h3 style={styles.welcome}>
        Welcome Patient 👋
      </h3>

      <div style={styles.grid}>

        {/* Book Appointment */}
        <div
          style={styles.card}
          onClick={() => navigate("/book")}
        >
          <h3>📅 Book Appointment</h3>
          <p>Schedule an appointment with a doctor.</p>
        </div>

        {/* My Appointments */}
        <div
          style={styles.card}
          onClick={() => navigate("/my-appointments")}
        >
          <h3>📋 My Appointments</h3>
          <p>View your upcoming and previous appointments.</p>
        </div>

        {/* AI Symptom Checker */}
        <div style={styles.card}>
          <h3>🩺 AI Symptom Checker</h3>
          <p>Describe your symptoms and get AI suggestions.</p>
        </div>

        {/* Medical Records */}
        <div style={styles.card}>
          <h3>📁 Medical Records</h3>
          <p>View prescriptions and reports.</p>
        </div>

        {/* Chat with Doctor */}
        <div style={styles.card}>
          <h3>💬 Chat with Doctor</h3>
          <p>Consult your doctor securely.</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  welcome: {
    marginBottom: "25px",
  },

  logout: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
  },
};