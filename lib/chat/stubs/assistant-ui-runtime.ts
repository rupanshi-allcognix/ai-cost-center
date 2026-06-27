export function createRuntime(config: any) {
  return { sendMessage: config.sendMessage, onMessage: config.onMessage }
}
