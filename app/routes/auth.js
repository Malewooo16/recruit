

import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import logActivity from '../../utils/logsActivites.js';
import { authenticateToken } from '../actions/auth.js';


const authRouter = express.Router();
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;
const saltRounds = 10;

authRouter.use(authenticateToken)

// Register new user
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    });
    await logActivity(newUser.id, 'USER_REGISTERED', `User registered with email: ${newUser.email}`);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login with credentials
authRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ error: info ? info.message : 'Login failed' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      logActivity(user.id, 'USER_LOGGED_IN', `User logged in with email: ${user.email}`);
      console.log(req.user)
      return res.json(req.user);
    });
  })(req, res, next);
});

// Google OAuth login route
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, jwtSecret, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  logActivity(req.user.id, 'USER_LOGGED_IN', `User logged in with Google: ${req.user.email}`);
  res.redirect('/');
});

// Logout route
authRouter.get('/logout', (req, res, next) => {
    logActivity(req.user.id, 'USER_LOGGED_OUT', `User with ID ${req.user.id} logged out`);
    res.clearCookie('token');
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


authRouter.get('/me', (req, res) => {
    console.log(req.user)
    if (req.user !== null) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.status(401).json({ authenticated: false, message: 'Not authenticated' });
    }
  });

export default authRouter;
