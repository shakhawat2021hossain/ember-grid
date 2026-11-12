"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, ChevronDown, Info } from "lucide-react";
import { MonthlySensorChart, SeasonalChart } from "@/components/dashboard/dashboard-visualizations";
import { dailyActivity, filterObservations, observations, type Confidence, type DashboardFilters, type Sensor } from "@/components/dashboard/dashboard-data";

const demoAlerts = [
  { date: "2025-03-18", severity: "High", activity: 89, baseline: 47, location: "California sample record set", explanation: "Illustrative activity is above the demo seasonal baseline." },
  { date: "2025-08-18", severity: "Moderate", activity: 78, baseline: 65, location: "Illustrative statewide period", explanation: "Synthetic summer activity exceeds the documented demo baseline." },
  { date: "2025-09-12", severity: "Watch", activity: 71, baseline: 62, location: "Illustrative statewide period", explanation: "A deterministic seasonal-series value is above its comparison value." },
];

export default function FireInsightsPage() {
  const [sensor, setSensor] = useState<"All" | Sensor>("All");
  const [confidence, setConfidence] = useState<Confidence>("All");
  const [selectedDate, setSelectedDate] = useState("2025-03-18");
  const filters = useMemo<DashboardFilters>(() => ({ sensor, confidence, timeOfDay: "All", fireType: "All" }), [sensor, confidence]);
  const records = filterObservations(observations, filters, undefined, true);
  const modis = records.filter((record) => record.sensor === "MODIS").length;
  const viirs = records.filter((record) => record.sensor === "VIIRS").length;
  const difference = Math.abs(modis - viirs);
  const denominator = Math.max(modis, viirs);
  const percentageDifference = denominator ? Math.round(difference / ((modis + viirs) / 2) * 100) : null;
  const frps = records.map((record) => record.frp).filter((value): value is number => typeof value === "number");
  const peakFrp = frps.length ? Math.max(...frps) : null;
  const selected = new Date(`${selectedDate}T12:00:00`);
  const selectedActivity = dailyActivity(selected, filters);
  const flaggedDates = demoAlerts.filter((alert) => alert.activity >= alert.baseline).length;
  const aboveBaseline = Array.from({ length: 365 }, (_, index) => dailyActivity(new Date(2025, 0, index + 1), filters)).filter((day) => day.activity > day.anomaly + 47).length;

  return (
    <main className="dashboard-page-content insights-shell">
      <div className="dashboard-content">
        <section className="dashboard-intro insights-intro">
          <div><div className="eyebrow"><span>FIRE ANALYSIS</span><span className="eyebrow-divider" />CALIFORNIA, USA</div><h1>Fire Insights &amp; Alerts</h1><p>Focused comparison of illustrative MODIS, VIIRS, seasonal, and anomaly signals.</p></div>
          <div className="data-stamp"><span>SELECTED DATE</span><strong>{selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></div>
        </section>

        <section className="control-bar insights-controls" aria-label="Insights filters">
          <label className="control-field control-range"><span>DATE / PERIOD</span><span className="control-input"><CalendarDays /><select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}><option value="2025-03-18">18 Mar 2025 · sample date</option><option value="2025-08-18">18 Aug 2025 · illustrative</option><option value="2025-09-12">12 Sep 2025 · illustrative</option></select><ChevronDown className="select-chevron" /></span></label>
          <fieldset className="control-field"><legend>SENSOR</legend><div className="segmented-control">{(["All", "MODIS", "VIIRS"] as const).map((option) => <button key={option} aria-pressed={sensor === option} className={sensor === option ? "segment-active" : ""} onClick={() => setSensor(option)}>{option}</button>)}</div></fieldset>
          <label className="filter-select"><span>CONFIDENCE</span><select value={confidence} onChange={(event) => setConfidence(event.target.value as Confidence)}><option>All</option><option>High</option><option>Nominal</option><option>Low</option></select><ChevronDown /></label>
        </section>

        <section className="metrics-row" aria-label="Insights summary">
          <article className="metric"><span>FLAGGED DEMO DATES <Info /></span><strong>{flaggedDates}</strong><small>Deterministic alert examples</small></article>
          <article className="metric"><span>LARGEST SENSOR DIFFERENCE <Info /></span><strong>{difference}</strong><small>{modis} MODIS · {viirs} VIIRS records</small></article>
          <article className="metric"><span>PEAK AVAILABLE FRP <Info /></span><strong>{peakFrp === null ? "—" : peakFrp.toLocaleString()}<em> MW</em></strong><small>From matching sample records</small></article>
          <article className="metric"><span>ILLUSTRATIVE ABOVE-BASELINE DAYS <Info /></span><strong>{aboveBaseline}</strong><small>Shared synthetic activity series</small></article>
        </section>

        <section className="insights-primary-grid">
          <article className="panel insights-panel"><div className="panel-heading"><div><span className="section-kicker">SEASONAL COMPARISON</span><h2>Activity versus illustrative baseline</h2><p>Activity index and baseline are synthetic, separately labeled, and share the selected filters.</p></div></div><div className="chart-legend"><span><i className="legend-line observed-line" />ILLUSTRATIVE ACTIVITY</span><span><i className="legend-line baseline-line" />SEASONAL BASELINE</span></div><SeasonalChart selectedDate={selected} activity={selectedActivity.activity} anomaly={selectedActivity.anomaly} view="HARMONIZED" /></article>
          <article className="panel insights-panel disagreement-panel"><div className="panel-heading"><div><span className="section-kicker">SENSOR DISAGREEMENT</span><h2>MODIS / VIIRS sample counts</h2></div></div><MonthlySensorChart filters={filters} /><dl className="insights-disagreement"><div><dt>MODIS</dt><dd>{modis}</dd></div><div><dt>VIIRS</dt><dd>{viirs}</dd></div><div><dt>Absolute difference</dt><dd>{difference}</dd></div><div><dt>Mean-relative difference</dt><dd>{percentageDifference === null ? "Not defined" : `${percentageDifference}%`}</dd></div></dl></article>
        </section>

        <section className="panel insights-alerts-panel" aria-labelledby="alert-heading">
          <div className="panel-heading"><div><span className="section-kicker">DEMO ANOMALY TIMELINE</span><h2 id="alert-heading">Alerts</h2><p>Select an alert to update the period context.</p></div></div>
          {demoAlerts.map((alert) => {
            const active = selectedDate === alert.date;
            return <button key={alert.date} type="button" className={`insights-alert-row${active ? " is-active" : ""}`} aria-pressed={active} onClick={() => setSelectedDate(alert.date)}><AlertTriangle /><span><small>{alert.date} · {alert.severity}</small><strong>{alert.location}</strong><em>{alert.explanation}</em></span><span className="insights-alert-values"><small>ACTIVITY</small><b>{alert.activity}</b><small>BASELINE {alert.baseline}</small></span></button>;
          })}
        </section>

        <section className="panel insights-methodology"><span className="section-kicker">METHODOLOGY &amp; LIMITATIONS</span><h2>How to read this demo</h2><p><strong>Anomalies:</strong> illustration values are deterministic differences from a documented synthetic seasonal baseline.</p><p><strong>RAW:</strong> retains separate MODIS and VIIRS sample detections. <strong>HARMONIZED:</strong> is only an illustrative common activity view, not scientific calibration.</p><p><strong>Sensor disagreement:</strong> count differences can reflect sensor characteristics and observation conditions. A difference alone does not prove an error.</p><p>This page uses synthetic static data and does not perform validated scientific harmonization or claim NASA observations.</p></section>
      </div>
    </main>
  );
}
