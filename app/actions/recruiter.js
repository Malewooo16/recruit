// @ts-check

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import logActivity from '../../utils/logsActivites.js';


const prisma = new PrismaClient();
const saltRounds = 10;

export async function registerRecruiter(recruiterData) {
  const { email, password, ...rest } = recruiterData;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'RECRUITER', // Assuming role for recruiter
      
    },
  });

  const newRecruiter = await prisma.recruiter.create({
    data: {
      userId: newUser.id,
      email,
      ...rest,
    },
  });

  await logActivity(newUser.id, 'RECRUITER_REGISTERED', `Recruiter registered with ID: ${newRecruiter.id}`);
  return newRecruiter;
}

export async function fetchRecruiterProfile(recruiterId) {
  const recruiter = await prisma.recruiter.findUnique({
    where: { id: recruiterId },
    include: { user: true },
  });
  return recruiter;
}

export async function updateRecruiterProfile(recruiterId, updateData) {
  const updatedRecruiter = await prisma.recruiter.update({
    where: { id: recruiterId },
    data: updateData,
  });
  await logActivity(recruiterId, 'RECRUITER_PROFILE_UPDATED', `Recruiter profile updated for ID: ${recruiterId}`);
  return updatedRecruiter;
}

export async function deleteRecruiter(recruiterId) {
  await prisma.recruiter.delete({ where: { id: recruiterId } });
  await logActivity(recruiterId, 'RECRUITER_DELETED', `Recruiter with ID ${recruiterId} deleted`);
}
