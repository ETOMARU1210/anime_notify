
const  { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  const username = "test";
  const email = "test@mail.com"
  const password = "test"
  bcrypt.hash(password, 10).then(async (hashedPassword ) => {
    const user = await prisma.user.upsert({
      where: { email: 'test@mail.com' },
      update: {},
      create: {
        username,
        email,
        password: hashedPassword
      },
    });
  console.log({ user });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });