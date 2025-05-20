import { describe, it, expect } from 'vitest'

const modules = import.meta.glob('../**/page.tsx', { eager: true })

describe('page components', () => {
  for (const [path, mod] of Object.entries(modules)) {
    const Component = (mod as any).default
    it(`${path} exports a component`, () => {
      expect(Component).toBeTypeOf('function')
    })
  }
})
