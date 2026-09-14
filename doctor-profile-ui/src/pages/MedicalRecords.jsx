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

  // Prescription fields
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [savingPrescription, setSavingPrescription] =
    useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  // =====================================================
  // LOAD PATIENTS
  // =====================================================

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

  // =====================================================
  // LOAD PATIENT APPOINTMENTS
  // =====================================================

  async function loadPatientAppointments(selectedPatientId) {
    if (!selectedPatientId) {
      setAppointments([]);
      setAppointmentId("");
      return;
    }

    setLoadingAppointments(true);

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
        id,
        appointment_date,
        appointment_time,
        status
      `)
      .eq("doctor_id", session.user.id)
      .eq("patient_id", selectedPatientId)
      .order("appointment_date", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Appointment loading error:",
        error
      );

      alert(error.message);
      setLoadingAppointments(false);
      return;
    }

    setAppointments(data || []);
    setAppointmentId("");
    setLoadingAppointments(false);
  }

  // =====================================================
  // SELECT PATIENT
  // =====================================================

  function handlePatientChange(value) {
    setPatientId(value);
    loadPatientAppointments(value);
  }

  // =====================================================
  // SAVE MEDICAL RECORD
  // =====================================================

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
      console.error(
        "Medical record error:",
        error
      );

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

    setAppointments([]);
    setAppointmentId("");

    setSaving(false);
  }

  // =====================================================
  // SAVE PRESCRIPTION
  // =====================================================

  async function savePrescription() {
    if (!patientId) {
      alert("Please select a patient.");
      return;
    }

    if (!medicineName.trim()) {
      alert("Please enter the medicine name.");
      return;
    }

    if (!dosage.trim()) {
      alert("Please enter the dosage.");
      return;
    }

    if (!frequency.trim()) {
      alert("Please enter the frequency.");
      return;
    }

    if (!duration.trim()) {
      alert("Please enter the duration.");
      return;
    }

    if (!prescriptionDate) {
      alert("Please select the prescription date.");
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

    setSavingPrescription(true);

    const { error } = await supabase
      .from("prescriptions")
      .insert([
        {
          patient_id: patientId,
          doctor_id: session.user.id,
          appointment_id: appointmentId || null,
          medicine_name: medicineName.trim(),
          dosage: dosage.trim(),
          frequency: frequency.trim(),
          duration: duration.trim(),
          instructions: instructions.trim(),
          prescription_date: prescriptionDate,
        },
      ]);

    if (error) {
      console.error(
        "Prescription error:",
        error
      );

      alert(error.message);
      setSavingPrescription(false);
      return;
    }

    alert("Prescription added successfully!");

    // Clear prescription form
    setAppointmentId("");
    setMedicineName("");
    setDosage("");
    setFrequency("");
    setDuration("");
    setInstructions("");
    setPrescriptionDate("");

    setSavingPrescription(false);
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
        Create medical records and prescriptions for
        your patients.
      </p>

      {/* =================================================
          MEDICAL RECORD FORM
      ================================================= */}

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
              handlePatientChange(e.target.value)
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

        {/* Save Medical Record */}
        <button
          onClick={saveMedicalRecord}
          disabled={
            saving ||
            patients.length === 0
          }
          style={styles.saveButton}
        >
          {saving
            ? "Saving..."
            : "💾 Save Medical Record"}
        </button>

      </div>

      {/* =================================================
          PRESCRIPTION FORM
      ================================================= */}

      <div style={styles.form}>

        <h2>💊 Add Prescription</h2>

        {/* Patient */}
        <label>
          <strong>Patient</strong>
        </label>

        <select
          value={patientId}
          onChange={(e) =>
            handlePatientChange(e.target.value)
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

        {/* Appointment */}
        <label>
          <strong>
            Appointment (Optional)
          </strong>
        </label>

        {loadingAppointments ? (
          <p>Loading appointments...</p>
        ) : (
          <select
            value={appointmentId}
            onChange={(e) =>
              setAppointmentId(e.target.value)
            }
            style={styles.input}
            disabled={!patientId}
          >
            <option value="">
              Select Appointment
            </option>

            {appointments.map((appointment) => (
              <option
                key={appointment.id}
                value={appointment.id}
              >
                {appointment.appointment_date} -{" "}
                {appointment.appointment_time} -{" "}
                {appointment.status}
              </option>
            ))}
          </select>
        )}

        {/* Medicine */}
        <label>
          <strong>Medicine Name</strong>
        </label>

        <input
          type="text"
          placeholder="Example: Paracetamol"
          value={medicineName}
          onChange={(e) =>
            setMedicineName(e.target.value)
          }
          style={styles.input}
        />

        {/* Dosage */}
        <label>
          <strong>Dosage</strong>
        </label>

        <input
          type="text"
          placeholder="Example: 500 mg"
          value={dosage}
          onChange={(e) =>
            setDosage(e.target.value)
          }
          style={styles.input}
        />

        {/* Frequency */}
        <label>
          <strong>Frequency</strong>
        </label>

        <select
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value)
          }
          style={styles.input}
        >
          <option value="">
            Select Frequency
          </option>

          <option value="Once daily">
            Once daily
          </option>

          <option value="Twice daily">
            Twice daily
          </option>

          <option value="Three times daily">
            Three times daily
          </option>

          <option value="Four times daily">
            Four times daily
          </option>

          <option value="As needed">
            As needed
          </option>
        </select>

        {/* Duration */}
        <label>
          <strong>Duration</strong>
        </label>

        <input
          type="text"
          placeholder="Example: 5 days"
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
          style={styles.input}
        />

        {/* Instructions */}
        <label>
          <strong>Instructions</strong>
        </label>

        <textarea
          placeholder="Example: Take after meals."
          value={instructions}
          onChange={(e) =>
            setInstructions(e.target.value)
          }
          style={styles.textarea}
        />

        {/* Prescription Date */}
        <label>
          <strong>Prescription Date</strong>
        </label>

        <input
          type="date"
          value={prescriptionDate}
          onChange={(e) =>
            setPrescriptionDate(e.target.value)
          }
          style={styles.input}
        />

        {/* Save Prescription */}
        <button
          onClick={savePrescription}
          disabled={
            savingPrescription ||
            patients.length === 0
          }
          style={styles.prescriptionButton}
        >
          {savingPrescription
            ? "Saving..."
            : "💊 Save Prescription"}
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
    marginBottom: "30px",
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

  prescriptionButton: {
    background: "#7c3aed",
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