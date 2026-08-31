import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import App from './App'

describe('App', () => {
  test('renders doctor profile', () => {
    render(<App />)

    expect(screen.getByText(/Dr\. Rajesh Kumar/i)).toBeInTheDocument()
  })
})