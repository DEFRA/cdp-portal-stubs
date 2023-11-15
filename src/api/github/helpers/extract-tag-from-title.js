// While we could parse the diff to see what's changed, its a whole lot easier to just
// rip the image/version out of the commit title, this assumes we dont change it in the future!
const extractTagFromTitle = (title) => {
  // `Deploy ${imageName}:${version} in {$environment} ${clusterName} cluster`,
  const parts = title.split(' ')

  if (parts.length < 3 || parts[0] !== 'Deploy' || parts[2] !== 'in') {
    throw new Error(`Invalid title: ${title}`)
  }

  const nameAndVersion = parts[1].split(':')
  const service = nameAndVersion[0]
  const version = nameAndVersion[1]
  const environment = parts[3]

  if (!service || !version || !environment) {
    throw new Error(
      `Invalid title: ${title}, serivce: [${service}] version: [${version}] environment [${environment}]`
    )
  }

  return {
    service,
    version,
    environment
  }
}

export { extractTagFromTitle }
