import { generateRepoData } from "~/src/api/github/content/repo-data";

const getRepoController = {
  handler: async (request, h) => {
    const { org, repo } = request.params
    return h.response(generateRepoData(org, repo)).header("x-oauth-scopes", "TODO").code(200)
  }
}




export { getRepoController }
