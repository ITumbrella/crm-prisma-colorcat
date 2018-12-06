import { prisma } from '../generated/prisma-client';

async function test() {
  // // 删除全部
  // const data = await prisma.deleteManyUserBasics();

  // 查询全部
  const data = await prisma.userBasics();

  // //插入10000条数据用时
  // const from = new Date().getTime();
  // for (let index = 0; index < 10000; index += 1) {
  //   await prisma.createUserBasic({
  //     name: `tdm${index}`,
  //     sex: "22",
  //     birthYear: "22",
  //     where: "22",
  //     bigFrom: "22"
  //   });
  // }
  // const to = new Date().getTime();
  // const data = (to - from) / 1000;

  console.log(data);
}
test();
