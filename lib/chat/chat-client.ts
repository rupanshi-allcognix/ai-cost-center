export default async function sendMessageToAgent(text: string) {
  const res = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: text })
  })
  if (!res.ok) throw new Error('Failed to send message')
  try { return await res.json() } catch { return null }
}
