import { describe, it, expect } from 'vitest'
import * as route from './route'

describe('nextauth API route', () => {
  it('re-exports GET handler', () => {
    expect(route.GET).toBeTypeOf('function')
  })

  it('re-exports POST handler', () => {
    expect(route.POST).toBeTypeOf('function')
  })
})
