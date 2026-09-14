import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

const days = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

const defaultAvailability = days.map((day) => ({
  day_of_week: day.id,
  day_name: day.name,
  start_time: "09:00",
  end_time: "17:00",
  is_available: day.id !== 0,
}));

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [filter, setFilter] = useState("All");

  const [availability, setAvailability] = useState(
    defaultAvailability
  );

  const [availabilityLoading, setAvailabilityLoading] =
    useState(true);

  const [savingAvailability, setSavingAvailability] =
    useState(false);

  useEffect(() => {
    loadDoctorDashboard();
    loadAvailability();
  }, []);

  // =====================================================
  // LOAD DOCTOR DASHBOARD
  // =====================================================

  async function loadDoctorDashboard() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    // Get doctor profile
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", session.user.id)
        .single();

    if (profileError) {
      console.error(
        "Doctor profile error:",
        profileError
      );

      alert(profileError.message);
      setLoading(false);
      return;
    }

    setDoctorName(profile.full_name);

    // Get doctor's appointments
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        patient_id,
        profiles:patient_id (
          full_name,
          email
        )
      `)
      .eq("doctor_id", session.user.id)
      .order("appointment_date", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Doctor appointments error:",
        error
      );

      alert(error.message);
      setLoading(false);
      return;
    }

    console.log("Doctor Appointments:", data);

    setAppointments(data || []);
    setLoading(false);
  }

  // =====================================================
  // LOAD DOCTOR AVAILABILITY
  // =====================================================

  async function loadAvailability() {
    setAvailabilityLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("doctor_availability")
      .select(`
        day_of_week,
        start_time,
        end_time,
        is_available
      `)
      .eq("doctor_id", session.user.id)
      .order("day_of_week", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Availability loading error:",
        error
      );

      alert(error.message);
      setAvailabilityLoading(false);
      return;
    }

    // If doctor already has availability saved
    if (data && data.length > 0) {
      const updatedAvailability = days.map((day) => {
        const savedDay = data.find(
          (item) =>
            item.day_of_week === day.id
        );

        if (savedDay) {
          return {
            day_of_week: day.id,
            day_name: day.name,
            start_time:
              savedDay.start_time?.slice(0, 5) ||
              "09:00",
            end_time:
              savedDay.end_time?.slice(0, 5) ||
              "17:00",
            is_available:
              savedDay.is_available,
          };
        }

        return {
          day_of_week: day.id,
          day_name: day.name,
          start_time: "09:00",
          end_time: "17:00",
          is_available: false,
        };
      });

      setAvailability(updatedAvailability);
    }

    setAvailabilityLoading(false);
  }

  // =====================================================
  // CHANGE AVAILABILITY
  // =====================================================

  function handleAvailabilityChange(
    dayId,
    field,
    value
  ) {
    setAvailability((current) =>
      current.map((day) =>
        day.day_of_week === dayId
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
    );
  }

  // =====================================================
  // SAVE AVAILABILITY
  // =====================================================

  async function saveAvailability() {
    setSavingAvailability(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    // Validate times for available days
    for (const day of availability) {
      if (
        day.is_available &&
        day.start_time >= day.end_time
      ) {
        alert(
          `${day.day_name}: End time must be later than start time.`
        );

        setSavingAvailability(false);
        return;
      }
    }

    const rows = availability.map((day) => ({
      doctor_id: session.user.id,
      day_of_week: day.day_of_week,
      start_time: day.start_time,
      end_time: day.end_time,
      is_available: day.is_available,
    }));

    const { error } = await supabase
      .from("doctor_availability")
      .upsert(rows, {
        onConflict: "doctor_id,day_of_week",
      });

    if (error) {
      console.error(
        "Availability save error:",
        error
      );

      alert(error.message);
      setSavingAvailability(false);
      return;
    }

    alert("Availability saved successfully!");

    setSavingAvailability(false);

    // Reload saved data
    loadAvailability();
  }

  // =====================================================
  // APPOINTMENT SUMMARY
  // =====================================================

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Pending"
    ).length;

  const acceptedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Accepted"
    ).length;

  const rejectedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Rejected"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "Completed"
    ).length;

  // =====================================================
  // FILTER APPOINTMENTS
  // =====================================================

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter(
          (appointment) =>
            appointment.status === filter
        );

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  async function updateAppointmentStatus(
    appointmentId,
    newStatus
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus.toLowerCase()} this appointment?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({
        status: newStatus,
      })
      .eq("id", appointmentId);

    if (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(error.message);
      return;
    }

    alert(
      `Appointment ${newStatus.toLowerCase()} successfully!`
    );

    loadDoctorDashboard();
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>
      </header>

      {/* Welcome */}
      <h2>
        Welcome Dr. {doctorName} 👋
      </h2>

      <p style={styles.subtitle}>
        Manage your patient appointments.
      </p>

      {/* =================================================
          APPOINTMENT SUMMARY
      ================================================= */}

      <div style={styles.summaryGrid}>

        {/* Total */}
        <div style={styles.summaryCard}>
          <h3>📋 Total</h3>

          <h1 style={styles.totalNumber}>
            {totalAppointments}
          </h1>

          <p>Appointments</p>
        </div>

        {/* Pending */}
        <div style={styles.summaryCard}>
          <h3>⏳ Pending</h3>

          <h1 style={styles.pendingNumber}>
            {pendingAppointments}
          </h1>

          <p>Waiting for action</p>
        </div>

        {/* Accepted */}
        <div style={styles.summaryCard}>
          <h3>✅ Accepted</h3>

          <h1 style={styles.acceptedNumber}>
            {acceptedAppointments}
          </h1>

          <p>Confirmed appointments</p>
        </div>

        {/* Rejected */}
        <div style={styles.summaryCard}>
          <h3>❌ Rejected</h3>

          <h1 style={styles.rejectedNumber}>
            {rejectedAppointments}
          </h1>

          <p>Rejected appointments</p>
        </div>

        {/* Completed */}
        <div style={styles.summaryCard}>
          <h3>🏁 Completed</h3>

          <h1 style={styles.completedNumber}>
            {completedAppointments}
          </h1>

          <p>Completed appointments</p>
        </div>

      </div>

      {/* =================================================
          DOCTOR AVAILABILITY
      ================================================= */}

      <div style={styles.availabilitySection}>

        <h2>🕐 My Availability</h2>

        <p style={styles.availabilityDescription}>
          Set the days and hours when patients can
          book appointments with you.
        </p>

        {availabilityLoading ? (
          <p>Loading availability...</p>
        ) : (
          <div style={styles.availabilityCard}>

            {availability.map((day) => (
              <div
                key={day.day_of_week}
                style={styles.availabilityRow}
              >

                {/* Day */}
                <div style={styles.dayName}>
                  <strong>
                    {day.day_name}
                  </strong>
                </div>

                {/* Start Time */}
                <input
                  type="time"
                  value={day.start_time}
                  disabled={!day.is_available}
                  onChange={(e) =>
                    handleAvailabilityChange(
                      day.day_of_week,
                      "start_time",
                      e.target.value
                    )
                  }
                  style={styles.timeInput}
                />

                <span>to</span>

                {/* End Time */}
                <input
                  type="time"
                  value={day.end_time}
                  disabled={!day.is_available}
                  onChange={(e) =>
                    handleAvailabilityChange(
                      day.day_of_week,
                      "end_time",
                      e.target.value
                    )
                  }
                  style={styles.timeInput}
                />

                {/* Available checkbox */}
                <label style={styles.checkboxLabel}>

                  <input
                    type="checkbox"
                    checked={day.is_available}
                    onChange={(e) =>
                      handleAvailabilityChange(
                        day.day_of_week,
                        "is_available",
                        e.target.checked
                      )
                    }
                  />

                  Available

                </label>

              </div>
            ))}

            {/* Save */}
            <button
              onClick={saveAvailability}
              disabled={savingAvailability}
              style={styles.saveAvailabilityButton}
            >
              {savingAvailability
                ? "Saving..."
                : "💾 Save Availability"}
            </button>

          </div>
        )}

      </div>

      {/* =================================================
          PATIENT APPOINTMENTS
      ================================================= */}

      <div style={styles.section}>

        <h2>📅 Patient Appointments</h2>

        {/* Filters */}
        <div style={styles.filterContainer}>

          {/* All */}
          <button
            onClick={() => setFilter("All")}
            style={
              filter === "All"
                ? styles.activeFilter
                : styles.filterButton
            }
          >
            📋 All
          </button>

          {/* Pending */}
          <button
            onClick={() => setFilter("Pending")}
            style={
              filter === "Pending"
                ? styles.activeFilter
                : styles.filterButton
            }
          >
            ⏳ Pending
          </button>

          {/* Accepted */}
          <button
            onClick={() => setFilter("Accepted")}
            style={
              filter === "Accepted"
                ? styles.activeFilter
                : styles.filterButton
            }
          >
            ✅ Accepted
          </button>

          {/* Rejected */}
          <button
            onClick={() => setFilter("Rejected")}
            style={
              filter === "Rejected"
                ? styles.activeFilter
                : styles.filterButton
            }
          >
            ❌ Rejected
          </button>

          {/* Completed */}
          <button
            onClick={() => setFilter("Completed")}
            style={
              filter === "Completed"
                ? styles.activeFilter
                : styles.filterButton
            }
          >
            🏁 Completed
          </button>

        </div>

        {/* Appointment List */}
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div style={styles.empty}>
            <h3>No appointments</h3>

            <p>
              You don't have any appointments yet.
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div style={styles.empty}>
            <h3>
              No {filter.toLowerCase()} appointments
            </h3>

            <p>
              There are no appointments in this
              category.
            </p>
          </div>
        ) : (
          <div style={styles.list}>

            {filteredAppointments.map(
              (appointment) => (
                <div
                  key={appointment.id}
                  style={styles.card}
                >

                  <h3>
                    👤{" "}
                    {appointment.profiles
                      ?.full_name ||
                      "Unknown Patient"}
                  </h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {appointment.profiles
                      ?.email ||
                      "Not available"}
                  </p>

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

                    <span
                      style={
                        appointment.status ===
                        "Accepted"
                          ? styles.acceptedStatus
                          : appointment.status ===
                            "Rejected"
                          ? styles.rejectedStatus
                          : appointment.status ===
                            "Completed"
                          ? styles.completedStatus
                          : appointment.status ===
                            "Cancelled"
                          ? styles.cancelledStatus
                          : styles.pendingStatus
                      }
                    >
                      {appointment.status}
                    </span>
                  </p>

                  {/* Accept / Reject */}
                  {appointment.status ===
                    "Pending" && (
                    <div
                      style={
                        styles.buttonContainer
                      }
                    >

                      <button
                        onClick={() =>
                          updateAppointmentStatus(
                            appointment.id,
                            "Accepted"
                          )
                        }
                        style={
                          styles.acceptButton
                        }
                      >
                        ✅ Accept
                      </button>

                      <button
                        onClick={() =>
                          updateAppointmentStatus(
                            appointment.id,
                            "Rejected"
                          )
                        }
                        style={
                          styles.rejectButton
                        }
                      >
                        ❌ Reject
                      </button>

                    </div>
                  )}

                  {/* Mark Completed */}
                  {appointment.status ===
                    "Accepted" && (
                    <div
                      style={
                        styles.buttonContainer
                      }
                    >

                      <button
                        onClick={() =>
                          updateAppointmentStatus(
                            appointment.id,
                            "Completed"
                          )
                        }
                        style={
                          styles.completeButton
                        }
                      >
                        🏁 Mark Completed
                      </button>

                    </div>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* Doctor Medical Records */}
      <div style={styles.medicalRecordsSection}>
        <h2>📁 Medical Records</h2>

        <p style={styles.availabilityDescription}>
          Create and manage medical records for your patients.
        </p>

        <button
          onClick={() => navigate("/medical-records")}
          style={styles.medicalRecordsButton}
        >
          📝 Manage Medical Records
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

  // =====================================================
  // SUMMARY
  // =====================================================

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "30px",
    marginBottom: "40px",
  },

  summaryCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.08)",
  },

  totalNumber: {
    fontSize: "32px",
    margin: "10px 0",
  },

  pendingNumber: {
    fontSize: "32px",
    margin: "10px 0",
  },

  acceptedNumber: {
    fontSize: "32px",
    margin: "10px 0",
  },

  rejectedNumber: {
    fontSize: "32px",
    margin: "10px 0",
  },

  completedNumber: {
    fontSize: "32px",
    margin: "10px 0",
  },

  // =====================================================
  // AVAILABILITY
  // =====================================================

  availabilitySection: {
    marginTop: "40px",
    marginBottom: "50px",
  },

  availabilityDescription: {
    color: "#6b7280",
    marginBottom: "20px",
  },

  availabilityCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.08)",
    maxWidth: "850px",
  },

  availabilityRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px 0",
    borderBottom:
      "1px solid #e5e7eb",
    flexWrap: "wrap",
  },

  dayName: {
    width: "110px",
  },

  timeInput: {
    padding: "9px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginLeft: "10px",
    cursor: "pointer",
  },

  saveAvailabilityButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "25px",
  },

  // =====================================================
  // APPOINTMENTS
  // =====================================================

  section: {
    marginTop: "30px",
  },

  filterContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
    marginBottom: "25px",
  },

  filterButton: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  activeFilter: {
    background: "#2563eb",
    color: "#fff",
    border: "1px solid #2563eb",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  list: {
    display: "grid",
    gap: "20px",
    maxWidth: "700px",
    marginTop: "20px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.08)",
  },

  // =====================================================
  // STATUS
  // =====================================================

  pendingStatus: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  acceptedStatus: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  rejectedStatus: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  completedStatus: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  cancelledStatus: {
    background: "#f3f4f6",
    color: "#4b5563",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  // =====================================================
  // APPOINTMENT BUTTONS
  // =====================================================

  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  acceptButton: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  rejectButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  completeButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  empty: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "600px",
  },

  logout: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  // =====================================================
  // MEDICAL RECORDS
  // =====================================================

  medicalRecordsSection: {
    marginTop: "50px",
    marginBottom: "40px",
  },

  medicalRecordsButton: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};