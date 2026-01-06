export const typeDefs = `
  type Mutation {
    createCommitOnBranch(input: CreateCommitOnBranchInput!): CreateCommitOnBranchPayload
  }

  input CreateCommitOnBranchInput {
    branch: CreateRefInput!
    message: CommitMessageInput!
    fileChanges: FileChangesInput
    expectedHeadOid: GitObjectID!
    clientMutationId: String
  }

  input CreateRefInput {
    repositoryNameWithOwner: String!
    branchName: String!
  }

  input CommitMessageInput {
    headline: String!
  }

  input FileChangesInput {
    additions: [FileAdditionInput!]!
    deletions: [FileDeletionInput!]
  }

  input FileAdditionInput {
    path: String!
    contents: Base64String!
  }

  input FileDeletionInput {
    path: String!
  }

  type CreateCommitOnBranchPayload {
    clientMutationId: String
  }

  scalar GitObjectID
  scalar Base64String

  type NamedRepository {
    repo: Repository
  }

  type Query {
    user(login: String!): User
    organization(login: String!): Organization
    repository(owner: String, name: String!): Repository
  }

  type UserConnection {
    nodes: [User!]!
    pageInfo: PageInfo!
  }

  type User {
    login: String!
    name: String
    organization(login: String!): Organization
  }

  type Organization {
    login: String!
    team(slug: String!): Team
    teams(first: Int!, after: String): TeamConnection!
    membersWithRole(first: Int = 100, after: String): UserConnection!
  }

  type Team {
    slug: String!
    name: String
    repositories(first: Int!, after: String): RepositoryConnection
  }

  type TeamConnection {
    nodes: [Team]!
    pageInfo: PageInfo!
  }

  type RepositoryConnection {
    pageInfo: PageInfo!
    nodes: [Repository!]!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Repository {
    name: String!
    repositoryTopics(first: Int!): RepositoryTopicConnection!
    description: String
    primaryLanguage: Language
    url: String!
    isArchived: Boolean!
    isTemplate: Boolean!
    isPrivate: Boolean!
    createdAt: String!
  }

  type RepositoryTopicConnection {
    nodes: [RepositoryTopic!]!
  }

  type RepositoryTopic {
    topic: Topic!
  }

  type Topic {
    name: String!
  }

  type Language {
    name: String!
  }
`
