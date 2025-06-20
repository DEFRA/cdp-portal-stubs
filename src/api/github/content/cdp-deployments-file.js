import { findDeployment } from '~/src/api/ecs/ecs-simulator'

const getCdpDeploymentsFile = (path) => {
  if (path.includes('environments') && path.endsWith('.json')) {
    const parts = path.split('/')
    const environment = parts[1]
    const serviceName = parts[3]?.split('.').at(0)
    return findDeployment(environment, serviceName)
  }

  return null
}

export { getCdpDeploymentsFile }
