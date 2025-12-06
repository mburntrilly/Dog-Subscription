import prisma from '../../lib/prisma';
import { requireUser } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { plan } = req.body;
  try {
    await prisma.subscription.update({
      where: { userId: user.id },
      data: { plan: plan || 'GOOD_DOG_9_99', status: 'ACTIVE', stripeSubscriptionId: 'mock_sub', stripeCustomerId: 'mock_customer' }
    });
    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update subscription' });
  }
}
