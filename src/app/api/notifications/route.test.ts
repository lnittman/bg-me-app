import { describe, it, expect } from 'vitest'
import * as route from './route'

describe('notifications API route', () => {
  it('exports GET handler', () => {
    expect(route.GET).toBeTypeOf('function')
  })
})
