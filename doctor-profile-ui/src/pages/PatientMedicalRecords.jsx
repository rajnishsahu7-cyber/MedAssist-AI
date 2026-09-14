import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function PatientMedicalRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  async function loadMedicalRecords() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("medical_records")
      .select(`
        id,
        record_type,
        title,
        description,
        record_date,
        created_at,
        doctor_id,
        profiles:doctor_id (
          full_name,
          email
        )
      `)
      .eq("patient_id", session.user.id)
      .order("record_date", { ascending: false });

    if (error) {
      console.error(
        "Medical records loading error:",
        error
      );

      alert(error.message);
      setLoading(false);
      return;
    }

    console.log("Patient Medical Records:", data);

    setRecords(data || []);
    setLoading(false);
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={() => navigate("/patient")}
          style={styles.backButton}
        >
          ← Patient Dashboard
        </button>
      </header>

      {/* Page title */}
      <h1>📁 My Medical Records</h1>

      <p style={styles.subtitle}>
        View your medical history, reports, diagnoses,
        prescriptions, and doctor notes.
      </p>

      {/* Records */}
      {loading ? (
        <p>Loading medical records...</p>
      ) : records.length === 0 ? (
        <div style={styles.empty}>
          <h3>No medical records found</h3>

          <p>
            Your medical records will appear here when
            your doctor adds them.
          </p>
        </div>
      ) : (
        <div style={styles.list}>

          {records.map((record) => (
            <div
              key={record.id}
              style={styles.card}
            >

              {/* Record header */}
              <div style={styles.cardHeader}>

                <div>
                  <h2>
                    📄 {record.title}
                  </h2>

                  <span
                    style={styles.typeBadge}
                  >
                    {record.record_type}
                  </span>
                </div>

              </div>

              {/* Doctor */}
              <p>
                <strong>👨‍⚕️ Doctor:</strong>{" "}
                Dr.{" "}
                {record.profiles?.full_name ||
                  "Unknown Doctor"}
              </p>

              {/* Doctor email */}
              <p>
                <strong>Email:</strong>{" "}
                {record.profiles?.email ||
                  "Not available"}
              </p>

              {/* Record date */}
              <p>
                <strong>📅 Record Date:</strong>{" "}
                {record.record_date}
              </p>

              {/* Description */}
              <div style={styles.description}>
                <strong>📝 Notes:</strong>

                <p>
                  {record.description ||
                    "No additional notes."}
                </p>
              </div>

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

  subtitle: {
    color: "#6b7280",
    marginBottom: "30px",
    maxWidth: "700px",
  },

  list: {
    display: "grid",
    gap: "20px",
    maxWidth: "750px",
    marginTop: "25px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.08)",
  },

  cardHeader: {
    marginBottom: "20px",
  },

  typeBadge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  description: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "20px",
  },

  empty: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "600px",
    marginTop: "25px",
  },

  backButton: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};