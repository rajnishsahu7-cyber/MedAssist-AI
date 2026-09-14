import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const selectedDoctorId = searchParams.get("doctorId");

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [availability, setAvailability] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAvailability, setLoadingAvailability] =
    useState(false);
  const [booking, setBooking] = useState(false);

  // Load doctors
  useEffect(() => {
    loadDoctors();
  }, [selectedDoctorId]);

  async function loadDoctors() {
    setLoadingDoctors(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("role", "doctor")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Doctors error:", error);
      alert(error.message);
      setLoadingDoctors(false);
      return;
    }

    setDoctors(data || []);

    if (selectedDoctorId) {
      setDoctorId(selectedDoctorId);
    }

    setLoadingDoctors(false);
  }

  // Load availability when doctor changes
  useEffect(() => {
    if (doctorId) {
      loadAvailability();
    } else {
      setAvailability([]);
      setAvailableSlots([]);
      setDate("");
      setTime("");
    }
  }, [doctorId]);

  async function loadAvailability() {
    setLoadingAvailability(true);

    setAvailability([]);
    setAvailableSlots([]);
    setDate("");
    setTime("");

    const { data, error } = await supabase
      .from("doctor_availability")
      .select(`
        day_of_week,
        start_time,
        end_time,
        is_available
      `)
      .eq("doctor_id", doctorId)
      .order("day_of_week", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Availability error:",
        error
      );

      alert(error.message);
      setLoadingAvailability(false);
      return;
    }

    setAvailability(data || []);
    setLoadingAvailability(false);
  }

  // Get today's date for minimum date
  function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Check whether selected date is available
  function handleDateChange(e) {
    const selectedDate = e.target.value;

    setDate(selectedDate);
    setTime("");
    setAvailableSlots([]);

    if (!selectedDate) {
      return;
    }

    const dateObject = new Date(
      `${selectedDate}T00:00:00`
    );

    const dayOfWeek = dateObject.getDay();

    const dayAvailability = availability.find(
      (item) =>
        item.day_of_week === dayOfWeek
    );

    if (
      !dayAvailability ||
      !dayAvailability.is_available
    ) {
      alert(
        `The doctor is not available on ${days[dayOfWeek].name}.`
      );

      setDate("");
      return;
    }

    const slots = generateTimeSlots(
      dayAvailability.start_time,
      dayAvailability.end_time
    );

    setAvailableSlots(slots);
  }

  // Generate 30-minute appointment slots
  function generateTimeSlots(startTime, endTime) {
    const slots = [];

    const [startHour, startMinute] =
      startTime.split(":").map(Number);

    const [endHour, endMinute] =
      endTime.split(":").map(Number);

    let currentMinutes =
      startHour * 60 + startMinute;

    const endMinutes =
      endHour * 60 + endMinute;

    while (currentMinutes < endMinutes) {
      const hour = Math.floor(
        currentMinutes / 60
      );

      const minute =
        currentMinutes % 60;

      const formattedHour =
        String(hour).padStart(2, "0");

      const formattedMinute =
        String(minute).padStart(2, "0");

      slots.push(
        `${formattedHour}:${formattedMinute}`
      );

      currentMinutes += 30;
    }

    return slots;
  }

  // Book appointment
  async function bookAppointment() {
    if (!doctorId) {
      alert("Please select a doctor.");
      return;
    }

    if (!date) {
      alert("Please select an appointment date.");
      return;
    }

    if (!time) {
      alert("Please select an appointment time.");
      return;
    }

    // Make sure selected time is an available slot
    if (!availableSlots.includes(time)) {
      alert(
        "Please select a valid available time slot."
      );
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login");
      return;
    }

    setBooking(true);

    const { error } = await supabase
      .from("appointments")
      .insert([
        {
          patient_id: session.user.id,
          doctor_id: doctorId,
          appointment_date: date,
          appointment_time: time,
          status: "Pending",
        },
      ]);

    if (error) {
      console.error(
        "Booking error:",
        error
      );

      if (
        error.code === "23505"
      ) {
        alert(
          "This appointment slot is already booked. Please select another time."
        );
      } else {
        alert(error.message);
      }

      setBooking(false);
      return;
    }

    alert(
      "Appointment Booked Successfully!"
    );

    setDate("");
    setTime("");
    setAvailableSlots([]);

    setBooking(false);
  }

  return (
    <div style={styles.container}>

      <h2>📅 Book Appointment</h2>

      <div style={styles.form}>

        {/* Doctor */}
        <label>
          <strong>Doctor</strong>
        </label>

        <select
          value={doctorId}
          onChange={(e) =>
            setDoctorId(e.target.value)
          }
          style={styles.input}
          disabled={loadingDoctors}
        >
          <option value="">
            {loadingDoctors
              ? "Loading doctors..."
              : "Select Doctor"}
          </option>

          {doctors.map((doctor) => (
            <option
              key={doctor.id}
              value={doctor.id}
            >
              Dr. {doctor.full_name}
            </option>
          ))}
        </select>

        {/* Availability information */}
        {doctorId && (
          <div style={styles.infoBox}>
            <strong>
              🕐 Doctor Availability
            </strong>

            {loadingAvailability ? (
              <p>
                Loading availability...
              </p>
            ) : availability.length === 0 ? (
              <p>
                No availability has been
                configured for this doctor.
              </p>
            ) : (
              <div style={styles.availabilityList}>
                {days.map((day) => {
                  const item =
                    availability.find(
                      (a) =>
                        a.day_of_week ===
                        day.id
                    );

                  return (
                    <div
                      key={day.id}
                      style={styles.availabilityItem}
                    >
                      <strong>
                        {day.name}:
                      </strong>{" "}

                      {!item ||
                      !item.is_available ? (
                        <span>
                          Unavailable
                        </span>
                      ) : (
                        <span>
                          {item.start_time.slice(
                            0,
                            5
                          )}{" "}
                          -{" "}
                          {item.end_time.slice(
                            0,
                            5
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Date */}
        <label>
          <strong>
            Appointment Date
          </strong>
        </label>

        <input
          type="date"
          value={date}
          min={getTodayDate()}
          onChange={handleDateChange}
          disabled={
            !doctorId ||
            loadingAvailability ||
            availability.length === 0
          }
          style={styles.input}
        />

        {/* Time */}
        <label>
          <strong>
            Appointment Time
          </strong>
        </label>

        {!date ? (
          <p style={styles.helperText}>
            Select an available date first.
          </p>
        ) : availableSlots.length === 0 ? (
          <p style={styles.warningText}>
            No available time slots.
          </p>
        ) : (
          <select
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Select Available Time
            </option>

            {availableSlots.map((slot) => (
              <option
                key={slot}
                value={slot}
              >
                {slot}
              </option>
            ))}
          </select>
        )}

        {/* Book */}
        <button
          onClick={bookAppointment}
          disabled={booking}
          style={styles.button}
        >
          {booking
            ? "Booking..."
            : "📅 Book Appointment"}
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "600px",
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
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  infoBox: {
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  availabilityList: {
    marginTop: "12px",
    display: "grid",
    gap: "6px",
  },

  availabilityItem: {
    fontSize: "14px",
  },

  helperText: {
    color: "#6b7280",
    marginTop: "0",
  },

  warningText: {
    color: "#b45309",
    marginTop: "0",
  },

  button: {
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
};