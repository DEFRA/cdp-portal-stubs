import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const org = config.get('githubOrg')

const triggerMergeResponse = async (
  sqs,
  repoName,
  prNumber,
  nodeId,
  sha,
  delay = 3
) => {
  const payload = {
    github_event: 'pull_request',
    action: 'closed',
    number: prNumber,
    pull_request: {
      url: 'http://api.github.com/repos/DEFRA/cdp-tf-svc-infra/pulls/360',
      id: 1598534754,
      node_id: nodeId,
      html_url: 'https://github.com/DEFRA/cdp-tf-svc-infra/pull/360',
      number: prNumber,
      state: 'closed',
      title: 'Remove queue',
      created_at: '2023-11-13T09:56:38Z',
      updated_at: '2023-11-13T09:58:55Z',
      closed_at: '2023-11-13T09:58:55Z',
      merged_at: '2023-11-13T09:58:55Z',
      merge_commit_sha: sha,
      head: {
        label: 'DEFRA:remove-test-queue-and-topic',
        ref: 'remove-test-queue-and-topic',
        sha,
        repo: {
          id: 626367552,
          node_id: nodeId,
          name: repoName,
          full_name: `${org}/${repoName}`
        }
      },
      base: {
        label: 'DEFRA:main',
        ref: 'main',
        sha,
        user: {
          login: 'DEFRA'
        },
        repo: {
          id: 626367552,
          node_id: nodeId,
          name: repoName,
          full_name: `${org}/${repoName}`
        }
      },
      author_association: 'CONTRIBUTOR',
      auto_merge: null,
      active_lock_reason: null,
      merged: true,
      mergeable: null,
      mergeable_state: 'unknown',
      comments: 0,
      review_comments: 0,
      maintainer_can_modify: false,
      commits: 1,
      additions: 0,
      deletions: 18,
      changed_files: 3
    },
    repository: {
      id: 626367552,
      node_id: nodeId,
      name: repoName,
      full_name: `${org}/${repoName}`,
      private: true,
      html_url: 'https://github.com/DEFRA/cdp-tf-svc-infra',
      created_at: '2023-04-11T10:25:54Z',
      updated_at: '2023-10-24T15:01:44Z',
      pushed_at: '2023-11-13T09:58:54Z',
      git_url: 'git://github.com/DEFRA/cdp-tf-svc-infra.git',
      ssh_url: 'git@github.com:DEFRA/cdp-tf-svc-infra.git',
      clone_url: 'https://github.com/DEFRA/cdp-tf-svc-infra.git',
      svn_url: 'https://github.com/DEFRA/cdp-tf-svc-infra',
      homepage: null,
      size: 396,
      stargazers_count: 0,
      watchers_count: 0,
      language: 'HCL',
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      has_discussions: false,
      forks_count: 0,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 1,
      license: null,
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: [],
      visibility: 'internal',
      forks: 0,
      open_issues: 1,
      watchers: 0,
      default_branch: 'main',
      custom_properties: {}
    },
    organization: {
      login: org
    }
  }
  const pendingMessage = {
    QueueUrl: config.get('sqsGithubQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: delay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  await sqs.send(new SendMessageCommand(pendingMessage))
}

export { triggerMergeResponse }
