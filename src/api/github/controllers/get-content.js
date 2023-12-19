import { getTfSvcFile } from '~/src/api/github/content/tfsvc'
import { getTfSvcInfraFile } from '~/src/api/github/content/tfsvcinfra'
import { getCdpAppConfigFile } from '~/src/api/github/content/cdp-app-config'

const getContentController = {
  handler: async (request, h) => {
    const repo = request.params.repo
    const path = decodeURIComponent(request.params.path)

    request.logger.info(`serving ${repo} / ${path}`)
    const content = lookupContent(repo, path)
    if (content === null) {
      return h.response().code(404) // TODO: find out what github actually returns
    }
    return h.response(JSON.stringify(content)).code(200)
  }
}

const lookupContent = (repo, path) => {
  switch (repo) {
    case 'cdp-tf-svc':
      return getTfSvcFile(path)
    case 'cdp-tf-svc-infra':
      return getTfSvcInfraFile(path)
    case 'cdp-app-config':
      return getCdpAppConfigFile(path)
    default:
      return null
  }
}

export { getContentController }
