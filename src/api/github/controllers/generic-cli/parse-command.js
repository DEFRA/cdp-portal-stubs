/**
 * Rough cli arg parser for cdp-cli commands
 * @param command
 * @return {{namespace: string|null, action: string|null, args: {}}}
 */
export function parseCommand(command) {
  const args = tokenizeCLIString(command)
  if (args.length < 2) {
    return { namespace: args[0], action: args[1], args: {} }
  }

  const result = {}

  for (let i = 2; i < args.length; i++) {
    const current = args[i]

    if (current.startsWith('--')) {
      const key = current.slice(2).replace('-', '_')
      const next = args[i + 1]

      if (next !== undefined && !next.startsWith('--')) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    }
  }

  return { namespace: args[0], action: args[1], args: result }
}

export function parseCommandArray(rawCommands) {
  if (!rawCommands) {
    return []
  }

  try {
    const parsed = JSON.parse(rawCommands)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function tokenizeCLIString(input) {
  const regex = /'[^']*'|"[^"]*"|\S+/g
  const matches = input.match(regex) || []
  return matches.map((arg) => {
    if (
      (arg.startsWith("'") && arg.endsWith("'")) ||
      (arg.startsWith('"') && arg.endsWith('"'))
    ) {
      return arg.slice(1, -1)
    }
    return arg
  })
}
