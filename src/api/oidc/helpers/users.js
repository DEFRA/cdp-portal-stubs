const userAdmin = {
  username: 'Admin User',
  preferred_username: 'admin.user@oidc.mock',
  id: '90552794-0613-4023-819a-512aa9d40023',
  teams: ['aabe63e7-87ef-4beb-a596-c810631fc474']
}

const userNonAdmin = {
  username: 'Non-Admin User',
  email: 'nonadmin.user@oidc.mock',
  id: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
  teams: ['44c7fa74-40e7-470d-a18a-b78a60bbef8e']
}

const allUsers = {
  admin: userAdmin,
  nonAdmin: userNonAdmin
}

export { userAdmin, userNonAdmin, allUsers }
