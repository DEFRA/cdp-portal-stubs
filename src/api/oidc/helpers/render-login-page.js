import { allUsers } from '~/src/api/oidc/helpers/users'
import { oidcBasePath } from '~/src/api/oidc/oidc-config'

const userToLink = (user, query) => {
  return `<li><a id='${user}' href='${oidcBasePath}/authorize${query}&user=${user}'>${allUsers[user].username}</a> - <i>${allUsers[user].id}</i></li>`
}

const renderLoginPage = (url, h) => {
  const queryParams = new URL(url).search
  const page = `
        <head><title>CDP-Portal-Stubs - Login Stub</title></head>
        <div style="margin: 5%">
        <h1>CDP-Portal-Stubs - Login Stub</h1>
        <pr>Select a user to login as:</pr>
        <ul>
        ${Object.keys(allUsers)
          .map((user) => userToLink(user, queryParams))
          .join('')}
        </ul>

        <br/><br/>
        <pre>DEBUG:\n${decodeURIComponent(
          queryParams.replace('?', '').replaceAll('&', '\n')
        )}</pre>
        </div>
        `
  return h.response(page).header('content-type', 'text/html').code(200)
}

export { renderLoginPage }
