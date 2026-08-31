import DoctorProfile from "./components/DoctorProfile";
import { doctor } from "./data/doctor";

export default function App() {
  return <DoctorProfile doctor={doctor} />;
}