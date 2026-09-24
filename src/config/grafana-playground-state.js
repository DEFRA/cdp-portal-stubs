export const grafanaPlaygrounds = {
  'cdp-portal-frontend': {
    dashboards: [
      {
        uid: 'd0d9cc1f-abef-44ca-be1a-ee503b737326',
        title: 'cdp-portal-frontend (custom)',
        version: 2,
        url: `/d/d0d9cc1f-abef-44ca-be1a-ee503b737326/cdp-portal-frontend-custom`,
        created: '2026-06-18T15:21:13Z',
        updated: '2026-06-18T15:27:02Z',
        promoted: false
      }
    ],
    alerts: [
      {
        uid: 'alert1',
        name: 'cdp-portal-frontend - custom alert',
        type: 'custom',
        annotations: {
          summary: 'Custom alert'
        },
        version: 1,
        promoted: false
      },
      {
        uid: 'alert2',
        name: 'cdp-portal-frontend - 5xx error percentage',
        type: 'custom',
        annotations: {
          summary:
            'Percentage of client error (HTTP 5xx) responses over total requests for fg-gas-backend, alerting when too many client requests fail.'
        },
        version: 3,
        promoted: false
      }
    ]
  }
}
