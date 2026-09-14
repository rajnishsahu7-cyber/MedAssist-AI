import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

function PatientMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const patientId = session.user.id;

      // Load medical records
      const { data: recordData, error: recordError } = await supabase
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
        .eq("patient_id", patientId)
        .order("record_date", { ascending: false });

      if (recordError) {
        throw recordError;
      }

      // Load prescriptions
      const { data: prescriptionData, error: prescriptionError } =
        await supabase
          .from("prescriptions")
          .select(`
            id,
            medicine_name,
            dosage,
            frequency,
            duration,
            instructions,
            prescription_date,
            created_at,
            doctor_id,
            profiles:doctor_id (
              full_name,
              email
            )
          `)
          .eq("patient_id", patientId)
          .order("prescription_date", { ascending: false });

      if (prescriptionError) {
        throw prescriptionError;
      }

      setRecords(recordData || []);
      setPrescriptions(prescriptionData || []);
    } catch (err) {
      console.error("Error loading medical data:", err);
      setError(err.message || "Unable to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h2>📁 Medical Records</h2>
          <p>Loading your medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>📁 My Medical Records</h1>

        {error && (
          <div style={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* ================= MEDICAL RECORDS ================= */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Medical Records</h2>

          {records.length === 0 ? (
            <div style={styles.emptyCard}>
              <p>No medical records available yet.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {records.map((record) => (
                <div key={record.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{record.title}</h3>

                    <span style={styles.badge}>
                      {record.record_type}
                    </span>
                  </div>

                  <p>
                    <strong>Doctor:</strong>{" "}
                    {record.profiles?.full_name || "Unknown"}
                  </p>

                  {record.profiles?.email && (
                    <p>
                      <strong>Email:</strong> {record.profiles.email}
                    </p>
                  )}

                  <p>
                    <strong>Record Date:</strong>{" "}
                    {record.record_date}
                  </p>

                  {record.description && (
                    <div style={styles.notes}>
                      <strong>Notes:</strong>
                      <p>{record.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= PRESCRIPTIONS ================= */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>💊 My Prescriptions</h2>

          {prescriptions.length === 0 ? (
            <div style={styles.emptyCard}>
              <p>No prescriptions available yet.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {prescriptions.map((prescription) => (
                <div key={prescription.id} style={styles.prescriptionCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                      💊 {prescription.medicine_name}
                    </h3>

                    <span style={styles.prescriptionBadge}>
                      Prescription
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <strong>Dosage:</strong>
                    <span>{prescription.dosage}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <strong>Frequency:</strong>
                    <span>{prescription.frequency}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <strong>Duration:</strong>
                    <span>{prescription.duration}</span>
                  </div>

                  {prescription.instructions && (
                    <div style={styles.instructions}>
                      <strong>Instructions:</strong>
                      <p>{prescription.instructions}</p>
                    </div>
                  )}

                  <hr style={styles.divider} />

                  <p>
                    <strong>Doctor:</strong>{" "}
                    {prescription.profiles?.full_name || "Unknown"}
                  </p>

                  {prescription.profiles?.email && (
                    <p>
                      <strong>Doctor Email:</strong>{" "}
                      {prescription.profiles.email}
                    </p>
                  )}

                  <p>
                    <strong>Prescription Date:</strong>{" "}
                    {prescription.prescription_date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "30px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  heading: {
    marginBottom: "30px",
    color: "#1f2937",
  },

  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    marginBottom: "20px",
    color: "#1f2937",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  prescriptionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "15px",
  },

  cardTitle: {
    margin: 0,
    color: "#111827",
  },

  badge: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  prescriptionBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  notes: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },

  instructions: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "18px 0",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

export default PatientMedicalRecords;