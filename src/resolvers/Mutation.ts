import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../../generated/prisma-client';

const Mutation = {
  addUser: async (parent, args, context) => {
    await prisma.createUserBasic(args);
    console.log(`${new Date()} addUserBasic`);
    return { success: true };
  },
  addConsultingRecord: async (parent, args, context) => {
    await prisma.createConsultingRecord(args);
    console.log(`${new Date()} addConsultingRecord`);
    return { success: true };
  },
  addBookingRecord: async (parent, args, context) => {
    await prisma.createBookingRecord(args);
    console.log(`${new Date()} addBookingRecord`);
    return { success: true };
  }
  // login: async (_parent, { email, password }, ctx) => {
  //   const user = await ctx.db.user({ email });
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
