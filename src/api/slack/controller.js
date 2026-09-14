export const getSlackChannelsController = {
  handler: (request, h) => {
    return h
      .response({
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'random',
            name_normalized: 'random',
            created: '2017-09-15T10:30:59+00:00',
            is_private: false,
            is_archived: false
          },
          {
            id: '2',
            name: 'general',
            name_normalized: 'general',
            created: '2017-09-15T10:30:59+00:00',
            is_private: false,
            is_archived: false
          },
          {
            id: '3',
            name: 'cdp-platform-alerts',
            name_normalized: 'cdp-platform-alerts',
            created: '2017-11-14T09:55:40+00:00',
            is_private: false,
            is_archived: false
          },
          {
            id: '4',
            name: 'private-channel',
            name_normalized: 'private-channel',
            created: '2017-11-14T09:55:40+00:00',
            is_private: true,
            is_archived: false
          },
          {
            id: '5',
            name: 'archived-channel',
            name_normalized: 'archived-channel',
            created: '2017-11-14T09:55:40+00:00',
            is_private: false,
            is_archived: true
          },
          {
            id: '6',
            name: 'private-archived-channel',
            name_normalized: 'private-archived-channel',
            created: '2017-11-14T09:55:40+00:00',
            is_private: true,
            is_archived: true
          }
        ]
      })
      .code(200)
  }
}
