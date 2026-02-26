/**
 *
 * @type {{ teams: {team_id: string, name: string, description: string, github: string|null, service_code: string|null, slack_channels: { prod: string, non_prod: string, team: string }}[], users: *[] }}
 */
const teamsAndUsers = {
  teams: [
    {
      team_id: 'platform',
      name: 'Platform',
      description: 'The team that runs the platform',
      github: 'cdp-platform',
      slack_channels: {
        team: 'cdp-platform-team',
        prod: 'cdp-platform-alerts',
        non_prod: 'cdp-platform-non-prod-alerts'
      }
    },
    {
      team_id: 'tenantteam1',
      name: 'TenantTeam1',
      description: 'A test team',
      github: 'cdp-tenant-1',
      slack_channels: {
        team: 'tenantteam1',
        prod: 'tenantteam1-prod-alerts',
        non_prod: 'tenantteam1-non-prod-alerts'
      }
    }
  ],
  users: []
}
export { teamsAndUsers }
