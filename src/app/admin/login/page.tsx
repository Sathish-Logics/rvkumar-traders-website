// Renders the private owner sign-in page and safe authentication error messages.
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { isAdminAuthBypassEnabled } from "@/lib/env";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

const messages: Record<string, string> = {
  invalid_input: "Enter a valid email address and password.",
  invalid_credentials: "The email address or password is incorrect.",
  unauthorized: "This account is not an active RVKumar Traders administrator.",
  configuration: "Admin authentication is not configured in this environment.",
  bypass_profile:
    "Development bypass is enabled, but no active owner profile exists in the database.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (isAdminAuthBypassEnabled()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link href="/" className="admin-login-brand">
          <span>RV</span>
          <b>RVKumar Traders</b>
        </Link>
        <div className="admin-login-icon" aria-hidden="true">
          <LockKeyhole size={24} />
        </div>
        <p className="admin-login-kicker">Secure administration</p>
        <h1>Owner sign in</h1>
        <p className="admin-login-copy">
          Access enquiries, quotations, orders, deliveries and payments.
        </p>
        {error && messages[error] ? (
          <p className="admin-form-error" role="alert">
            {messages[error]}
          </p>
        ) : null}
        <form action={login} className="admin-login-form">
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </label>
          <button type="submit" className="button button-large">
            Sign in securely
          </button>
        </form>
        <p className="admin-login-footnote">
          Access is restricted to the active owner account.
        </p>
      </section>
    </main>
  );
}
