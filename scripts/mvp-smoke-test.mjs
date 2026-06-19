import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.SMOKE_BASE_URL ?? "http://smoke.localhost:3000";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "smoke@miniurl.local" },
    update: {},
    create: {
      email: "smoke@miniurl.local",
      name: "Smoke Test",
      passwordHash: "not-used"
    }
  });

  const company = await prisma.company.upsert({
    where: { subdomain: "smoke" },
    update: { status: "active" },
    create: {
      name: "Smoke Company",
      subdomain: "smoke"
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

  const link = await prisma.link.upsert({
    where: {
      companyId_slug: {
        companyId: company.id,
        slug: "basic"
      }
    },
    update: {
      destinationUrl: "https://example.com/smoke",
      status: "active"
    },
    create: {
      companyId: company.id,
      createdByUserId: user.id,
      destinationUrl: "https://example.com/smoke",
      slug: "basic",
      title: "Smoke link"
    }
  });

  const before = await prisma.link.findUniqueOrThrow({
    where: { id: link.id }
  });

  const response = await fetch(`${baseUrl}/basic`, {
    redirect: "manual"
  });

  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "https://example.com/smoke");

  const after = await prisma.link.findUniqueOrThrow({
    where: { id: link.id }
  });

  assert.equal(after.clickCount, before.clickCount + 1);
  assert.ok(after.lastClickedAt);

  const missing = await fetch(`${baseUrl}/missing`, {
    redirect: "manual"
  });

  assert.equal(missing.status, 404);
}

main()
  .then(async () => {
    console.log("MVP smoke test passed");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
