import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findFirst();
  if(!p) return console.log('no product');
  try {
    await prisma.product.delete({where: {id: p.id}});
    console.log('Success');
  } catch(e) {
    console.error('ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
