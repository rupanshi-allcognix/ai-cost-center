import { describe, it, expect } from 'vitest'
import { cn } from '../'

describe('smoke', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })

  it('cn merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
})
