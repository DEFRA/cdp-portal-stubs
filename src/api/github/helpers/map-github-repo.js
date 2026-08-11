function mapGithubRepo(repo) {
  return {
    name: repo.name,
    description: '',
    primaryLanguage: { name: 'JavaScript' },
    url: `https://github.com/DEFRA/${repo.name}`,
    isArchived: false,
    isTemplate: false,
    isPrivate: false,
    createdAt: repo.createdAt,
    repositoryTopics: {
      nodes: repo.topics
    }
  }
}

function repoHasTopic(repo, topicName) {
  return repo.topics?.some((node) => node.topic?.name === topicName)
}

function filterReposBySearchQuery(repos, searchQuery) {
  const topicMatch = /(?:^|\s)topic:(\S+)/i.exec(searchQuery)
  const topic = topicMatch?.[1]

  return repos.filter((repo) => {
    if (topic && !repoHasTopic(repo, topic)) {
      return false
    }

    return true
  })
}

export { mapGithubRepo, filterReposBySearchQuery }
