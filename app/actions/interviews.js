
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new interview
export async function createInterview(interviewData) {
  const newInterview = await prisma.interview.create({
    data: interviewData,
  });
  return newInterview;
}

// Get all interviews
export async function getAllInterviews() {
  const interviews = await prisma.interview.findMany();
  return interviews;
}

// Get interviews for a specific recruit
export async function getInterviewsByRecruit(recruitId) {
  const interviews = await prisma.interview.findMany({
    where: { recruitId },
  });
  return interviews;
}

// Get interviews for a specific job offer
export async function getInterviewsByJobOffer(jobOfferId) {
  const interviews = await prisma.interview.findMany({
    where: { jobOfferId },
  });
  return interviews;
}

// Get an interview by ID
export async function getInterviewById(interviewId) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
  });

  if (!interview) {
    throw new Error('Interview not found');
  }

  return interview;
}

// Update an interview
export async function updateInterview(interviewId, updateData) {
  const updatedInterview = await prisma.interview.update({
    where: { id: interviewId },
    data: updateData,
  });

  return updatedInterview;
}

// Delete an interview
export async function deleteInterview(interviewId) {
  const deletedInterview = await prisma.interview.delete({
    where: { id: interviewId },
  });

  return deletedInterview;
}