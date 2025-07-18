import { msgraphGroups } from '~/src/api/aad/controllers/msgraph-groups'
import { msgraphUsers } from '~/src/api/aad/controllers/msgraph-users'
import { msgraphUser } from '~/src/api/aad/controllers/msgraph-user'
import { msgraphMembers } from '~/src/api/aad/controllers/msgraph-members'
import { msgraphEmail } from '~/src/api/aad/controllers/msgraph-email'

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
          path: '/msgraph/v1.0/groups/{id}',
          ...msgraphGroups
        },
        {
          method: 'PATCH',
          path: '/msgraph/v1.0/groups/{id}',
          ...msgraphGroups
        },
        {
          method: 'POST',
          path: '/msgraph/v1.0/groups/{id}/members/$ref',
          ...msgraphMembers
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
          path: '/msgraph/v1.0/users/{sender}/sendMail',
          ...msgraphEmail
        }
      ])
    }
  }
}

export { aadStub }
