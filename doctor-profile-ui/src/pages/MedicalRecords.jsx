import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function MedicalRecords() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");

  const [recordType, setRecordType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordDate, setRecordDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  // Load patients who have appointments with this doctor
  async function loadPatients() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        patient_id,
        profiles:patient_id (
          id,
          full_name,
          email
        )
      `)
      .eq("doctor_id", session.user.id);

    if (error) {
      console.error("Patient loading error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    // Remove duplicate patients
    const uniquePatients = [];

    (data || []).forEach((appointment) => {
      const patient = appointment.profiles;

      if (
        patient &&
        !uniquePatients.some(
          (item) => item.id === patient.id
        )
      ) {
        uniquePatients.push(patient);
      }
    });

    setPatients(uniquePatients);
    setLoading(false);
  }

  // Save medical record
  async function saveMedicalRecord() {
    if (!patientId) {
      alert("Please select a patient.");
      return;
    }

    if (!recordType) {
      alert("Please select a record type.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a record title.");
      return;
    }

    if (!recordDate) {
      alert("Please select a record date.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login.");
      navigate("/");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("medical_records")
      .insert([
        {
          patient_id: patientId,
          doctor_id: session.user.id,
          record_type: recordType,
          title: title.trim(),
          description: description.trim(),
          record_date: recordDate,
        },
      ]);

    if (error) {
      console.error("Medical record error:", error);
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Medical record added successfully!");

    // Clear form
    setPatientId("");
    setRecordType("");
    setTitle("");
    setDescription("");
    setRecordDate("");

    setSaving(false);
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={() => navigate("/doctor")}
          style={styles.backButton}
        >
          ← Doctor Dashboard
        </button>
      </header>

      {/* Page Title */}
      <h1>📁 Medical Records</h1>

      <p style={styles.subtitle}>
        Create and manage medical records for your
        patients.
      </p>

      {/* Form */}
      <div style={styles.form}>

        <h2>➕ Add Medical Record</h2>

        {/* Patient */}
        <label>
          <strong>Patient</strong>
        </label>

        {loading ? (
          <p>Loading patients...</p>
        ) : patients.length === 0 ? (
          <div style={styles.empty}>
            <h3>No patients found</h3>

            <p>
              A patient must have an appointment
              with you before a medical record can
              be created.
            </p>
          </div>
        ) : (
          <select
            value={patientId}
            onChange={(e) =>
              setPatientId(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Select Patient
            </option>

            {patients.map((patient) => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {patient.full_name} -{" "}
                {patient.email}
              </option>
            ))}
          </select>
        )}

        {/* Record Type */}
        <label>
          <strong>Record Type</strong>
        </label>

        <select
          value={recordType}
          onChange={(e) =>
            setRecordType(e.target.value)
          }
          style={styles.input}
        >
          <option value="">
            Select Record Type
          </option>

          <option value="Diagnosis">
            Diagnosis
          </option>

          <option value="Prescription">
            Prescription
          </option>

          <option value="Lab Report">
            Lab Report
          </option>

          <option value="Medical Report">
            Medical Report
          </option>

          <option value="Doctor Notes">
            Doctor Notes
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        {/* Title */}
        <label>
          <strong>Record Title</strong>
        </label>

        <input
          type="text"
          placeholder="Example: General Consultation"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          style={styles.input}
        />

        {/* Description */}
        <label>
          <strong>
            Description / Notes
          </strong>
        </label>

        <textarea
          placeholder="Enter diagnosis, observations, prescription details, etc."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={styles.textarea}
        />

        {/* Record Date */}
        <label>
          <strong>Record Date</strong>
        </label>

        <input
          type="date"
          value={recordDate}
          onChange={(e) =>
            setRecordDate(e.target.value)
          }
          style={styles.input}
        />

        {/* Save Button */}
        <button
          onClick={saveMedicalRecord}
          disabled={saving || patients.length === 0}
          style={styles.saveButton}
        >
          {saving
            ? "Saving..."
            : "💾 Save Medical Record"}
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

  subtitle: {
    color: "#6b7280",
    marginBottom: "30px",
  },

  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "650px",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "130px",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  saveButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },

  backButton: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  empty: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};