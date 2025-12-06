import { authenticate, signUser } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  const user = await authenticate(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const header = signUser(user);
  res.setHeader('Set-Cookie', header);
  return res.json({ success: true, redirect: user.role === 'ADMIN' ? '/admin' : '/app' });
}
