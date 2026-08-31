import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

import DoctorProfile from './DoctorProfile'
import { doctor } from '../data/doctor'

 describe('DoctorProfile', () => {
  test('renders doctor name', () => {
    render(<DoctorProfile doctor={doctor} onBook={vi.fn()} />)

    expect(screen.getByText(/Dr\. Rajesh Kumar/i)).toBeInTheDocument()
  })

  test('renders Book Appointment button', () => {
    render(<DoctorProfile doctor={doctor} onBook={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: /book appointment/i })
    ).toBeInTheDocument()
  })

  test('calls onBook when button is clicked', () => {
    const onBook = vi.fn()

    render(<DoctorProfile doctor={doctor} onBook={onBook} />)

    screen.getByRole('button', {
      name: /book appointment/i,
    }).click()

    expect(onBook).toHaveBeenCalledTimes(1)
  })
})