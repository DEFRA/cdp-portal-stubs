import { triggerCreateRepoWorkflow } from '~/src/api/github/events/trigger-create-repo-workflow'
import { protectedServices, publicServices } from '~/src/config/services'

const triggerWorkflow = {
  handler: async (request, h) => {
    const org = request.params.org
    const repo = request.params.repo
    const workflowFile = request.params.workflow
    const inputs = request.payload.inputs
    const repositoryName = inputs.repositoryName

    request.logger.info(
      `Stubbing triggering of workflow ${org}/${repo} ${workflowFile} with inputs ${JSON.stringify(
        inputs
      )}`
    )

    await triggerCreateRepoWorkflow(request.sqs, repositoryName)

    if (workflowFile === 'create_microservice.yml') {
      const serviceTypeTemplate = inputs.serviceTypeTemplate

      // Update the list of services
      if (serviceTypeTemplate?.includes('frontend')) {
        request.logger.info(`Adding ${repositoryName} to public services`)
        publicServices.push(repositoryName)
      } else {
        protectedServices.push(repositoryName)
        request.logger.info(`Adding ${repositoryName} to protected services`)
      }
    }

    return h.response({}).code(200)
  }
}

export { triggerWorkflow }
