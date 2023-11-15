import { allServices } from '~/src/config/services'
import * as crypto from 'crypto'
import { config } from '~/src/config'

const blobController = {
  handler: async (request, h) => {
    const blobId = request.params.blobId

    const blobs = configBlobs()
    if (blobs[blobId]) {
      return h.response(JSON.stringify(blobs[blobId])).code(200)
    }

    if (fileBlobs[blobId]) {
      return h.file(fileBlobs[blobId])
    }

    return h.response().code(404)
  }
}

const mockAppLayerHash = `sha256:${crypto
  .createHash('sha256')
  .update('mock-app-layer.tgz')
  .digest('hex')}`
const fileBlobs = {
  [mockAppLayerHash]: 'mock-app-layer.tgz'
}

const configBlobs = () => {
  const configBlobs = {}
  allServices().forEach((s) => {
    // note: this isn't actually what docker is hashing, we're just generating it this way since its
    // derministic and reasonably representative of the real thing.
    const org = config.get('githubOrg')
    const hash = crypto.createHash('sha256')
    hash.update(s)
    const sha256 = hash.digest('hex')

    configBlobs[`sha256:${sha256}`] = generateConfig(org, s)
  })
  return configBlobs
}

const generateConfig = (org, service) => {
  return {
    architecture: 'amd64',
    config: {
      Hostname: '',
      Domainname: '',
      User: '',
      AttachStdin: false,
      AttachStdout: false,
      AttachStderr: false,
      ExposedPorts: {
        '443/tcp': {},
        '80/tcp': {}
      },
      Tty: false,
      OpenStdin: false,
      StdinOnce: false,
      Env: [],
      Cmd: null,
      Image:
        'sha256:2a3b4d813d03ff4c6333f44e431469235ac3372b5923600438514e7c55ffcd99',
      Volumes: null,
      WorkingDir: '/app',
      Entrypoint: ['dotnet', 'Defra.Cdp.Deployments.dll'],
      OnBuild: null,
      Labels: {
        'defra.cdp.git.repo.url': `https://github.com/${org}/${service}`,
        'defra.cdp.service.name': service
      }
    },
    container:
      'd8ceb8cc445b3e9292a17b41693b14c7c7e8a9b7dbfe12b7661f63b772539c6f',
    container_config: {
      Hostname: 'd8ceb8cc445b',
      Domainname: '',
      User: '',
      AttachStdin: false,
      AttachStdout: false,
      AttachStderr: false,
      ExposedPorts: {
        '443/tcp': {},
        '80/tcp': {}
      },
      Tty: false,
      OpenStdin: false,
      StdinOnce: false,
      Env: [],
      Cmd: [
        '/bin/sh',
        '-c',
        '#(nop) ',
        'LABEL defra.cdp.service.name=cdp-deployments'
      ],
      Image:
        'sha256:2a3b4d813d03ff4c6333f44e431469235ac3372b5923600438514e7c55ffcd99',
      Volumes: null,
      WorkingDir: '/app',
      Entrypoint: ['dotnet', 'Defra.Cdp.Deployments.dll'],
      OnBuild: null,
      Labels: {
        'defra.cdp.git.repo.url':
          'https://github.com/defra-cdp-sandpit/cdp-deployments',
        'defra.cdp.service.name': 'cdp-deployments'
      }
    },
    created: '2023-04-11T13:32:11.321678253Z',
    docker_version: '20.10.23+azure-2',
    history: [],
    os: 'linux',
    rootfs: {
      type: 'layers',
      diff_ids: []
    }
  }
}

export { blobController }
