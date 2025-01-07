import { appDeployments } from '~/src/config/mock-data'
import { createLogger } from '~/src/helpers/logging/logger'

const logger = createLogger()

function getCdpAppDeploymentsFile(deploymentPath) {
  const paths = deploymentPath.split('/')
  if (paths.length !== 4) {
    return null
  }
  const serviceName = paths.pop()
  const zoneName = paths.pop()
  const environmentName = paths.pop()
  return getAppDeployment(environmentName, zoneName, serviceName)
}

function getAppDeployment(environmentName, zoneName, serviceName) {
  logger.info(
    `Getting deployment for ${environmentName} / ${zoneName} / ${serviceName}`
  )
  return appDeployments[environmentName]?.[zoneName]?.[serviceName] ?? null
}

export { getCdpAppDeploymentsFile }
