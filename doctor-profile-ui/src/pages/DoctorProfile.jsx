import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  async function loadDoctor() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("id", doctorId)
      .eq("role", "doctor")
      .single();

    if (error) {
      console.error("Doctor profile error:", error);
      setDoctor(null);
      setLoading(false);
      return;
    }

    console.log("Doctor Profile:", data);

    setDoctor(data);
    setLoading(false);
  }

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading doctor profile...</h2>;
  }

  if (!doctor) {
    return (
      <div style={styles.container}>
        <h2>Doctor not found</h2>

        <button
          onClick={() => navigate("/doctor-search")}
          style={styles.button}
        >
          ← Back to Doctor Search
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={() => navigate("/doctor-search")}
          style={styles.backButton}
        >
          ← Back to Doctor Search
        </button>
      </header>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          🩺
        </div>

        <h1>Dr. {doctor.full_name}</h1>

        <p style={styles.role}>
          Doctor
        </p>

        <div style={styles.info}>
          <p>
            <strong>Email:</strong> {doctor.email}
          </p>

          <p>
            <strong>Role:</strong> {doctor.role}
          </p>
        </div>

        <button
          onClick={() => navigate(`/book?doctorId=${doctor.id}`)}
          style={styles.bookButton}
        >
          📅 Book Appointment
        </button>
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
    marginBottom: "30px",
  },

  backButton: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  profileCard: {
    background: "#fff",
    maxWidth: "600px",
    margin: "40px auto",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
  },

  avatar: {
    fontSize: "60px",
    marginBottom: "10px",
  },

  role: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: "18px",
  },

  info: {
    textAlign: "left",
    marginTop: "25px",
    marginBottom: "25px",
  },

  bookButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  button: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};