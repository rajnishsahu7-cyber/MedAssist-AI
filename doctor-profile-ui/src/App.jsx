import DoctorProfile from "./components/DoctorProfile";
import { doctor } from "./data/doctor";

function App() {
  const handleBook = () => {
    alert("Appointment Booked!");
  };

  return (
    <DoctorProfile
      doctor={doctor}
      onBook={handleBook}
    />
  );
}

export default App;