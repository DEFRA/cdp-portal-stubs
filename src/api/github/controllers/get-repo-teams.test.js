import { getRepoTeamsController } from '~/src/api/github/controllers/get-repo-teams'

describe('getRepoTeamsController', () => {
  test('returns team slug for a known repo', async () => {
    const response = await getRepoTeamsController.handler(
      { params: { org: 'DEFRA', repo: 'cdp-portal-frontend' } },
      {
        response: (payload) => ({
          code: (statusCode) => ({ payload, statusCode })
        })
      }
    )

    expect(response.statusCode).toBe(200)
    expect(response.payload).toEqual([{ slug: 'cdp-platform' }])
  })

  test('returns empty list for an unknown repo', async () => {
    const response = await getRepoTeamsController.handler(
      { params: { org: 'DEFRA', repo: 'does-not-exist' } },
      {
        response: (payload) => ({
          code: (statusCode) => ({ payload, statusCode })
        })
      }
    )

    expect(response.statusCode).toBe(200)
    expect(response.payload).toEqual([])
  })
})
