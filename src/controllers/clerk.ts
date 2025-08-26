import { verifyWebhook } from '@clerk/express/webhooks'
import express from 'express'

import db from '../db/db.js'
import { account } from '../db/schema.js'

const router = express.Router()

router.post('/webhooks/user', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await verifyWebhook(req)

    if (event.type === 'user.created') {
      const { id, first_name } = event.data
      if (!id || !first_name) return res.status(400).send('Invalid event data')
      await db.insert(account).values({ id, username: first_name })
      return res.send('Webhook received')
    }
    return
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
})

export default router
