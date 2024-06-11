

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function logActivity(userId, action, description) {
  await prisma.activityLog.create({
    data: {
      action,
      description,
      user: {
        connect: { id: userId },
      },
    },
  });
}

export default logActivity;
