export function workflowEvent(type, payload) {
  return {
    eventType: type,
    timestamp: new Date().toISOString(),
    payload
  }
}
