import DoctorProfile from "./components/DoctorProfile";
import { doctor } from "./data/doctor";

function App() {

  const handleBook = () => {
    alert(`Appointment booked with ${doctor.name}`);
  };

  return (
    <DoctorProfile
      doctor={doctor}
      onBook={handleBook}
    />
  );
}

export default App;