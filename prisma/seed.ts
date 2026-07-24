// import "dotenv/config";
// import { PrismaClient } from "@/lib/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { hashPassword } from "@/lib/auth";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   const hashedPassword = await hashPassword("admin123");

//   const admin = await prisma.user.upsert({
//     where: { email: "admin@construction.com" },
//     update: {},
//     create: {
//       name: "Admin",
//       email: "admin@construction.com",
//       password: hashedPassword,
//       role: "ADMIN",
//     },
//   });

//   console.log("Admin ready:", admin.email);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (error) => {
//     console.error(error);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await hashPassword("admin123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@construction.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@construction.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin ready:", admin.email);

  const categories = [
    { name: "Residential Construction", slug: "residential-construction" },
    { name: "Commercial Construction", slug: "commercial-construction" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("Categories ready:", categories.map((c) => c.name).join(", "));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });