import { describe, it, expect } from 'vitest'
import * as route from './route'

describe('rooms API route', () => {
  it('exports POST handler', () => {
    expect(route.POST).toBeTypeOf('function')
  })

  it('exports GET handler', () => {
    expect(route.GET).toBeTypeOf('function')
  })
})
