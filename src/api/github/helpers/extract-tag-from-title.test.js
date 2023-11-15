import { extractTagFromTitle } from '~/src/api/github/helpers/extract-tag-from-title'

describe('#extract-tag-from-title', () => {
  test('pulls valid params out of title', () => {
    const title = 'Deploy foo:1.2.3 in prod protected cluster'

    const { service, version, environment } = extractTagFromTitle(title)

    expect(service).toBe('foo')
    expect(version).toBe('1.2.3')
    expect(environment).toBe('prod')
  })
})
