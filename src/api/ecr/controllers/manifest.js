import * as crypto from 'crypto'

const manifestController = {
  handler: async (request, h) => {
    const repo = request.params.repo

    const configSha256 = crypto.createHash('sha256').update(repo).digest('hex')

    const layerSha256 = crypto
      .createHash('sha256')
      .update('mock-app-layer.tgz')
      .digest('hex')

    const manifest = {
      schemaVersion: 2,
      mediaType: 'application/vnd.docker.distribution.manifest.v2+json',
      config: {
        mediaType: 'application/vnd.docker.container.image.v1+json',
        size: 4875,
        digest: `sha256:${configSha256}`
      },
      layers: [
        {
          mediaType: 'application/vnd.docker.image.rootfs.diff.tar.gzip',
          size: 31411405,
          digest: `sha256:${layerSha256}`
        }
      ]
    }

    return h.response(JSON.stringify(manifest)).code(200)
  }
}

export { manifestController }
