import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../../generated/prisma-client';
import { Certify, Identity } from '../utils';

const Mutation = {
  autoLogin: async (parent, args, context) => {
    const { userId } = jwt.verify(args.token, "crm-mc-colorcat") as {
      userId: string;
    };
    //续费
    const token = jwt.sign(
      { userId: userId },
      "crm-mc-colorcat" as jwt.Secret,
      { expiresIn: "24h" }
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
      { expiresIn: "24h" }
    );

    return {
      userId: user.id,
      name: user.name,
      token,
      routePages: user.routePages,
      departmentId: user.departmentId
    };
  },
  addConsultingRecord: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    await prisma.createConsultingRecord({
      advisoryDetail: payload.advisoryDetail,
      advisoryResult: payload.advisoryResult,
      advisoryWay: payload.advisoryWay,
      advisorySummary: payload.advisorySummary,
      user: { connect: { id: payload.userId } },
      creator: payload.creator,
      creatorId: payload.creatorId
    });

    console.log(`${new Date()} addConsultingRecord`);
    return { success: true };
  },
  addAd: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    await prisma.createAd(payload);
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

  //预约记录
  addBookingRecord: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    const br = await prisma.createBookingRecord({
      ...payload,
      user: { connect: { id: payload.userId } }
    });
    console.log(`${new Date()} addBookingRecord`);
    return br;
  },
  updateBookingRecord: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Editor);
    delete payload["id"];
    const record = await prisma.updateBookingRecord({
      data: payload,
      where: {
        id: args.id
      }
    });
    console.log(`${new Date()} updateBookingRecord by ${payload.editor}`);
    return record;
  },
  deleteBookingRecord: async (parent, args, context) => {
    return await prisma.deleteBookingRecord({ id: args.id });
  },

  //用户操作
  rechargeBalance: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Editor);
    const flowBalance = await prisma
      .userBasic({ id: payload.id })
      .flowBalance();
    return await prisma.updateUserBasic({
      data: { flowBalance: flowBalance + args.balance },
      where: { id: args.id }
    });
  },
  addUser: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    const user = await prisma.createUserBasic(payload);
    console.log(`${new Date().toString()} addUserBasic`);
    return { success: true, userId: user.id };
  },
  updateUserBasic: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Editor);
    const id = payload.id;
    delete payload["id"];
    const user = await prisma.updateUserBasic({
      data: payload,
      where: { id }
    });
    console.log(`${new Date().toString()} updated User by ${payload.editor}`);
    return user;
  },
  deleteUser: async (parent, args, context) => {
    await prisma.deleteUserBasic({ id: args.id });
    console.log(`${new Date().toString()} deleteUser`);
    return { success: true };
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
  //字典
  addDictionaryItem: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    return await prisma.createDictionary(payload);
  },
  updateDictionaryItem: async (parent, args, context) => {
    const item = await prisma.updateDictionary({
      data: {
        itemName: args.itemName,
        itemAvailiable: args.itemAvailiable,
        sortIndex: args.sortIndex,
        rootIndex: args.rootIndex,
        ps: args.ps
      },
      where: { id: args.id }
    });
    return item;
  },
  deleteDictionaryItem: async (parent, args, context) => {
    return prisma.deleteDictionary({ id: args.id });
  },

  //系统用户权限
  signup: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    const password = await bcrypt.hash(args.password, 10);
    const department = await prisma.department({ id: args.departmentId });
    return await prisma.createAdmin({
      routePages: { set: department.routePages },
      departmentName: department.name,
      departmentId: department.id,
      availiable: true,
      name: args.name,
      userName: args.userName,
      password: password,
      creator: payload.creator,
      creatorId: payload.creatorId
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
    const payload = await Certify(context, args, Identity.Creator);
    return await prisma.createConsultationWork(payload);
  },
  deleteConsultationWork: async (parent, args, context) => {
    return await prisma.deleteConsultationWork({ id: args.id });
  },
  updateConsutationWork: async (parent, args, context) => {
    args = await Certify(context, args, Identity.Editor);
    return await prisma.updateConsultationWork({
      data: args,
      where: { id: args.id }
    });
  },

  // 部门 mutations
  addDepartment: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    return await prisma.createDepartment({
      parentId: payload.parentId,
      name: payload.name,
      routePages: { set: payload.routePages },
      creator: payload.creator,
      creatorId: payload.creatorId
    });
  },
  updateDepartment: async (parent, args, context) => {
    const oldDepartment = await prisma.department({ id: args.id });
    const department = await prisma.updateDepartment({
      data: {
        name: args.name,
        routePages: { set: args.routePages },
        parentId: args.parentId
      },
      where: {
        id: args.id
      }
    });
    await prisma.updateManyAdmins({
      data: {
        departmentName: department.name,
        routePages: { set: department.routePages }
      },
      where: {
        departmentName: oldDepartment.name
      }
    });
    return department;
  },
  deleteDepartment: async (parent, args, context) => {
    return await prisma.deleteDepartment({ id: args.id });
  },

  //机构
  addAgency: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    return await prisma.createAgency(payload);
  },
  updateAgency: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Editor);

    const id = payload.id;
    delete payload["id"];

    return await prisma.updateAgency({
      data: payload,
      where: {
        id: id
      }
    });
  },
  deleteAgency: async (parent, args, context) =>
    await prisma.deleteAgency({ id: args.id }),

  // 回访任务
  addReturnVisitTask: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    return await prisma.createReturnVisitTask(payload);
  },
  updateReturnVisitTask: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Editor);

    const id = payload.id;
    delete payload["id"];

    return await prisma.updateReturnVisitTask({
      data: payload,
      where: {
        id: id
      }
    });
  },
  deleteReturnVisitTask: async (parent, args, context) =>
    await prisma.deleteReturnVisitTask({ id: args.id }),

  // 回访记录
  addReturnVisitRecord: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    return await prisma.createReturnVisitRecord(payload);
  },
  updateReturnVisitRecord: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Editor);

    const id = payload.id;
    delete payload["id"];

    return await prisma.updateReturnVisitRecord({
      data: payload,
      where: {
        id: id
      }
    });
  },
  deleteReturnVisitRecord: async (parent, args, context) =>
    await prisma.deleteReturnVisitRecord({ id: args.id }),

  // 消费记录添加
  addPayment: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    const billId = payload.billId;
    delete payload[billId];
    console.log(payload);

    return await prisma.createPayment({
      bill: { connect: { id: args.billId } },
      ...payload,
      paymentWay: -1,
      confirmed: false
    });
  },
  deleteBill: async (parent, args, context) => {
    return await prisma.deleteBill({ id: args.id });
  },
  pay: async (parent, args, context) => {
    const payment = await prisma.payment({ id: args.id });
    if (payment.confirmed)
      throw { errors: "This payment has been paid.", code: 202 };
    const bill = await prisma.payment({ id: args.id }).bill();
    const user = await prisma
      .payment({ id: args.id })
      .bill()
      .user();
    const usedBalance = payment.balance;
    if (usedBalance > user.flowBalance + user.freezingBalance)
      throw { errors: "balance not enough", code: 202 };
    if (user.freezingBalance < usedBalance) {
      await prisma.updateUserBasic({
        data: {
          freezingBalance: 0,
          flowBalance: user.flowBalance - (usedBalance - user.freezingBalance)
        },
        where: { id: user.id }
      });
      console.log("冻结余额不足，活动余额抵扣 Pay()");
    } else {
      console.log("冻结余额抵扣 Pay()");
      await prisma.updateUserBasic({
        data: {
          freezingBalance: user.freezingBalance - usedBalance
        },
        where: { id: user.id }
      });
    }
    const newPayment = await prisma.updatePayment({
      data: {
        confirmed: true,
        paymentWay: args.paymentWay,
        paymentPS: args.paymentPS
      },
      where: { id: args.id }
    });
    let newBillStatus: string;
    switch (payment.paymentType) {
      case "付订金":
        newBillStatus = "已付订金";
        break;
      case "付部分款":
        newBillStatus = "已付部分款";
        break;
      case "付全款":
      case "补欠款":
      case "补订金余款":
        newBillStatus = "已付全款";
      default:
        break;
    }
    await prisma.updateBill({
      data: {
        paymentStatus: newBillStatus,
        paid: bill.paid + payment.shouldPay + payment.balance,
        isOnlyDepositBill: payment.paymentType !== "付订金" ? false : true
      },
      where: { id: bill.id }
    });
    console.log(`${new Date().toString()} updateBillStatus Pay()`);
    return newPayment;
  },
  //添加消费单
  addBill: async (parent, args, context) => {
    const payload = await Certify(context, args, Identity.Creator);
    const billDetail = [];
    for (const detail of payload.billDetail) billDetail.push(detail.project);

    const bill = await prisma.createBill({
      creator: payload.creator,
      creatorId: payload.creatorId,
      totalPrice: payload.totalPrice,
      user: { connect: { id: args.userId } },
      idCode: new Date().toString(),
      billDetail: { set: billDetail },
      paymentStatus: "未收费",
      discount: payload.discount,
      deposit: payload.depositReadyIn,
      isOnlyDepositBill: payload.isOnlyDepositBill
    });
    for (const detail of payload.billDetail) {
      await prisma.createBillDetail({
        billId: bill.id,
        creator: payload.creator,
        creatorId: payload.creatorId,
        project: detail.project,
        amount: detail.amount,
        quantifier: detail.quantifier,
        unitPrice: detail.unitPrice
      });
    }
    console.log(`${new Date()} addBill and details`);
    const userName = (await prisma.bill({ id: bill.id }).user()).name;
    await prisma.createPayment({
      creator: payload.creator,
      creatorId: payload.creatorId,
      bill: { connect: { id: bill.id } },
      balance: payload.usedBalance,
      paymentType: payload.paymentType,
      shouldPay: payload.shouldPay
    });
    console.log(`${new Date()} add payment`);
    return bill;
  }
};
export default Mutation;
