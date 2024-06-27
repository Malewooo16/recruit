// recruitActions.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import logActivity from '../../utils/logsActivites.js';

const prisma = new PrismaClient();
const saltRounds = 10;

export async function registerRecruit(recruitData) {
  const { email, password, ...rest } = recruitData;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'RECRUIT', // Assuming role for recruit
     
    },
  });

  const newRecruit = await prisma.recruit.create({
    data: {
      userId: newUser.id,
      email,
      ...rest,
    },
  });

  await logActivity(newUser.id, 'RECRUIT_REGISTERED', `Recruit registered with ID: ${newRecruit.id}`);
  return newRecruit;
}

export async function fetchRecruitProfile(recruitId) {
  const user = await prisma.user.findUnique({
    where: { id: recruitId },
    include: { recruit: true },
  });
 console.log(user.recruit)
  if(user.recruit !== null)
    return user.recruit;
}

export async function updateRecruitProfile(recruitId, updateData) {
  const updatedRecruit = await prisma.recruit.update({
    where: { id: recruitId },
    data: updateData,
  });
  await logActivity(recruitId, 'RECRUIT_PROFILE_UPDATED', `Recruit profile updated for ID: ${recruitId}`);
  return updatedRecruit;
}

export async function deleteRecruit(recruitId) {
  await prisma.recruit.delete({ where: { id: recruitId } });
  await logActivity(recruitId, 'RECRUIT_DELETED', `Recruit with ID ${recruitId} deleted`);
}
