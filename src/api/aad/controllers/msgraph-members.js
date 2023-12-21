//  /msgraph/v1.0/groups/01048143-8312-4163-9c71-f29076d028ca/members/$ref

const msgraphMembers = {
  handler: async (request, h) => {
    return h.response().code(200)
  }
}

export { msgraphMembers }
