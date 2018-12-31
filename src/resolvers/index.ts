import Bill from './Bill';
import BookingRecord from './BookingRecord';
import ConsultingRecord from './ConsultingRecord';
import Mutation from './Mutation';
import Payment from './Payment';
import Query from './Query';

const resolvers = {
  Query,
  Mutation,
  ConsultingRecord,
  BookingRecord,
  Bill,
  Payment
};

export default resolvers;
