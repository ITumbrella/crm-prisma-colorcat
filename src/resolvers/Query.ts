import { prisma } from "../../generated/prisma-client";

const Query = {
  userBasics: async () => await prisma.userBasics(),
  consultingRecords: async () => await prisma.consultingRecords(),
  bookingRecords: async () => await prisma.bookingRecords(),
  dictionaries: async () => await prisma.dictionaries()
};
export default Query;
