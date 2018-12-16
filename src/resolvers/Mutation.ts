import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../../generated/prisma-client';

const Mutation = {
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
    const user = await prisma.admin({ id: userId });
    return {
      userId: userId,
      name: user.name,
      token,
      routePages: user.routePages
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
      name: user.name,
      token,
      routePages: user.routePages
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
  addDictionaryItem: async (parent, args, context) => {
    return await prisma.createDictionary(args);
  },
  updateDictionaryItem: async (parent, args, context) => {
    const item = await prisma.updateDictionary({
      data: { itemName: args.itemName, itemAvailiable: args.itemAvailiable },
      where: { id: args.id }
    });
    return item;
  },
  deleteDictionaryItem: async (parent, args, context) => {
    return prisma.deleteDictionary({ id: args.id });
  },

  //广告消费记录 mutations
  addAdConsumptionRec: async (parent, args, context) => {
    return await prisma.createAdConsumptionRec(args);
  },
  deleteAdConsumptionRec: async (parent, args, context) => {
    return await prisma.deleteAdConsumptionRec({ id: args.id });
  },
  updateAdConsumptionRec: async (parent, args, context) => {
    return await prisma.updateAdConsumptionRec({
      data: {
        typeName: args.typeName,
        plan: args.plan,
        displayAmount: args.displayAmount,
        clickAmount: args.clickAmount,
        consumption: args.consumption,
        time: args.time
      },
      where: {
        id: args.id
      }
    });
  },

  //系统用户权限
  signup: async (parent, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    const department = await prisma.department({ id: args.departmentId });
    return await prisma.createAdmin({
      routePages: { set: department.routePages },
      departmentName: department.name,
      availiable: true,
      name: args.name,
      userName: args.userName,
      password: password
    });
  },
  deleteAdmin: async (parent, args, context) => {
    return await prisma.deleteAdmin({ id: args.id });
  },
  updateAdmin: async (parent, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    const department = await prisma.department({ id: args.departmentId });
    return await prisma.updateAdmin({
      data: {
        availiable: args.availiable,
        routePages: { set: department.routePages },
        password: password,
        name: args.name
      },
      where: {
        id: args.id
      }
    });
  },
  updateAdminAvailiable: async (parent, args, context) => {
    return await prisma.updateAdmin({
      data: { availiable: args.availiable },
      where: { id: args.id }
    });
  },

  // 咨询工作量mutation
  addConsultationWork: async (parent, args, context) => {
    return await prisma.createConsultationWork(args);
  },
  deleteConsultationWork: async (parent, args, context) => {
    return await prisma.deleteConsultationWork({ id: args.id });
  },
  updateConsutationWork: async (parent, args, context) => {
    return await prisma.updateConsultationWork({
      data: {
        consultationType: args.consultationType,
        dialogA: args.dialogA,
        dialogB: args.dialogB,
        dialogC: args.dialogC,
        workTime: args.workTime
      },
      where: { id: args.id }
    });
  },

  // 部门 mutations
  addDepartment: async (parent, args, context) => {
    return await prisma.createDepartment({
      name: args.name,
      routePages: { set: args.routePages }
    });
  },
  updateDepartment: async (parent, args, context) => {
    return await prisma.updateDepartment({
      data: {
        name: args.name,
        routePages: { set: args.routePages }
      },
      where: {
        id: args.id
      }
    });
  },
  deleteDepartment: async (parent, args, context) => {
    return await prisma.deleteDepartment({ id: args.id });
  }
};
export default Mutation;
