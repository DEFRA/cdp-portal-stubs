import * as crypto from 'crypto'
import { standardClaims } from '~/src/api/oidc/helpers/user-defaults'
import { keyId, oidcConfig } from '~/src/api/oidc/oidc'
import jsonwebtoken from 'jsonwebtoken'
import { jwk2pem } from 'pem-jwk'

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

function rsaKeyToJwk(key) {
  return {
    kty: 'RSA',
    n: Buffer.from(key.n, 'base64').toString('base64url'),
    e: Buffer.from(key.e, 'base64').toString('base64url'),
    alg: 'RS256',
    use: 'sig',
    kid: keyId
  }
}

function JWKS(publicKey) {
  return {
    keys: [rsaKeyToJwk(publicKey)]
  }
}

function generateToken(keyPair, session) {
  const privateKey = jwk2pem(keyPair.privateKey)
  const claim = standardClaims(session, oidcConfig.ttl)

  return jsonwebtoken.sign(claim, privateKey, {
    algorithm: 'RS256',
    keyid: keyId
  })
}

function generateIDToken(keyPair, session) {
  const privateKey = jwk2pem(keyPair.privateKey)
  const claims = standardClaims(session, oidcConfig.ttl)
  claims.nonce = session.nonce

  // TODO: add claims for user here
  return jsonwebtoken.sign(claims, privateKey, {
    algorithm: 'RS256',
    keyid: keyId
  })
}

function generateRefreshToken(keyPair, session) {
  const privateKey = jwk2pem(keyPair.privateKey)

  const claim = standardClaims(session, oidcConfig.refreshTtl)
  return jsonwebtoken.sign(claim, privateKey, {
    algorithm: 'RS256',
    keyid: keyId
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
function keyID(keypair) {
  const pem = jwk2pem(keypair.publicKey)
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
  generateRSAKeyPair,
  rsaKeyToJwk,
  JWKS,
  generateToken,
  generateIDToken,
  generateRefreshToken,
  generateCodeChallenge,
  keyID
}
