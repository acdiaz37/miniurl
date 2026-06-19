import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@miniurl.local" },
    update: {},
    create: {
      email: "admin@miniurl.local",
      name: "MiniURL Admin",
      passwordHash: hashPassword("admin123")
    }
  });

  const company = await prisma.company.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo Company",
      subdomain: "demo"
    }
  });

  await prisma.membership.upsert({
    where: {
      companyId_userId: {
        companyId: company.id,
        userId: user.id
      }
    },
    update: { role: "admin" },
    create: {
      companyId: company.id,
      userId: user.id,
      role: "admin"
    }
  });

  await prisma.link.upsert({
    where: {
      companyId_slug: {
        companyId: company.id,
        slug: "hello"
      }
    },
    update: {},
    create: {
      companyId: company.id,
      slug: "hello",
      title: "Example",
      destinationUrl: "https://example.com",
      createdByUserId: user.id
    }
  });
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

