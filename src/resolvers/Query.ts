import { prisma } from '../../generated/prisma-client';

const Query = {
  userBasics: async () => await prisma.userBasics(),
  consultingRecords: async () => await prisma.consultingRecords(),
  bookingRecords: async () => await prisma.bookingRecords(),
  dictionaries: async () => await prisma.dictionaries(),
  ads: async () => await prisma.ads(),
  adConsumptions: async () => await prisma.adConsumptionRecs(),
  consultationWorks: async () => await prisma.consultationWorks(),
  admins: async () => await prisma.admins(),
  departments: async () => await prisma.departments()
};
export default Query;
