import { oidcBasePath } from '~/src/api/oidc/oidc-config'

const loginController = {
  handler: (request, h) => {
    const fullUrl = new URL(request.url)
    const page = `
    <h1>Login</h1>
    <a href="${oidcBasePath}/authorize${fullUrl.search}&user=admin">Admin</a>
    `
    return h.response(page).header('content-type', 'text/html').code(200)
  }
}

export { loginController }
