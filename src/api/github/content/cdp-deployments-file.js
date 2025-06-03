const getCdpDeploymentsFile = (path) => {
  if (path.includes('environments') && path.endsWith('.json')) {
    const fileName = path.split('/').pop()
    const serviceName = fileName?.split('.').at(0)
    return mockCdpDeploymentsContent(serviceName)
  }

  return null
}

// from https://github.com/DEFRA/cdp-app-deployments/blob/main/environments/management/public/cdp-portal-frontend.json
const mockCdpDeploymentsContent = (serviceName) => ({
  deploymentId: 'f30eeb20-3a20-48e6-8fb4-32447fda91e3',
  deploy: true,
  service: {
    name: serviceName,
    image: serviceName,
    version: '1.272.0',
    configuration: {
      commitSha: 'ae0774330b5b31f3175f915e7eab7d1f454303f1'
    },
    serviceCode: 'CDP'
  },
  cluster: {
    environment: 'management',
    zone: 'public'
  },
  resources: {
    instanceCount: 2,
    cpu: 1024,
    memory: 2048
  },
  metadata: {
    user: {
      userId: '2fc263ac-ee5d-4f15-9195-667bd557c3a7',
      displayName: 'RoboCop'
    },
    deploymentEnvironment: 'management'
  }
})

export { getCdpDeploymentsFile }
