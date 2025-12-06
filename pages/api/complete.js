import prisma from '../../lib/prisma';
import { requireUser } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const dog = user.dogs[0];
  const adventure = await prisma.monthlyAdventure.findFirst({ where: { isActive: true } });
  if (!dog || !adventure) return res.status(400).json({ error: 'Missing data' });
  const existing = await prisma.adventureCompletion.findUnique({
    where: { dogId_monthlyAdventureId: { dogId: dog.id, monthlyAdventureId: adventure.id } }
  });
  const stepIndex = Number(req.body.stepIndex);
  const steps = new Set(existing?.stepsCompleted || []);
  if (steps.has(stepIndex)) {
    steps.delete(stepIndex);
  } else {
    steps.add(stepIndex);
  }
  const stepsArray = Array.from(steps).sort((a, b) => a - b);
  const isComplete = stepsArray.length >= (adventure.missionSteps?.length || 0);
  await prisma.adventureCompletion.upsert({
    where: { dogId_monthlyAdventureId: { dogId: dog.id, monthlyAdventureId: adventure.id } },
    update: { stepsCompleted: stepsArray, isComplete, completedAt: isComplete ? new Date() : null },
    create: { dogId: dog.id, monthlyAdventureId: adventure.id, stepsCompleted: stepsArray, isComplete, completedAt: isComplete ? new Date() : null }
  });
  return res.json({ success: true, stepsCompleted: stepsArray, isComplete });
}
