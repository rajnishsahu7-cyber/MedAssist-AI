import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          doctor_id,
          profiles:doctor_id (
            full_name
          )
        `)
        .eq("patient_id", session.user.id)
        .order("appointment_date", { ascending: true });

      if (error) {
        console.error("Appointment error:", error);
        return;
      }

      console.log("My Appointments:", data);

      setAppointments(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={() => navigate("/patient")}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </header>

      <h2>📅 My Appointments</h2>

      {loading && <p>Loading appointments...</p>}

      {!loading && appointments.length === 0 && (
        <div style={styles.empty}>
          <h3>No appointments found</h3>
          <p>You haven't booked any appointments yet.</p>

          <button
            onClick={() => navigate("/book")}
            style={styles.bookButton}
          >
            Book an Appointment
          </button>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div style={styles.list}>
          {appointments.map((appointment) => (
            <div key={appointment.id} style={styles.card}>
              <h3>
                🩺 Dr.{" "}
                {appointment.profiles?.full_name || "Unknown Doctor"}
              </h3>

              <p>
                <strong>📅 Date:</strong>{" "}
                {appointment.appointment_date}
              </p>

              <p>
                <strong>⏰ Time:</strong>{" "}
                {appointment.appointment_time}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={styles.status}>
                  {appointment.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
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

  list: {
    display: "grid",
    gap: "20px",
    marginTop: "25px",
    maxWidth: "700px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,.08)",
  },

  status: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  empty: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    marginTop: "25px",
    maxWidth: "600px",
  },

  bookButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
};