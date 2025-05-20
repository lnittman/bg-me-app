import { describe, it, expect } from 'vitest'
import handler, * as route from './route'

describe('socket API route', () => {
  it('exports default handler', () => {
    expect(handler).toBeTypeOf('function')
  })

  it('exports config', () => {
    expect(route.config).toBeDefined()
  })
})
