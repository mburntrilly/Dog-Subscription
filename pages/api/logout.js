import { clearUser } from '../../lib/auth';

export default function handler(req, res) {
  const header = clearUser();
  res.setHeader('Set-Cookie', header);
  res.writeHead(302, { Location: '/login' });
  res.end();
}
