import { describe, it, expect } from 'vitest'

const modules = import.meta.glob('../**/*.tsx', { eager: true })

describe('component exports', () => {
  for (const [path, mod] of Object.entries(modules)) {
    const comp = (mod as any).default
    it(`${path} has default export`, () => {
      expect(comp).toBeDefined()
    })
  }
})
