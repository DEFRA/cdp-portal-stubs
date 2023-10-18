const publicServices = ['cdp-portal-frontend']

const protectedServices = [
  'cdp-portal-backend',
  'cdp-self-service-ops',
  'cdp-user-service'
]

const versions = ['0.1.0', '0.2.0', '0.3.0']

const allServices = protectedServices.concat(publicServices)

export { publicServices, protectedServices, allServices, versions }
