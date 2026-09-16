import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leorus Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#f2f3f5]">{children}</div>;
}
