import { verifyWebhook } from '@clerk/express/webhooks'
import express from 'express'
import { eq } from 'drizzle-orm'

import db from '../db/db.js'
import { account } from '../db/schema.js'
import { getAuth, requireAuth } from '@clerk/express'

const router = express.Router()

router.post('/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await verifyWebhook(req)

    if (event.type === 'user.created') {
      const { id, username } = event.data
      await db.insert(account).values({ id, username })
      return res.send('Webhook received')
    }
    return
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
})

router.get("/dashboard", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { id } = await db.query.directory.findFirst({
      columns: { id: true },
      where: eq(account.id, userId),
    });
    return res.redirect(`/drive/${id}`);

  } catch (err) {
    console.error(err);
    return res.redirect("/error");
  }
});

export default router
