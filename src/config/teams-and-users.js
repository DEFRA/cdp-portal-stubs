/**
 *
 * @type { {teams: {team_id: string, name: string, description: string, github: string|null, service_code: string|null}[], users: *[] }}
 */
const teamsAndUsers = {
  teams: [
    {
      team_id: 'platform',
      name: 'Platform',
      description: 'The team that runs the platform',
      github: 'cdp-platform'
    },
    {
      team_id: 'tenantteam1',
      name: 'TenantTeam1',
      description: 'A test team',
      github: 'cdp-tenant-1'
    }
  ],
  users: []
}
export { teamsAndUsers }
