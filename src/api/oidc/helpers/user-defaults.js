import { oidcConfig } from '~/src/api/oidc/oidc'

function standardClaims(session, ttl) {
  const now = Math.floor(Date.now() / 1000)
  return {
    aud: [oidcConfig.clientId], // Audience should this be an array?
    exp: now + ttl, // expires at
    jti: session.sessionId, // session id
    iat: now, // issued at
    iss: oidcConfig.issuerBase, // TODO: is this right or is it just the host, wireshark to find out i guess
    nbf: now, // not before
    sub: session.user.id, // subject (i.e. user)
    amr: ['eid', 'urn:be:fedict:iam:fas:Level500'],
    azp: '63983fc2-cfff-45bb-8ec2-959e21062b9a', // azure something?
    azpacr: 1,
    groups: ['aabe63e7-87ef-4beb-a596-c810631fc474'],
    name: session.user.username,
    preferred_username: 'test@user.com',
    oid: '62bb35d2-d4f2-4cf6-abd3-262d99727677', // ??
    scope: 'openid read api',
    upn: 'test@user.com',
    uti: 'E_C59uEkm0ZORgAi0cAA',
    ver: '2.0',
    wids: ['13bd1c72-6f4a-4dcf-985f-18d3b80f208a']
  }
}

export { standardClaims }
