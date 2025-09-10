import { aadUserData } from '~/src/api/aad/content/aad-users'

const extractSearchTerm = (value) =>
  value
    .split('"')
    .filter((part) => part.includes(':') && !part.includes('OR'))
    .map((part) => part.split(':')[1])
    .at(0)

const findUser = (term) =>
  aadUserData.filter(({ displayName, mail }) => {
    const lowerTerm = term.toLowerCase()

    return (
      displayName.toLowerCase().includes(lowerTerm) ||
      mail.toLowerCase().includes(lowerTerm)
    )
  })

const msgraphUsers = {
  handler: async (request, h) => {
    const searchTerm = extractSearchTerm(request.query.$search)
    const users = findUser(searchTerm)

    request.logger.info(
      `Found users: ${users
        .map((user) => user.displayName)
        .join(' ')}, for search term:${searchTerm}`
    )

    const payload = {
      value: users
    }
    return h.response(payload).code(200)
  }
}

export { msgraphUsers }
