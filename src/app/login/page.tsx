import { loginAction } from "@/app/login/actions";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="login-wrap">
      <section className="panel login-panel">
        <div className="section-title">
          <div>
            <h1>MiniURL</h1>
            <p className="muted">Admin panel</p>
          </div>
        </div>

        {searchParams?.error ? (
          <p className="error">Invalid email or password.</p>
        ) : null}

        <form action={loginAction} className="form">
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              defaultValue="admin@miniurl.local"
              name="email"
              type="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              className="input"
              defaultValue="admin123"
              name="password"
              type="password"
              required
            />
          </label>

          <button className="button" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

