//@ts-check

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new application
export async function createApplication(applicationData, recruitId) {
  const jobOffer = await prisma.jobOffer.findUnique({
    where: { id: applicationData.jobOfferId },
  });

  if (!jobOffer) {
    throw new Error('Job offer not found');
  }

  const newApplication = await prisma.application.create({
    data: {
      recruitId,
      jobOfferId: applicationData.jobOfferId,
      status: 'pending',
    },
  });

  return newApplication;
}

// Get all applications (for system admin)
export async function getAllApplications() {
  const applications = await prisma.application.findMany();
  return applications;
}

// Get all applications for a specific recruit
export async function getApplicationsByRecruit(recruitId) {
  const applications = await prisma.application.findMany({
    where: { recruitId },
    include:{
      jobOffer:{include:{company:true}}
    }
  });
  return applications;
}

// Get all applications for a specific job offer
export async function getApplicationsByJobOffer(jobOfferId, companyId) {
  const applications = await prisma.application.findMany({
    where: { jobOfferId},
    include:{jobOffer:true}
  });

  const validApplications = applications.filter((i)=> i.jobOffer?.companyId === companyId )

  return validApplications
}

// Get an application by ID
export async function getApplicationById(applicationId) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  return application;
}

// Update application status
export async function updateApplicationStatus(applicationId, status) {
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  return updatedApplication;
}

// Delete an application
export async function deleteApplication(applicationId) {
  const deletedApplication = await prisma.application.delete({
    where: { id: applicationId },
  });

  return deletedApplication;
}
