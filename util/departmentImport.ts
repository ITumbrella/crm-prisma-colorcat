import { prisma } from '../generated/prisma-client';

async function importDepartment() {
  const routePages = [];
  for (let index = 0; index < 1000; index += 1) routePages.push(index);

  await prisma.createDepartment({
    name: "root",
    routePages: { set: routePages }
  });
}
