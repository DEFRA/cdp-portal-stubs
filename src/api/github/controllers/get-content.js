import { getTfSvcFile } from '~/src/api/github/content/tfsvc'

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
    case 'tf-svc':
      return getTfSvcFile(path)
    default:
      return null
  }
}

export { getContentController }
