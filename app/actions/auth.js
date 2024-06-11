import jwt from 'jsonwebtoken';

/**
 * @typedef {Object} User
 * @property {number} userId - The user ID
 * @property {string} role - The user's role
 */

/**
 * Middleware to authenticate JWT token.
 * @param {import('express').Request & { user?: User }} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {import('express').NextFunction} next - The next middleware function
 */
export function authenticateToken(req, res, next) {
  const token = req.cookies.token; // Read token from cookie
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded; // Set decoded token payload to req.user
    next();
  });
}
