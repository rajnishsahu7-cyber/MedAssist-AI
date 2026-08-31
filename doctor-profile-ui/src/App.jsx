import { HeartPulse } from 'lucide-react'
import { useEffect, useState } from 'react'
import DoctorProfile from './components/DoctorProfile'

export default function App() {
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    fetch('/doctor.json')
      .then((response) => response.json())
      .then((data) => setDoctor(data))
      .catch((error) => console.error(error))
  }, [])

  if (!doctor) {
    return <h2>Loading doctor profile...</h2>
  }

  const handleBook = () =>
    window.alert('Booking started for ' + doctor.name + '.')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900">
            <span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-white">
              <HeartPulse size={21} />
            </span>
            MedAssist <span className="font-medium text-teal-700">AI</span>
          </div>
        </div>
      </header>

      <DoctorProfile doctor={doctor} onBook={handleBook} />
    </div>
  )
}