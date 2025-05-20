import { describe, it, expect } from 'vitest'
import * as route from './route'

describe('friends API route', () => {
  it('exports GET handler', () => {
    expect(route.GET).toBeTypeOf('function')
  })

  it('exports POST handler', () => {
    expect(route.POST).toBeTypeOf('function')
  })

  it('exports PUT handler', () => {
    expect(route.PUT).toBeTypeOf('function')
  })
})
