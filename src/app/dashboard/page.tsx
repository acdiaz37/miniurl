import {
  createCompanyAction,
  createLinkAction,
  logoutAction,
  setLinkStatusAction,
  updateLinkAction
} from "@/app/dashboard/actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

function shortUrl(subdomain: string, slug: string) {
  const baseDomain = process.env.BASE_DOMAIN ?? "localhost";
  const port = process.env.NODE_ENV === "development" ? ":3000" : "";
  return `${subdomain}.${baseDomain}${port}/${slug}`;
}

function companyHost(subdomain: string) {
  const baseDomain = process.env.BASE_DOMAIN ?? "localhost";
  const port = process.env.NODE_ENV === "development" ? ":3000" : "";
  return `${subdomain}.${baseDomain}${port}`;
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: { company?: string; error?: string };
}) {
  const user = await requireUser();
  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      company: {
        include: {
          links: {
            where: { status: { not: "archived" } },
            orderBy: { createdAt: "desc" }
          }
        }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  const selectedCompany =
    memberships.find((membership) => membership.companyId === searchParams?.company)
      ?.company ?? memberships[0]?.company;

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <strong>MiniURL</strong>
          <span>{user.email}</span>
        </div>
        <form action={logoutAction}>
          <button className="button secondary" type="submit">
            Sign out
          </button>
        </form>
      </header>

      {searchParams?.error ? <p className="error">{searchParams.error}</p> : null}

      <div className="dashboard-grid">
        <aside className="grid">
          <section className="panel">
            <div className="section-title">
              <h2>Companies</h2>
            </div>
            <div className="company-list">
              {memberships.length ? (
                memberships.map(({ company, role }) => (
                  <a
                    className="company-item"
                    href={`/dashboard?company=${company.id}`}
                    key={company.id}
                  >
                    <strong>{company.name}</strong>
                    <span className="muted">{companyHost(company.subdomain)}</span>
                    <span className="tag">{role}</span>
                  </a>
                ))
              ) : (
                <div className="empty">No companies yet.</div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="section-title">
              <h2>New company</h2>
            </div>
            <form action={createCompanyAction} className="form">
              <label className="field">
                <span>Name</span>
                <input className="input" name="name" required />
              </label>
              <label className="field">
                <span>Subdomain</span>
                <input className="input" name="subdomain" placeholder="acme" required />
              </label>
              <button className="button" type="submit">
                Create company
              </button>
            </form>
          </section>
        </aside>

        <section className="panel">
          {selectedCompany ? (
            <div className="grid">
              <div className="section-title">
                <div>
                  <h1>{selectedCompany.name}</h1>
                  <p className="muted">{companyHost(selectedCompany.subdomain)}</p>
                </div>
                <span className="tag">{selectedCompany.status}</span>
              </div>

              <form action={createLinkAction} className="form">
                <input name="companyId" type="hidden" value={selectedCompany.id} />
                <div className="field">
                  <span>Destination URL</span>
                  <input
                    className="input"
                    name="destinationUrl"
                    placeholder="https://example.com"
                    required
                    type="url"
                  />
                </div>
                <div className="field">
                  <span>Title</span>
                  <input className="input" name="title" />
                </div>
                <div className="field">
                  <span>Custom slug</span>
                  <input className="input" name="slug" placeholder="summer-sale" />
                </div>
                <button className="button" type="submit">
                  Create link
                </button>
              </form>

              <div className="link-list">
                {selectedCompany.links.length ? (
                  selectedCompany.links.map((link) => (
                    <article className="link-row" key={link.id}>
                      <div className="link-main">
                        <div>
                          <strong>{link.title || link.slug}</strong>
                          <div className="link-url">
                            {shortUrl(selectedCompany.subdomain, link.slug)}
                          </div>
                          <p className="muted">{link.destinationUrl}</p>
                          <div className="metrics">
                            <span>{link.clickCount} clicks</span>
                            <span>
                              Last click:{" "}
                              {link.lastClickedAt
                                ? link.lastClickedAt.toLocaleString()
                                : "never"}
                            </span>
                          </div>
                        </div>
                        <span className="tag">{link.status}</span>
                      </div>

                      <form action={updateLinkAction} className="form">
                        <input name="companyId" type="hidden" value={selectedCompany.id} />
                        <input name="linkId" type="hidden" value={link.id} />
                        <label className="field">
                          <span>Title</span>
                          <input
                            className="input"
                            defaultValue={link.title ?? ""}
                            name="title"
                          />
                        </label>
                        <label className="field">
                          <span>Destination URL</span>
                          <input
                            className="input"
                            defaultValue={link.destinationUrl}
                            name="destinationUrl"
                            required
                            type="url"
                          />
                        </label>
                        <button className="button secondary" type="submit">
                          Save changes
                        </button>
                      </form>

                      <div className="actions">
                        <form action={setLinkStatusAction}>
                          <input name="companyId" type="hidden" value={selectedCompany.id} />
                          <input name="linkId" type="hidden" value={link.id} />
                          <input
                            name="status"
                            type="hidden"
                            value={link.status === "active" ? "paused" : "active"}
                          />
                          <button className="button warning" type="submit">
                            {link.status === "active" ? "Pause" : "Reactivate"}
                          </button>
                        </form>
                        <form action={setLinkStatusAction}>
                          <input name="companyId" type="hidden" value={selectedCompany.id} />
                          <input name="linkId" type="hidden" value={link.id} />
                          <input name="status" type="hidden" value="archived" />
                          <button className="button danger" type="submit">
                            Archive
                          </button>
                        </form>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty">No links in this company.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty">Create a company to start managing links.</div>
          )}
        </section>
      </div>
    </main>
  );
}
