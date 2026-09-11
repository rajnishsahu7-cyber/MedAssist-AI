import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function DoctorSearch() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("role", "doctor")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Doctor loading error:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    console.log("Doctors:", data);

    setDoctors(data || []);
    setLoading(false);
  }

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>
        <h2>🏥 MedAssist</h2>

        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <button
          onClick={() => navigate("/patient")}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* Page Title */}
      <h2>🔎 Find a Doctor</h2>

      {/* Loading */}
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : filteredDoctors.length === 0 ? (
        <p>No doctors match your search.</p>
      ) : (
        <div style={styles.grid}>

          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              style={styles.card}
            >
              <h3>
                🩺 Dr. {doctor.full_name}
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                {doctor.email}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {doctor.role}
              </p>

              <div style={styles.buttonContainer}>

                {/* View Profile */}
                <button
                  onClick={() =>
                    navigate(
                      `/doctor-profile/${doctor.id}`
                    )
                  }
                  style={styles.profileButton}
                >
                  👤 View Profile
                </button>

                {/* Book Appointment */}
                <button
                  onClick={() => navigate("/book")}
                  style={styles.bookButton}
                >
                  📅 Book Appointment
                </button>

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
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
  },

  backButton: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "25px",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 8px 25px rgba(0, 0, 0, 0.08)",
  },

  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },

  profileButton: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  bookButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};