//@ts-check

import express from 'express';
import { authenticateToken } from '../actions/auth.js';
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser, getAllUsers, changeUserRole, resetPassword, logoutUser } from '../actions/users.js';


const userRouter = express.Router();


/**
 * @swagger
 * tags:
 *  name: User
 *  description: API endpoints to manage users
 *  
 */


// Register a new user
userRouter.post('/register', async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful login
 *         headers:
 *           Set-Cookie:
 *             description: Swagger won't return this value inspect it in network tab
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly
 *         
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// Login user
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password);
    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
      maxAge: 3600000, // 1 hour
    });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Protected routes
userRouter.use(authenticateToken);

// Routes below this middleware require authentication

// Get user profile
userRouter.get('/profile/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const userProfile = await getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
userRouter.put('/profile/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const updatedProfile = await updateUserProfile(userId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
userRouter.delete('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    await deleteUser(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
userRouter.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change user role
userRouter.patch('/:userId/role', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { newRole } = req.body;
  try {
    const updatedUser = await changeUserRole(userId, newRole);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset user password
userRouter.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await resetPassword(email, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/logout/{userId}:
 *   post:
 *     summary: Logout User
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the recruit
 *     security:
 *       - AccessToken: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recruit'
 *       401:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Logout user
userRouter.post('/logout/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    res.clearCookie('token')
    await logoutUser(userId);
    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default userRouter;
