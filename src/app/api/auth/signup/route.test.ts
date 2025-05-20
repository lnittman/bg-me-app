import { describe, it, expect } from 'vitest'
import * as route from './route'

describe('auth signup API route', () => {
  it('exports POST handler', () => {
    expect(route.POST).toBeTypeOf('function')
  })
})
