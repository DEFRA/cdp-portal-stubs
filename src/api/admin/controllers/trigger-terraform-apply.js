import { triggerWorkflowStatus } from '~/src/api/github/events/trigger-workflow-status'

export const triggerTerraformApply = {
  handler: async (request, h) => {
    await triggerWorkflowStatus(
      request.sqs,
      'cdp-tf-svc-infra',
      '.github/workflows/manual.yml',
      'Manual Apply',
      'completed',
      'success',
      0
    )
    return h.response('Done')
  }
}
