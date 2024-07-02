//@ts-check

import { PrismaClient } from '@prisma/client';
import logActivity from '../../utils/logsActivites.js';
import { expArray } from '../../utils/expArr.js';

const prisma = new PrismaClient();

export async function createJobOffer(userId, jobOfferData) {
  const recruiter = await prisma.recruiter.findUnique({ where: { userId } });

  if (recruiter?.role.toLocaleLowerCase() !== 'main') {
    throw new Error('Only main recruiters can create job offers.');
  }

  const {expId} = jobOfferData

  const exp = expArray[expId]
  delete jobOfferData.expId 

  const newJobOffer = await prisma.jobOffer.create({
    data: {
      ...jobOfferData,
      experience:exp,
      companyId: recruiter.companyId,
    },
  });
  
  await logActivity(userId, 'JOB_OFFER_CREATED', `Job offer created: ${newJobOffer.title}`);
  return newJobOffer;
}

export async function getJobOffer(jobOfferId, recruiterId) {
  const jobOffer = await prisma.jobOffer.findFirst({
    where: {
      id: jobOfferId,
      company: {
        recruiters: {
          some: {
            id: recruiterId,
          },
        },
      },
    },
  });
  
  return jobOffer;
}

/**
 * @param {number} jobOfferId
 * @param {number} recruiterId
 * @param {{ title: any; }} updateData
 */
export async function updateJobOffer(jobOfferId, recruiterId, updateData) {
  const recruiter = await prisma.recruiter.findUnique({ where: { id: recruiterId } });

  if (recruiter?.role !== 'main') {
    throw new Error('Only main recruiters can update job offers.');
  }

  const updatedJobOffer = await prisma.jobOffer.updateMany({
    where: {
      id: jobOfferId,
      company: {
        recruiters: {
          some: {
            id: recruiterId,
          },
        },
      },
    },
    data: updateData,
  });
  
  await logActivity(recruiterId, 'JOB_OFFER_UPDATED', `Job offer updated: ${updateData.title || ''}`);
  return updatedJobOffer;
}

export async function deleteJobOffer(jobOfferId, recruiterId) {
  const recruiter = await prisma.recruiter.findUnique({ where: { id: recruiterId } });

  if (recruiter?.role !== 'main') {
    throw new Error('Only main recruiters can delete job offers.');
  }

  const pendingApplications = await prisma.application.findMany({
    where: {
      jobOfferId,
      status: 'pending',
    },
  });

  await prisma.application.updateMany({
    where: {
      jobOfferId,
      status: 'pending',
    },
    data: {
      status: 'rejected',
    },
  });

  const deletedJobOffer = await prisma.jobOffer.deleteMany({
    where: {
      id: jobOfferId,
      company: {
        recruiters: {
          some: {
            id: recruiterId,
          },
        },
      },
    },
  });

  for (const application of pendingApplications) {
    await logActivity(application.recruitId, 'APPLICATION_REJECTED', `Application ID ${application.id} for job offer ID ${jobOfferId} rejected due to job offer deletion`);
  }

  await logActivity(recruiterId, 'JOB_OFFER_DELETED', `Job offer deleted with ID: ${jobOfferId}`);
  return deletedJobOffer;
}

export async function getAllJobOffers( params) {
  const {title, location, company} = params;
  const jobOffers = await prisma.jobOffer.findMany({
    where: {
      companyId: company ? parseInt(company) : undefined,
      title,
      location
    },
  });
  
  return jobOffers;
}
