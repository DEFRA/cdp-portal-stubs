import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '~/src/api/github/controllers/graphql/typedefs'
import { resolvers } from '~/src/api/github/controllers/graphql/resolvers'

export const githubSchema = makeExecutableSchema({ typeDefs, resolvers })
