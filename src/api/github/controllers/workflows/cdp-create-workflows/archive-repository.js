export async function archiveRepository(request) {
  const inputs = request.payload.inputs
  const repositoryName = inputs.repositoryName

  if (!repositoryName) {
    throw Error('Missing repository name')
  }
}
