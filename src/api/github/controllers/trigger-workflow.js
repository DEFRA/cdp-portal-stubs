import { triggerCreateRepoWorkflow } from '~/src/api/github/events/trigger-create-repo-workflow'
import { protectedServices, publicServices } from '~/src/config/services'

const triggerWorkflow = {
  handler: async (request, h) => {
    const org = request.params.org
    const repo = request.params.repo
    const workflowFile = request.params.workflow

    const repoToCreate = request.payload.inputs.repositoryName
    const serviceType = request.payload.inputs.serviceType
    const owningTeam = request.payload.inputs.owningTeam

    request.logger.info(
      `Stubbing triggering of workflow ${org}/${repo} ${workflowFile} to create repo ${repoToCreate} for ${owningTeam} of type ${serviceType}`
    )

    await triggerCreateRepoWorkflow(request.sqs, repoToCreate)

    // update the list of services
    if (serviceType.includes('frontend')) {
      request.logger.info(`Adding ${repoToCreate} to public services`)
      publicServices.push(repoToCreate)
    } else {
      protectedServices.push(repoToCreate)
      request.logger.info(`Adding ${repoToCreate} to protected services`)
    }

    return h.response({}).code(200)
  }
}

export { triggerWorkflow }
