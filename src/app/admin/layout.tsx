// Defines metadata and a neutral wrapper shared by admin login and protected admin pages.
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | RVKumar Traders Admin" },
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
