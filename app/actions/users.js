


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logActivity from '../../utils/logsActivites.js';




const prisma = new PrismaClient();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

export async function registerUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      role: userData.role, // e.g., "USER" or "RECRUITER"
    },
  });
  await logActivity(newUser.id, 'USER_REGISTERED', `User registered with email: ${newUser.email}`);
  return newUser;
}

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
  await logActivity(user.id, 'USER_LOGGED_IN', `User logged in with email: ${user.email}`);
  return { token, user };
}

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { recruit: true, recruiter: true },
  });
  return user;
}

export async function updateUserProfile(userId, updateData) {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, saltRounds);
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  await logActivity(userId, 'USER_PROFILE_UPDATED', `User profile updated for email: ${updatedUser.email}`);
  return updatedUser;
}

export async function deleteUser(userId) {
  await prisma.user.delete({ where: { id: userId } });
  await logActivity(userId, 'USER_DELETED', `User with ID ${userId} deleted`);
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function changeUserRole(userId, newRole) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  await logActivity(userId, 'USER_ROLE_CHANGED', `User role changed to ${newRole} for email: ${updatedUser.email}`);
  return updatedUser;
}

export async function getRecruiterInfo(userId){
  const recruiter = await prisma.user.findUnique({
    where:{id:userId},

    select:{
      recruiter:true
    }
  })
  return recruiter.recruiter
}

export async function getRecruitInfo(userId){
  const recruit = await prisma.user.findUnique({
    where:{id:userId},

    select:{
      recruit:true
    }
  })
  return recruit.recruit
}

export async function resetPassword(email, newPassword) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  await logActivity(user.id, 'PASSWORD_RESET', `Password reset for email: ${user.email}`);
}

export async function logoutUser(userId) {
  // Invalidate the session or JWT token here
  await logActivity(userId, 'USER_LOGGED_OUT', `User with ID ${userId} logged out`);
}
