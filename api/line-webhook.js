import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const signature = req.headers['x-line-signature']
  if (!verifySignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const events = req.body?.events ?? []

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text

      if (text.startsWith('BOOKING:')) {
        await notifyAdmin(text)
      }
    }
  }

  res.status(200).json({ status: 'ok' })
}

function verifySignature(body, signature) {
  if (!process.env.LINE_CHANNEL_SECRET || !signature) return false
  const hash = crypto
    .createHmac('sha256', process.env.LINE_CHANNEL_SECRET)
    .update(JSON.stringify(body))
    .digest('base64')
  return hash === signature
}

async function notifyAdmin(text) {
  const adminId = process.env.LINE_ADMIN_USER_ID
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  if (!adminId || !token) return

  await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: adminId,
      messages: [{ type: 'text', text: `New booking received:\n${text}` }],
    }),
  })
}
