import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Runs before all tests
beforeAll(() => {
  // Setup code here
})

// Runs a cleanup after each test case
afterEach(() => {
  cleanup()
})

// Runs after all tests
afterAll(() => {
  // Cleanup code here
})
