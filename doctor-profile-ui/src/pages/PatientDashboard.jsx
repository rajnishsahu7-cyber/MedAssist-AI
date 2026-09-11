import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h2>🏥 MedAssist</h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Welcome */}
      <h3 className="welcome">Welcome Patient 👋</h3>

      {/* Cards */}
      <div className="cards">
        {/* Book Appointment */}
        <div
          className="card"
          onClick={() => navigate("/book")}
          style={{ cursor: "pointer" }}
        >
          <h3>📅 Book Appointment</h3>
          <p>Schedule an appointment with a doctor.</p>
        </div>

        {/* My Appointments */}
        <div
        Style={styles.card}
          onClick={() => navigate("/my-appointments")}
          >
            <h3>🗓️</h3>
            <p>View your upcoming and past appointments.</p>
          </div>

        {/* AI Symptom Checker */}
        <div className="card">
          <h3>🩺 AI Symptom Checker</h3>
          <p>Describe your symptoms and get AI suggestions.</p>
        </div>

        {/* Medical Records */}
        <div className="card">
          <h3>📁 Medical Records</h3>
          <p>View prescriptions and reports.</p>
        </div>

        {/* Chat */}
        <div className="card">
          <h3>💬 Chat with Doctor</h3>
          <p>Consult your doctor securely.</p>
        </div>
      </div>
    </div>
  );
}