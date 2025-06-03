import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.headers['auth-token'] || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}