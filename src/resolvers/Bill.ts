import { prisma } from '../../generated/prisma-client';

const Bill = {
  user: (parent, args, ctx) => prisma.bill({ id: parent.id }).user(),
  billDetail: (parent, args, ctx) => prisma.bill({ id: parent.id }).billDetail()
};

export default Bill;
