import prisma from '../../../lib/prisma';
import { requireUser } from '../../../lib/auth';

export default async function handler(req, res) {
  const user = await requireUser(req);
  if (!user || user.role !== 'ADMIN') return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const body = req.body;
    try {
      await prisma.monthlyAdventure.create({
        data: {
          monthKey: body.monthKey,
          title: body.title,
          themeDescription: body.themeDescription,
          messageToDogTemplate: body.messageToDogTemplate,
          missionTitle: body.missionTitle,
          missionSteps: body.missionSteps,
          funFeatureType: body.funFeatureType,
          funFeatureContent: body.funFeatureContent
        }
      });
      return res.json({ success: true });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: 'Failed to create adventure' });
    }
  }

  if (req.method === 'PATCH') {
    const { id } = req.body;
    try {
      await prisma.monthlyAdventure.updateMany({ data: { isActive: false } });
      await prisma.monthlyAdventure.update({ where: { id }, data: { isActive: true } });
      return res.json({ success: true });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: 'Failed to set active adventure' });
    }
  }

  return res.status(405).end();
}
