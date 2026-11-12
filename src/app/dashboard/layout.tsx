"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BellRing, CalendarDays, LayoutDashboard } from "lucide-react";
import DataExport from "@/components/dashboard/data-export";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const page = pathname.startsWith("/dashboard/insights")
    ? { kicker: "RISK MONITOR", title: "Fire Insights & Alerts" }
    : pathname.startsWith("/dashboard/fire-alerts")
      ? { kicker: "ALERT MONITOR", title: "Fire Alerts" }
    : pathname.startsWith("/dashboard/reports")
      ? { kicker: "DATA PRODUCTS", title: "Reports" }
      : pathname.startsWith("/dashboard/analytics")
        ? { kicker: "FIRE ANALYTICS", title: "Analytics" }
      : pathname.startsWith("/dashboard/fire-calendar")
        ? { kicker: "ACTIVITY HISTORY", title: "Fire Calendar" }
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
          <Link className={pathname.startsWith("/dashboard/fire-calendar") ? "nav-active" : ""} aria-current={pathname.startsWith("/dashboard/fire-calendar") ? "page" : undefined} href="/dashboard/fire-calendar"><CalendarDays aria-hidden="true" /><span>Fire Calendar</span></Link>
          {/* <Link className={pathname.startsWith("/dashboard/insights") ? "nav-active" : ""} aria-current={pathname.startsWith("/dashboard/insights") ? "page" : undefined} href="/dashboard/insights"><TriangleAlert aria-hidden="true" /><span>Fire Insights &amp; Alerts</span></Link> */}
          <Link className={pathname.startsWith("/dashboard/fire-alerts") ? "nav-active" : ""} aria-current={pathname.startsWith("/dashboard/fire-alerts") ? "page" : undefined} href="/dashboard/fire-alerts"><BellRing aria-hidden="true" /><span>Fire Alerts</span></Link>
          <Link className={pathname.startsWith("/dashboard/analytics") ? "nav-active" : ""} aria-current={pathname.startsWith("/dashboard/analytics") ? "page" : undefined} href="/dashboard/analytics"><BarChart3 aria-hidden="true" /><span>Analytics</span></Link>
          {/* <Link href="/dashboard#methods"><ShieldCheck aria-hidden="true" /><span>Methods &amp; Provenance</span></Link> */}
        </nav>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div><span className="header-page-kicker">{page.kicker}</span><strong>{page.title}</strong></div>
          <DataExport />
        </header>
        {children}
      </div>
    </main>
  );
}
