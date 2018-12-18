import { prisma } from '../../generated/prisma-client';

const Bill = {
  user: (parent, args, ctx) => prisma.bill({ id: parent.id }).user()
};

export default Bill;
