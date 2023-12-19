const getCdpAppConfigFile = (path) => {
  if (path.endsWith('.github/CODEOWNERS')) {
    return `/global/ @defra/cdp-platform
/environments/ @defra/cdp-platform
/.github/ @defra/cdp-platform
/docs/ @defra/cdp-platform
CODEOWNERS @defra/cdp-platform`
  }

  return null
}

export { getCdpAppConfigFile }
