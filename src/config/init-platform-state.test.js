import { initPlatformState } from '~/src/config/init-platform-state'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'

describe('#init-platform-state', () => {
  beforeAll(() => {
    initPlatformState()
  })

  test('maps redis_enabled and mongo_enabled to tenant_config', () => {
    const frontend =
      platformState.management['cdp-portal-frontend'].tenant.tenant_config
    const backend =
      platformState.management['cdp-portal-backend'].tenant.tenant_config

    expect(frontend.redis).toBe(true)
    expect(frontend.mongo).toBe(false)
    expect(backend.redis).toBe(false)
    expect(backend.mongo).toBe(true)
  })
})
