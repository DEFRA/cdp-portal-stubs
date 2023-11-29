import { oidcConfig } from '~/src/api/oidc/oidc-config'

function defaultClaims(session, ttl) {
  const now = Math.floor(Date.now() / 1000)
  return {
    aud: [oidcConfig.clientId], // Audience
    exp: now + ttl, // expires at
    jti: session.sessionId, // session id
    iat: now, // issued at
    iss: oidcConfig.issuerBase, // issuer
    nbf: now, // not before
    sub: session.user.id, // subject (i.e. user)
    amr: ['eid', 'urn:be:fedict:iam:fas:Level500'],
    azp: '63983fc2-cfff-45bb-8ec2-959e21062b9a', // azure something?
    azpacr: 1, // more azure stuff?
    groups: session.user.teams,
    name: session.user.username,
    preferred_username: session.user.email,
    oid: session.user.id, // should this be user id or a unique one
    upn: session.user.email,
    uti: 'E_C59uEkm0ZORgAi0cAA', // Token identifier claim, unique, per-token identifier that is case-sensitive
    ver: '2.0',
    wids: ['13bd1c72-6f4a-4dcf-985f-18d3b80f208a'],
    scp: 'cdp.user'
  }
}

export { defaultClaims }
