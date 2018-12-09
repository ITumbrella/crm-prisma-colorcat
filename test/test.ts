import { prisma } from "../generated/prisma-client";

async function test() {
  // // 删除全部
  // const data = await prisma.deleteManyUserBasics();

  // // 查询全部
  // const data = await prisma.userBasics();

  // const data = await prisma.deleteManyBookingRecords();
  // const data = await prisma.consultingRecords();
  // const data2 = await prisma.deleteManyConsultingRecords();

  //插入10000条数据用时
  const from = new Date().getTime();
  for (let index = 0; index < 500; index += 1) {
    await prisma.createUserBasic({
      name: `tdm${index}${index}${index}`,
      sex: `男${index}${index}${index}`,
      birthYear: `1996${index}${index}${index}`,
      where: `上海${index}${index}`,
      bigFrom: `广告${index}${index}`,
      mobile: `175********${index}${index}`,
      age: `23${index}`
    });
  }
  const to = new Date().getTime();

  console.log(`用时${(to - from) / 1000}`);
}
test();
