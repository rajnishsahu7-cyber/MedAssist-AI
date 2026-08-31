import "./DoctorProfile.css";

import {
  FaHospital,
  FaLanguage,
  FaStar,
  FaMoneyBillWave,
  FaUserMd,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function DoctorProfile({ doctor, onBook }) {
  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* Header */}

        <div className="profile-header">

          <img
            src={doctor.image}
            alt={doctor.name}
            className="doctor-image"
          />

          <div className="doctor-info">

            <h1>{doctor.name}</h1>

            <h3>{doctor.specialization}</h3>

            <p className="qualification">
              {doctor.qualification}
            </p>

            <div className="rating">

              <FaStar className="star" />

              <span>{doctor.rating}</span>

              <small>({doctor.reviews} Reviews)</small>

            </div>

          </div>

        </div>

        {/* Info Cards */}

        <div className="info-grid">

          <div className="info-card">
            <FaHospital />
            <div>
              <h4>Hospital</h4>
              <p>{doctor.hospital}</p>
            </div>
          </div>

          <div className="info-card">
            <FaUserMd />
            <div>
              <h4>Experience</h4>
              <p>{doctor.experience}</p>
            </div>
          </div>

          <div className="info-card">
            <FaMoneyBillWave />
            <div>
              <h4>Consultation Fee</h4>
              <p>₹{doctor.fee}</p>
            </div>
          </div>

          <div className="info-card">
            <FaLanguage />
            <div>
              <h4>Languages</h4>
              <p>{doctor.languages.join(", ")}</p>
            </div>
          </div>

        </div>

        {/* About */}

        <div className="section">

          <h2>About Doctor</h2>

          <p>{doctor.about}</p>

        </div>

        {/* Schedule */}

        <div className="section">

          <h2>

            <FaCalendarAlt />

            Weekly Schedule

          </h2>

          <div className="schedule">

            {doctor.schedule.map((item) => (

              <div
                className={`schedule-item ${
                  item.available ? "available" : "unavailable"
                }`}
                key={item.day}
              >
                <div>
                  <strong>{item.day}</strong>

                  <p>{item.hours}</p>
                </div>

                {item.available ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
              </div>

            ))}
          </div>

        </div>

        <button
          className="book-btn"
          onClick={onBook}
        >
          📅 Book Appointment
        </button>

      </div>
    </div>
  );
}