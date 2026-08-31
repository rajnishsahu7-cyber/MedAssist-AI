export default function DoctorProfile({ doctor, onBook }) {
  return (
    <div>
      <h1>{doctor.name}</h1>
      <p>{doctor.specialty}</p>
      <button onClick={onBook}>Book Appointment</button>
    </div>
  )
}