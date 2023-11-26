import * as crypto from 'crypto'
import { defaultClaims } from '~/src/api/oidc/helpers/default-claims'
import { oidcConfig } from '~/src/api/oidc/oidc-config'
import jsonwebtoken from 'jsonwebtoken'
import { jwk2pem } from 'pem-jwk'

function loadOIDCKeys() {
  const jwk = generateRSAKeyPair()
  const pem = {
    publicKey: jwk2pem(jwk.publicKey),
    privateKey: jwk2pem(jwk.privateKey)
  }
  const keyId = keyID(pem.publicKey)
  return {
    jwk,
    keyId,
    pem
  }
}

function generateRSAKeyPair() {
  // TODO: load these from file so they remain the same between restarts
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // 2048 bits is recommended for RSA keys
    publicKeyEncoding: {
      type: 'spki',
      format: 'jwk'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'jwk'
    }
  })
}

function JWKS(keys) {
  const jwks = {
    kty: 'RSA',
    n: Buffer.from(keys.jwk.publicKey.n, 'base64').toString('base64url'),
    e: Buffer.from(keys.jwk.publicKey.e, 'base64').toString('base64url'),
    alg: 'RS256',
    use: 'sig',
    kid: keys.keyId
  }

  return {
    keys: [jwks]
  }
}

function generateToken(keys, session) {
  const claim = defaultClaims(session, oidcConfig.ttl)
  return jsonwebtoken.sign(claim, keys.pem.privateKey, {
    algorithm: 'RS256',
    keyid: keys.keyId
  })
}

function generateIDToken(keys, session) {
  const claim = defaultClaims(session, oidcConfig.ttl)
  claim.nonce = session.nonce
  return jsonwebtoken.sign(claim, keys.pem.privateKey, {
    algorithm: 'RS256',
    keyid: keys.keyId
  })
}

function generateRefreshToken(keys, session) {
  const claim = defaultClaims(session, oidcConfig.refreshTtl)
  return jsonwebtoken.sign(claim, keys.pem.privateKey, {
    algorithm: 'RS256',
    keyid: keys.keyId
  })
}

function generateCodeChallenge(method, codeVerifier) {
  switch (method) {
    case 'plain':
      return codeVerifier
    case 'S256':
      return sha256(codeVerifier)
    default:
      return null
  }
}

// If not manually set, computes the JWT headers' `kid`
function keyID(pem) {
  const publicKey = crypto.createPublicKey({
    key: pem,
    format: 'pem',
    type: 'spki'
  })
  const publicKeyDER = publicKey.export({ type: 'spki', format: 'der' })

  return sha256(publicKeyDER)
}

function sha256(input) {
  const sha256 = crypto.createHash('sha256').update(input).digest()
  return sha256
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export {
  loadOIDCKeys,
  JWKS,
  generateToken,
  generateIDToken,
  generateRefreshToken,
  generateCodeChallenge,
  sha256
}
