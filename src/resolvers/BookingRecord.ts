import { prisma } from '../../generated/prisma-client';

const BookingRecord = {
  user: (parent, args, ctx) => prisma.bookingRecord({ id: parent.id }).user()
};

export default BookingRecord;
