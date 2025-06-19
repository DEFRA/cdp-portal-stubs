import { githubSchema } from '~/src/api/github/controllers/graphql/schema'
import { graphql } from 'graphql/graphql'

describe('Github Graphql schema', () => {
  test('get teams in org', async () => {
    const query = `
      query orgTeams($cursor: String, $orgName: String!) {
        organization(login: $orgName) {
          teams(first: 100, after: $cursor) {
            nodes {
              github: slug
              name
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }`

    const result = await graphql({
      schema: githubSchema,
      source: query,
      variableValues: { orgName: 'DEFRA' },
      operationName: 'orgTeams'
    })

    expect(result.errors).toBeFalsy()
    expect(result.data.organization.teams.nodes).toEqual([
      { github: 'cdp-platform', name: 'CDP Platform Team' },
      { github: 'cdp-test-1', name: 'CDP Test 1 Team' },
      { github: 'cdp-test-2', name: 'CDP Test 2 Team' },
      { github: 'cdp-test-3', name: 'CDP Test 3 Team' }
    ])
  })

  test('get users in org', async () => {
    const query = `
      query orgUsers($cursor: String, $orgName: String!) {
          organization(login: $orgName) {
            membersWithRole(first: 100, after: $cursor) {
              nodes {
                github: login
                name
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }`

    const result = await graphql({
      schema: githubSchema,
      source: query,
      variableValues: { orgName: 'DEFRA' },
      operationName: 'orgUsers'
    })

    expect(result.errors).toBeFalsy()
    expect(result.data.organization.membersWithRole.nodes).toEqual([
      { github: 'cdp-foo-0911234', name: 'Foo Barr' },
      { github: 'cdp-bar-74629590', name: 'Bar Barrington' },
      { github: 'cdp-test-441241', name: 'Test Testing' }
    ])
  })

  test('get repos for team', async () => {
    const query = `query getReposForTeam($githubOrgName: String!, $teamSlug: String!, $repoCursor: String) {
      organization(login: $githubOrgName) {
        team(slug: $teamSlug) {
          repositories(first: 100, after: $repoCursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name,
              repositoryTopics(first: 30) {
                nodes {
                  topic {
                    name
                  }
                }
              },
              description,
              primaryLanguage {
                name
              },
              url,
              isArchived,
              isTemplate,
              isPrivate,
              createdAt
            }
          }
        }
      }
    }`

    const result = await graphql({
      schema: githubSchema,
      source: query,
      variableValues: {
        githubOrgName: 'DEFRA',
        teamSlug: 'cdp-platform',
        repoCursor: ''
      },
      operationName: 'getReposForTeam'
    })

    expect(result.errors).toBeFalsy()
    expect(result.data.organization.team.repositories.nodes.length).toEqual(6)
    expect(result.data.organization.team.repositories.nodes[0]).toEqual({
      name: 'cdp-portal-frontend',
      repositoryTopics: {
        nodes: [
          {
            topic: {
              name: 'cdp'
            }
          },
          {
            topic: {
              name: 'service'
            }
          },
          {
            topic: {
              name: 'node'
            }
          },
          {
            topic: {
              name: 'frontend'
            }
          }
        ]
      },
      description: '',
      primaryLanguage: {
        name: 'JavaScript'
      },
      url: 'https://github.com/DEFRA/cdp-portal-frontend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2016-12-05T11:21:25Z'
    })
  })
})

test('commit a file', async () => {
  const query = `
     mutation m1($input: CreateCommitOnBranchInput!) {
      createCommitOnBranch(input: $input) { clientMutationId }
  }`

  const result = await graphql({
    schema: githubSchema,
    source: query,
    variableValues: {
      input: {
        clientMutationId: '123',
        branch: {
          repositoryNameWithOwner: 'DEFRA/foo',
          branchName: 'main'
        },
        message: {
          headline: 'a commit message'
        },
        fileChanges: {
          additions: [
            {
              path: 'foo.md',
              contents: 'bG9sCg=='
            }
          ]
        },
        expectedHeadOid: 'aa218f56b14c9653891f9e74264a383fa43fefbd'
      }
    },
    operationName: 'm1'
  })

  expect(result.errors).toBeFalsy()
  expect(result.data.createCommitOnBranch.clientMutationId).toEqual('123')
})
