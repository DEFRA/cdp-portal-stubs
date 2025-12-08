/**
 *
 * @type { {teams: {team_id: string, name: string, description: string, github: string|null, service_code: string|null}[], users: *[] }}
 */
const teamsAndUsers = {
  teams: [
    {
      team_id: 'cdp-platform',
      name: 'Platform-Team',
      description: 'CDP Platform Team',
      github: 'cdp-platform',
      service_code: 'CDP'
    },
    {
      team_id: 'cdp-test-1',
      name: 'Test-1',
      description: 'CDP Test 1 Team',
      github: 'cdp-test-1',
      service_code: 'TSA'
    },
    {
      team_id: 'cdp-test-2',
      name: 'Test-2',
      description: 'CDP Test 2 Team',
      github: 'cdp-test-2',
      service_code: 'TSB'
    },
    {
      team_id: 'cdp-test-3',
      name: 'Test-3',
      description: 'Example CDP Test 3 Team',
      github: 'cdp-test-3',
      service_code: 'TSC'
    },
    {
      team_id: 'cdp-tenant-1',
      name: 'Tenant-1',
      description: 'CDP Tenant Team 1',
      github: 'cdp-tenant-1',
      service_code: 'TNT'
    }
  ],
  users: []
}
export { teamsAndUsers }
