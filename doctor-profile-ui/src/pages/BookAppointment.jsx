import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "doctor");

  console.log("Doctors:", JSON.stringify(data, null, 2));
  console.log("Error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  setDoctors(data);
}

  async function bookAppointment() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return alert("Please login");

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
      alert(error.message);
    } else {
      alert("Appointment Booked Successfully!");

      setDoctorId("");
      setDate("");
      setTime("");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Book Appointment</h2>

      <select
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        style={{ width: 300, padding: 10, marginBottom: 15 }}
      >
        <option value="">Select Doctor</option>

        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.full_name}
          </option>
        ))}
      </select>

      <br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: 300, padding: 10, marginBottom: 15 }}
      />

      <br />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={{ width: 300, padding: 10, marginBottom: 20 }}
      />

      <br />

      <button onClick={bookAppointment}>
        Book Appointment
      </button>
    </div>
  );
}