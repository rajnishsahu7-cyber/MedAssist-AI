export default function DoctorProfile({ doctor, onBook }) {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* Doctor Image */}
        <img
          src={doctor.image}
          alt={doctor.name}
          width="180"
          style={{
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />

        {/* Doctor Details */}
        <div>
          <h1>{doctor.name}</h1>

          <h3>{doctor.specialization}</h3>

          <p>
            <strong>Qualification:</strong> {doctor.qualification}
          </p>

          <p>
            <strong>Experience:</strong> {doctor.experience}
          </p>

          <p>
            <strong>Hospital:</strong> {doctor.hospital}
          </p>

          <p>
            <strong>Languages:</strong> {doctor.languages.join(", ")}
          </p>

          <p>
            <strong>Consultation Fee:</strong> ₹{doctor.fee}
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {doctor.rating} ({doctor.reviews} reviews)
          </p>
        </div>
      </div>

      {/* About */}
      <h2>About</h2>

      <p>{doctor.about}</p>

      {/* Schedule */}
      <h2>Weekly Schedule</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {doctor.schedule.map((item) => (
          <li key={item.day} style={{ marginBottom: "8px" }}>
            <strong>{item.day}</strong> : {item.hours}{" "}
            {item.available ? "✅" : "❌"}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={onBook}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Book Appointment
      </button>
    </div>
  );
}