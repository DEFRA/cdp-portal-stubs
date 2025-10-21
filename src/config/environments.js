const environmentMappings = {
  prod: '111111111',
  'perf-test': '222222222',
  dev: '333333333',
  test: '444444444',
  management: '666666666',
  'infra-dev': '777777777',
  'ext-test': '888888888'
}

const environments = Object.keys(environmentMappings)

export { environmentMappings, environments }
