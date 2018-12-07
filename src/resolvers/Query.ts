import { prisma } from '../../generated/prisma-client';
import { api } from '../api/api';

const Query = {
  userBasics: async () => await prisma.userBasics(),
  consultingRecords: async () => await prisma.consultingRecords(),
  bookingRecords: async () => await prisma.bookingRecords()
};
export default Query;
