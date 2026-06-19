import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSubdomainFromHost } from "@/lib/tenancy";

function errorPage(title: string, status: number) {
  return new NextResponse(
    `<!doctype html><html><head><title>${title}</title><style>body{font-family:system-ui,sans-serif;background:#eef1ec;color:#17201b;display:grid;min-height:100vh;place-items:center;margin:0}.box{background:#fff;border:1px solid #d7ddd5;border-radius:8px;padding:28px;max-width:420px}</style></head><body><main class="box"><h1>${title}</h1><p>This MiniURL link is unavailable.</p></main></body></html>`,
    {
      headers: { "content-type": "text/html; charset=utf-8" },
      status
    }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const subdomain = getSubdomainFromHost(request.headers.get("host"));

  if (!subdomain) {
    return errorPage("Unknown company", 404);
  }

  const company = await prisma.company.findUnique({
    where: { subdomain },
    include: {
      links: {
        where: {
          slug
        },
        take: 1
      }
    }
  });

  if (!company || company.status !== "active") {
    return errorPage("Unknown company", 404);
  }

  const link = company.links[0];

  if (!link || link.status !== "active") {
    return errorPage("Unknown link", 404);
  }

  await prisma.$transaction([
    prisma.link.update({
      where: { id: link.id },
      data: {
        clickCount: { increment: 1 },
        lastClickedAt: new Date()
      }
    }),
    prisma.clickEvent.create({
      data: {
        companyId: company.id,
        linkId: link.id
      }
    })
  ]);

  return NextResponse.redirect(link.destinationUrl, 302);
}
