import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCompany(companyData, recruiterId) {
  const newCompany = await prisma.company.create({
    data: {companyData, recruiters:{connect:{id:recruiterId}} },
  });
  return newCompany;
}

export async function getCompanyById(companyId, recruiterId) {
  const recruiter = await prisma.recruiter.findUnique({
    where: { id: recruiterId },
  });

  if (!recruiter || recruiter.companyId !== companyId) {
    throw new Error('Unauthorized access');
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });
  return company;
}

export async function updateCompany(companyId, updateData, recruiterId) {
  const recruiter = await prisma.recruiter.findUnique({
    where: { id: recruiterId },
  });

  if (!recruiter || recruiter.companyId !== companyId) {
    throw new Error('Unauthorized access');
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: updateData,
  });
  return updatedCompany;
}

export async function deleteCompany(companyId, recruiterId) {
  const recruiter = await prisma.recruiter.findUnique({
    where: { id: recruiterId },
  });

  if (!recruiter || recruiter.companyId !== companyId) {
    throw new Error('Unauthorized access');
  }

  await prisma.company.delete({
    where: { id: companyId },
  });
  return { message: `Company with ID ${companyId} deleted successfully` };
}

export async function getAllCompanies(userId) {

    try {
        const sysAdd = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(sysAdd.role !== 'sysAdd'){
            throw new Error("Unauthorized Access")
            
        }
      
      const companies = await prisma.company.findMany({
        
      });
      return companies;
    } catch (error) {
        console.log(error)
        return error.message
    }
}
