"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  assertValidSlug,
  assertValidSubdomain,
  generateSlug,
  normalizeDestinationUrl,
  normalizeSlug,
  normalizeSubdomain
} from "@/lib/validation";

function formError(message: string): never {
  redirect(`/dashboard?error=${encodeURIComponent(message)}`);
}

async function requireMembership(companyId: string, userId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId
      }
    }
  });

  if (!membership) {
    formError("You do not have access to that company.");
  }

  return membership;
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function createCompanyAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const subdomain = normalizeSubdomain(formData.get("subdomain"));

  if (!name) {
    formError("Company name is required.");
  }

  let company: { id: string };

  try {
    assertValidSubdomain(subdomain);

    company = await prisma.company.create({
      data: {
        name,
        subdomain,
        memberships: {
          create: {
            userId: user.id,
            role: "admin"
          }
        }
      }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      formError("That subdomain is already taken.");
    }

    formError(error instanceof Error ? error.message : "Company could not be created.");
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?company=${company.id}`);
}

export async function createLinkAction(formData: FormData) {
  const user = await requireUser();
  const companyId = String(formData.get("companyId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const customSlug = normalizeSlug(formData.get("slug"));
  let destinationUrl: string;

  try {
    destinationUrl = normalizeDestinationUrl(formData.get("destinationUrl"));
  } catch (error) {
    formError(error instanceof Error ? error.message : "Invalid destination URL.");
  }

  await requireMembership(companyId, user.id);

  let slug = customSlug || generateSlug();

  try {
    assertValidSlug(slug);
  } catch (error) {
    formError(error instanceof Error ? error.message : "Invalid slug.");
  }

  let created = false;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await prisma.link.create({
        data: {
          companyId,
          createdByUserId: user.id,
          destinationUrl,
          slug,
          title: title || null
        }
      });

      created = true;
      break;
    } catch (error) {
      const isCollision =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002";

      if (!isCollision || customSlug) {
        formError(isCollision ? "That slug is already taken." : "Link could not be created.");
      }

      slug = generateSlug();
    }
  }

  if (!created) {
    formError("A unique slug could not be generated.");
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?company=${companyId}`);
}

export async function updateLinkAction(formData: FormData) {
  const user = await requireUser();
  const companyId = String(formData.get("companyId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  let destinationUrl: string;

  try {
    destinationUrl = normalizeDestinationUrl(formData.get("destinationUrl"));
  } catch (error) {
    formError(error instanceof Error ? error.message : "Invalid destination URL.");
  }

  await requireMembership(companyId, user.id);

  await prisma.link.update({
    where: {
      id: linkId,
      companyId
    },
    data: {
      title: title || null,
      destinationUrl
    }
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard?company=${companyId}`);
}

export async function setLinkStatusAction(formData: FormData) {
  const user = await requireUser();
  const companyId = String(formData.get("companyId") ?? "");
  const linkId = String(formData.get("linkId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!["active", "paused", "archived"].includes(status)) {
    formError("Invalid link status.");
  }

  await requireMembership(companyId, user.id);

  await prisma.link.update({
    where: {
      id: linkId,
      companyId
    },
    data: { status }
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard?company=${companyId}`);
}
