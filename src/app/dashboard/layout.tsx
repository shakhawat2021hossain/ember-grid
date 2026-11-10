"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, TriangleAlert } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const page = pathname.startsWith("/dashboard/insights")
    ? { kicker: "RISK MONITOR", title: "Fire Insights & Alerts" }
    : pathname.startsWith("/dashboard/reports")
      ? { kicker: "DATA PRODUCTS", title: "Reports" }
      : { kicker: "OBSERVATION SYSTEM", title: "Active Fire Dashboard" };

  return (
    <main className="dashboard-shell dashboard-with-sidebar">
      <aside className="dashboard-sidebar">
        <Link href="/" className="sidebar-brand" aria-label="Ember Grid home">
          <span className="brand-mark"><span /></span>
          <span><strong>Ember Grid</strong><small>ACTIVE FIRE</small></span>
        </Link>
        <nav className="dashboard-nav" aria-label="Main navigation">
          <span className="sidebar-section-label">MONITORING</span>
          <Link className={pathname === "/dashboard" ? "nav-active" : ""} aria-current={pathname === "/dashboard" ? "page" : undefined} href="/dashboard"><LayoutDashboard aria-hidden="true" /><span>Dashboard</span></Link>
          <Link className={pathname.startsWith("/dashboard/insights") ? "nav-active" : ""} aria-current={pathname.startsWith("/dashboard/insights") ? "page" : undefined} href="/dashboard/insights"><TriangleAlert aria-hidden="true" /><span>Fire Insights &amp; Alerts</span></Link>
          <Link className={pathname.startsWith("/dashboard/reports") ? "nav-active" : ""} aria-current={pathname.startsWith("/dashboard/reports") ? "page" : undefined} href="/dashboard/reports"><FileText aria-hidden="true" /><span>Reports</span></Link>
          {/* <Link href="/dashboard#methods"><ShieldCheck aria-hidden="true" /><span>Methods &amp; Provenance</span></Link> */}
        </nav>
        <div className="sidebar-data-status"><span className="demo-status-dot" /><div><small>DATA STATUS</small><strong>STATIC DEMO DATA · NOT LIVE</strong></div></div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div><span className="header-page-kicker">{page.kicker}</span><strong>{page.title}</strong></div>
          <div className="demo-status"><span className="demo-status-dot" />STATIC DEMO DATA <i /> NOT LIVE</div>
        </header>
        {children}
      </div>
    </main>
  );
}
