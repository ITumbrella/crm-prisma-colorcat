import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../../generated/prisma-client';

const Mutation = {
  addUser: async (parent, args, context) => {
    // args.mainProject = { set: args.mainProject };
    // args.focusProject = { set: args.focusProject };
    // args.toBeDevelopedProject = { set: args.toBeDevelopedProject };
    // args.haveDoneInAnotherHospital = { set: args.haveDoneInAnotherHospital };
    // args.haveDoneInThisHospital = { set: args.haveDoneInThisHospital };
    // args.tag = { set: args.tag };
    const user = await prisma.createUserBasic(args);
    console.log(`${new Date()} addUserBasic`);
    return { success: true, userId: user.id };
  },
  addConsultingRecord: async (parent, args, context) => {
    await prisma.createConsultingRecord({
      advisoryDetail: args.advisoryDetail,
      advisoryResult: args.advisoryResult,
      advisoryWay: args.advisoryWay,
      advisorySummary: args.advisorySummary,
      user: { connect: { id: args.userId } }
    });

    console.log(`${new Date()} addConsultingRecord`);
    return { success: true };
  },
  addBookingRecord: async (parent, args, context) => {
    await prisma.createBookingRecord({
      user: { connect: { id: args.userId } },
      toHospitalCate: args.toHospitalCate,
      time: args.time
    });

    console.log(`${new Date()} addBookingRecord`);
    return { success: true };
  },
  addAd: async (parent, args, context) => {
    await prisma.createAd(args);
    return { success: true };
  },
  addAdConsumptionRec: async (parent, args, context) => {
    await prisma.createAdConsumptionRec(args);
    return { success: true };
  },
  addConsultationWork: async (parent, args, context) => {
    await prisma.createConsultationWork(args);
    return { success: true };
  },
  addDictionaryItem: async (parent, args, context) => {
    await prisma.createDictionary(args);
    return { success: true };
  },
  updateDictionaryItem: async (parent, args, context) => {
    await prisma.updateDictionary({
      data: { itemName: args.itemName },
      where: { id: args.id }
    });
    return { success: true };
  }
  //   const valid = await bcrypt.compare(password, user ? user.password : "");
  //   if (!valid || !user) {
  //     throw new Error("Invalid Credentials");
  //   }
  //   console.log(process.env.APP_SECRET);
  //   const token = jwt.sign({ userId: user.id }, process.env
  //     .APP_SECRET as jwt.Secret);
  //   return {
  //     id: user.id,
  //     token
  //   };
  // }
};
export default Mutation;
