import { getSession } from '../utils/auth.js';

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const session = await getSession(token);

  if (!session) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  req.user = session.user;
  next();
}
