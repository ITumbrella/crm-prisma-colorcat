import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../../generated/prisma-client';

const Mutation = {
  signup: async (parent, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    await prisma.createAdmin({
      name: args.name,
      userName: args.userName,
      password: password
    });

    return { success: true };
  },

  autoLogin: async (parent, args, context) => {
    const { userId } = jwt.verify(args.token, "crm-mc-colorcat") as {
      userId: string;
    };
    //续费
    const token = jwt.sign(
      { userId: userId },
      "crm-mc-colorcat" as jwt.Secret,
      { expiresIn: 60 }
    );
    return {
      userId: userId,
      token
    };
  },

  login: async (parent, args, context) => {
    const user = await prisma.admin({ userName: args.userName });
    const valid = await bcrypt.compare(
      args.password,
      user ? user.password : ""
    );
    if (!valid || !user) {
      throw new Error("Invalid Credentials");
    }
    const token = jwt.sign(
      { userId: user.id },
      "crm-mc-colorcat" as jwt.Secret,
      { expiresIn: 60 }
    );

    return {
      userId: user.id,
      token
    };
  },
  addUser: async (parent, args, context) => {
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
  updateAd: async (parent, args, context) => {
    await prisma.updateAd({
      data: {
        typeName: args.typeName,
        plan: args.plan,
        availiable: args.availiable
      },
      where: {
        id: args.id
      }
    });
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
    return await prisma.dictionaries();
  },
  updateDictionaryItem: async (parent, args, context) => {
    await prisma.updateDictionary({
      data: { itemName: args.itemName },
      where: { id: args.id }
    });
    return await prisma.dictionaries();
  },
  deleteDictionaryItem: async (parent, args, context) => {
    await prisma.deleteDictionary({ id: args.id });
    return await prisma.dictionaries();
  },
  deleteConsultationWork: async (parent, args, context) => {
    await prisma.deleteConsultationWork({ id: args.id });
    return { success: true };
  },
  deleteAdConsumption: async (parent, args, context) => {
    await prisma.deleteAdConsumptionRec({ id: args.id });
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
