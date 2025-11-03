# Platform State

1. `cdp-portal-stubs` has a global [platformState variable](../src/api/platform-state-lambda/platform-state.js) this
   is our model of what exists in terraform and various other infrastructure.
1. On star tup it is populated by [src/config/init-platform-state.js](../src/config/init-platform-state.js) which
   inserts the default services:
   1. This data is basically like the `tenant.json/create` service payload
   1. This gets expanded into the lambda's model via helpers
      in [create-tenant](../src/api/platform-state-lambda/create-tenant.js#L33)
   1. Either add a vanity url helper or just poke the vanity urls onto the platformsState object on startup
1. To trigger the shuttering, look at
   the [github trigger handler](../src/api/github/controllers/trigger-workflow.js#L214-L219)
   1. This will
      call [trigger-shutter-vanity-urls](https://github.com/DEFRA/cdp-portal-stubs/blob/main/src/api/workflows/cdp-tf-waf/trigger-shuttered-vanity-urls.js#L9)
      when the shutter workflow is called
   1. Update this function to toggle the shutter flag on the relevant URL
   1. Once you've changed the state be sure to
      call [sendPlatformStatePayload](https://github.com/DEFRA/cdp-portal-stubs/blob/main/src/api/platform-state-lambda/send-platform-state-payload.js#L11)
      so the update goes back to portal. You can add a delay to the sqs message to simulate the time taken for shuttering
      to run in
