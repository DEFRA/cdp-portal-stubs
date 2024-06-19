import { getRefsController } from '~/src/api/github/controllers/commits'

describe('Github Commits API', () => {
  let mockViewHandler
  describe('getRefsController', () => {
    mockViewHandler = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    }
    it('should return the latest ref', async () => {
      await getRefsController.handler(null, mockViewHandler)
      expect(mockViewHandler.response).toHaveBeenCalledWith({
        object: {
          sha: 'aa218f56b14c9653891f9e74264a383fa43fefbd'
        }
      })
      expect(mockViewHandler.code).toHaveBeenCalledWith(200)
    })
  })
})
