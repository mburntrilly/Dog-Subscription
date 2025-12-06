import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signUser } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password, dogName, birthMonth, plan, addressLine1, city, state, postalCode } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'MEMBER',
        addressLine1,
        city,
        state,
        postalCode,
        subscription: {
          create: {
            plan: plan || 'GOOD_DOG_9_99',
            status: 'TRIALING'
          }
        },
        dogs: {
          create: {
            name: dogName,
            birthMonth: Number(birthMonth)
          }
        }
      },
      include: { subscription: true, dogs: true }
    });

    const header = signUser(user);
    res.setHeader('Set-Cookie', header);
    return res.json({ success: true, user: { id: user.id } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}
