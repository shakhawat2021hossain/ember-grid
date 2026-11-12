"use client";

import { useState } from "react";
import { Activity, AlertTriangle, Check, Clock3, Flame, Info, Radio, TrendingUp } from "lucide-react";
import { demoAlerts, type AlertStatus } from "@/components/dashboard/fire-alert-data";
type AlertFilter = "All alerts" | AlertStatus;

const alertCategories = [
  {
    name: "Unusual Fire Activity",
    detail: "Sample activity differs from its illustrative seasonal baseline.",
    icon: Activity,
  },
  {
    name: "High FRP",
    detail: "A sample fire radiative power value crosses a demo threshold.",
    icon: Flame,
  },
  {
    name: "High Hotspot Concentration",
    detail: "An illustrative number of thermal detections appears in one area.",
    icon: Radio,
  },
  {
    name: "Historical Risk Change",
    detail: "A synthetic risk indicator shifts between sample periods.",
    icon: TrendingUp,
  },
];

export default function FireAlertsPage() {
  const [filter, setFilter] = useState<AlertFilter>("All alerts");
  const activeCount = demoAlerts.filter((alert) => alert.status === "Active").length;
  const highPriorityCount = demoAlerts.filter((alert) => alert.severity === "High" && alert.status === "Active").length;
  const resolvedCount = demoAlerts.filter((alert) => alert.status === "Resolved").length;
  const visibleAlerts = filter === "All alerts"
    ? demoAlerts
    : demoAlerts.filter((alert) => alert.status === filter);

  return (
    <main className="dashboard-page-content fire-alerts-shell">
      <div className="dashboard-content">
        <section className="dashboard-intro fire-alerts-intro">
          <div>
            <div className="eyebrow"><span>ALERT MONITOR</span><span className="eyebrow-divider" />CALIFORNIA, USA</div>
            <h1>Fire Alerts</h1>
            <p>Review illustrative activity signals, their priority, and their detection date.</p>
          </div>
          <div className="data-stamp"><span>ILLUSTRATIVE PROTOTYPE</span><strong>SAMPLE SIGNALS</strong><small>No live NASA data connected</small></div>
        </section>

        <div className="fire-alerts-notice" role="note">
          <Info aria-hidden="true" />
          <p><strong>Sample data.</strong> Hotspot detections are thermal signals only; they are not verified and should not be treated as confirmed wildfire emergencies.</p>
        </div>

        <section className="fire-alerts-summary" aria-label="Alert summary">
          <article className="fire-alert-summary-card">
            <span><AlertTriangle aria-hidden="true" />ACTIVE ALERTS</span>
            <strong>{activeCount}</strong>
            <small>Illustrative signals requiring review</small>
          </article>
          <article className="fire-alert-summary-card fire-alert-summary-high">
            <span><Flame aria-hidden="true" />HIGH PRIORITY</span>
            <strong>{highPriorityCount}</strong>
            <small>Demo severity classification</small>
          </article>
          <article className="fire-alert-summary-card fire-alert-summary-resolved">
            <span><Check aria-hidden="true" />RESOLVED ALERTS</span>
            <strong>{resolvedCount}</strong>
            <small>Sample alerts marked resolved</small>
          </article>
        </section>

        <section className="panel fire-alert-categories" aria-labelledby="alert-categories-heading">
          <div className="panel-heading">
            <div><span className="section-kicker">SIGNAL TYPES</span><h2 id="alert-categories-heading">Alert categories</h2><p>Example rules only; these do not confirm a fire.</p></div>
          </div>
          <div className="fire-alert-category-grid">
            {alertCategories.map(({ name, detail, icon: Icon }) => (
              <article className="fire-alert-category" key={name}>
                <Icon aria-hidden="true" />
                <div><h3>{name}</h3><p>{detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel fire-alert-feed" aria-labelledby="alert-feed-heading">
          <div className="panel-heading fire-alert-feed-heading">
            <div><span className="section-kicker">DEMO EVENT LOG</span><h2 id="alert-feed-heading">Alert feed</h2><p>{visibleAlerts.length} synthetic signals · illustrative locations and dates</p></div>
            <div className="fire-alert-filter" role="group" aria-label="Filter alerts by status">
              {(["All alerts", "Active", "Resolved"] as const).map((option) => (
                <button key={option} type="button" aria-pressed={filter === option} className={filter === option ? "is-selected" : ""} onClick={() => setFilter(option)}>{option}</button>
              ))}
            </div>
          </div>
          <ul className="fire-alert-list">
            {visibleAlerts.map((alert) => (
              <li className="fire-alert-row" key={alert.id}>
                <span className={`fire-alert-indicator fire-alert-indicator-${alert.severity.toLowerCase()}`} aria-hidden="true"><AlertTriangle /></span>
                <div className="fire-alert-main">
                  <div className="fire-alert-title">
                    <h3>{alert.category}</h3>
                    <span className={`fire-alert-severity fire-alert-severity-${alert.severity.toLowerCase()}`}>{alert.severity} priority</span>
                    <span className={`fire-alert-status fire-alert-status-${alert.status.toLowerCase()}`}>{alert.status}</span>
                  </div>
                  <p>{alert.signal}</p>
                  <div className="fire-alert-meta"><span><Radio aria-hidden="true" />{alert.location}</span><span><Clock3 aria-hidden="true" />Detected {new Date(`${alert.detectedAt}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span></div>
                </div>
              </li>
            ))}
          </ul>
          <div className="fire-alert-feed-footer">All entries above are synthetic examples for the Ember Grid prototype, not reports of active incidents.</div>
        </section>
      </div>
    </main>
  );
}
