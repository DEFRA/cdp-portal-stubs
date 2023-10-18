import { protectedServices, publicServices } from '~/src/config/services'

const getTfSvcFile = (path) => {
  if (path.endsWith('protected.json')) {
    return protectedServices.map((s) => generateService(s))
  }

  if (path.endsWith('public.json')) {
    return publicServices.map((s) => generateService(s))
  }
  return null
}

const generateService = (service) => {
  return {
    container_image: service,
    container_port: 8085,
    container_version: '0.40.0',
    desired_count: 1,
    env_files: [
      {
        value:
          'arn:aws:s3:::cdp-infra-dev-service-configs/global/global_protected_fixed.env',
        type: 's3'
      },
      {
        value: `arn:aws:s3:::cdp-infra-dev-service-configs/services/${service}/infra-dev/${service}.env`,
        type: 's3'
      },
      {
        value: `arn:aws:s3:::cdp-infra-dev-service-configs/services/${service}/defaults.env`,
        type: 's3'
      },
      {
        value:
          'arn:aws:s3:::cdp-infra-dev-service-configs/environments/infra-dev/defaults.env',
        type: 's3'
      }
    ],
    healthcheck: `/${service}/health`,
    name: service,
    secrets: {},
    task_cpu: 1024,
    task_memory: 2048,
    deploy_metrics: true
  }
}

export { getTfSvcFile }
