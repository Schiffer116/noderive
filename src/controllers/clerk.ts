import { verifyWebhook } from '@clerk/express/webhooks'
import express from 'express'

import db from '../db/db.js'
import { account, directory } from '../db/schema.js'

const router = express.Router()

router.post('/webhooks/user', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await verifyWebhook(req)
    if (event.type !== 'user.created') {
      return res.status(204).end();
    }

    const { id, first_name } = event.data
    if (!id || !first_name) return res.status(400).send('Invalid event data')
    await db.transaction(async (tx) => {
      await tx.insert(account).values({ id, username: first_name })
      const [{ parentId }] = await tx.insert(directory).values({ name: 'My Drive', ownerId: id }).returning({ parentId: directory.id })

      await tx.insert(directory).values([
        { name: 'Documents', parentId, ownerId: id },
        { name: 'Pictures', parentId, ownerId: id },
        { name: 'Music', parentId, ownerId: id },
      ])
    })

    return res.send('Webhook received')

  } catch (err) {
    console.error('Error creating user', err)
    return res.status(400).send('Error creating user')
  }
})

export default router
