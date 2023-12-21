import { msgraphGroups } from '~/src/api/aad/controllers/msgraph-groups'
import { msgraphUsers } from '~/src/api/aad/controllers/msgraph-users'
import { msgraphUser } from '~/src/api/aad/controllers/msgraph-user'
import { msgraphMembers } from '~/src/api/aad/controllers/msgraph-members'

const aadStub = {
  plugin: {
    name: 'aadStub',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/msgraph/v1.0/groups',
          ...msgraphGroups
        },
        {
          method: 'GET',
          path: '/msgraph/v1.0/users',
          ...msgraphUsers
        },
        {
          method: 'GET',
          path: '/msgraph/v1.0/users/{id}',
          ...msgraphUser
        },
        {
          method: 'POST',
          path: '/msgraph/v1.0/groups/{id}/members/$ref',
          ...msgraphMembers
        }
      ])
    }
  }
}

export { aadStub }
