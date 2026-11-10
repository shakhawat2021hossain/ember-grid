"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Download, Printer, Info } from "lucide-react";
import { CalendarHeatmap, FrpChart, MonthlySensorChart } from "@/components/dashboard/dashboard-visualizations";
import { filterObservations, observations, type Confidence, type DashboardFilters, type Sensor } from "@/components/dashboard/dashboard-data";

const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [sensor, setSensor] = useState<"All" | Sensor>("All");
  const [confidence, setConfidence] = useState<Confidence>("All");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 18));
  const filters = useMemo<DashboardFilters>(() => ({ sensor, confidence, timeOfDay: "All", fireType: "All" }), [sensor, confidence]);

  const records = filterObservations(observations, filters, undefined, false, startDate, endDate);
  const modis = records.filter((record) => record.sensor === "MODIS").length;
  const viirs = records.filter((record) => record.sensor === "VIIRS").length;
  const frps = records.map((record) => record.frp).filter((value): value is number => typeof value === "number");
  const peakFrp = frps.length ? Math.max(...frps) : null;
  const periodLabel = `${new Date(`${startDate}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — ${new Date(`${endDate}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  function updateStart(value: string) {
    setStartDate(value);
    if (value > endDate) setEndDate(value);
  }
  function updateEnd(value: string) {
    setEndDate(value);
    if (value < startDate) setStartDate(value);
  }
  function downloadCsv() {
    const headers = ["Date/Time", "Sensor", "Latitude", "Longitude", "Confidence", "Fire type", "FRP (MW)"];
    const rows = records.map((record) => [
      `${record.date} ${record.time} UTC`, record.sensor, record.lat, record.lon, record.confidence, record.fireType, typeof record.frp === "number" ? record.frp : "",
    ]);
    const contents = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + contents], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `ember-grid-observations-${startDate}-to-${endDate}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const monthly = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
    const monthRecords = records.filter((record) => Number(record.date.split(" ")[0]) && record.date.split(" ")[1] === ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]);
    return { month, modis: monthRecords.filter((record) => record.sensor === "MODIS").length, viirs: monthRecords.filter((record) => record.sensor === "VIIRS").length };
  });

  return (
    <main className="reports-shell">
      <div className="dashboard-content reports-content">
        <section className="dashboard-intro report-intro">
          <div><div className="eyebrow"><span>DATA PRODUCTS</span><span className="eyebrow-divider" />CALIFORNIA, USA</div><h1>Fire Activity Reports</h1><p>Inspect and export the currently filtered illustrative sample observations.</p></div>
          <div className="report-actions"><button type="button" onClick={downloadCsv}><Download />Download CSV</button><button type="button" onClick={() => window.print()}><Printer />Print report</button></div>
        </section>

        <section className="report-filter-panel" aria-label="Report filters">
          <label className="filter-select"><span>START DATE</span><input type="date" min="2025-01-01" max="2025-12-31" value={startDate} onChange={(event) => updateStart(event.target.value)} /></label>
          <label className="filter-select"><span>END DATE</span><input type="date" min="2025-01-01" max="2025-12-31" value={endDate} onChange={(event) => updateEnd(event.target.value)} /></label>
          <fieldset className="report-satellite"><legend>SENSOR</legend><div className="segmented-control">{(["All", "MODIS", "VIIRS"] as const).map((option) => <button key={option} aria-pressed={sensor === option} className={sensor === option ? "segment-active" : ""} onClick={() => setSensor(option)}>{option}</button>)}</div></fieldset>
          <label className="filter-select"><span>CONFIDENCE</span><select value={confidence} onChange={(event) => setConfidence(event.target.value as Confidence)}><option>All</option><option>High</option><option>Nominal</option><option>Low</option></select><ChevronDown /></label>
        </section>
        <div className="report-data-note"><CalendarDays /><span>Reporting period: <strong>{periodLabel}</strong> · Static synthetic observations · Not live data</span></div>

        <section className="report-metrics" aria-label="Report summary">
          <article className="report-metric"><span>FILTERED RECORDS <Info /></span><strong>{records.length}</strong><small>Observation records</small></article>
          <article className="report-metric"><span>MODIS COUNT <Info /></span><strong>{modis}</strong><small>Synthetic sample records</small></article>
          <article className="report-metric"><span>VIIRS COUNT <Info /></span><strong>{viirs}</strong><small>Synthetic sample records</small></article>
          <article className="report-metric"><span>PEAK FRP <Info /></span><strong>{peakFrp === null ? "—" : peakFrp.toLocaleString()}<em> MW</em></strong><small>{periodLabel}</small></article>
        </section>

        <section className="panel report-calendar-panel"><div className="panel-heading"><div><span className="section-kicker">ANNUAL ACTIVITY CALENDAR</span><h2>Daily sample pattern · 2025</h2><p>Calendar activity is illustrative except for observations shown on 18 Mar.</p></div></div><CalendarHeatmap selectedDate={selectedDate} filters={filters} view="RAW" onSelect={setSelectedDate} /><p className="report-selection-note">Selected calendar date: <strong>{selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></p></section>

        <section className="report-chart-section"><div className="analysis-intro"><div><span className="section-kicker">MONTHLY COMPARISON</span><h2>MODIS vs VIIRS</h2></div></div><article className="panel report-panel"><div className="chart-legend"><span><i className="legend-line observed-line" />MODIS</span><span><i className="legend-line baseline-line" />VIIRS</span></div><MonthlySensorChart filters={filters} /><div className="report-month-table-wrap"><table className="report-month-table"><thead><tr><th>Month</th><th>MODIS</th><th>VIIRS</th><th>Total</th></tr></thead><tbody>{monthly.map((item) => <tr key={item.month}><td>{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item.month]}</td><td>{item.modis}</td><td>{item.viirs}</td><td>{item.modis + item.viirs}</td></tr>)}</tbody></table></div></article></section>

        <section className="panel report-frp-panel"><div className="panel-heading"><div><span className="section-kicker">AVAILABLE RECORD FRP</span><h2>Daily peak FRP</h2></div></div><FrpChart selectedDate={selectedDate} filters={filters} /></section>

        <section className="panel report-observation-panel"><div className="panel-heading"><div><span className="section-kicker">OBSERVATION TABLE</span><h2>{records.length} matching records</h2></div></div>{records.length === 0 ? <div className="report-empty">No observation records match the selected filters.</div> : <div className="report-table-wrap"><table className="report-observation-table"><thead><tr><th>Date / time (UTC)</th><th>Sensor</th><th>Latitude</th><th>Longitude</th><th>Confidence</th><th>Fire type</th><th>FRP (MW)</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td>{record.date} · {record.time}</td><td><span className={`sensor-chip ${record.sensor.toLowerCase()}`}>{record.sensor}</span></td><td>{record.lat}</td><td>{record.lon}</td><td>{record.confidence}</td><td>{record.fireType}</td><td>{typeof record.frp === "number" ? record.frp.toLocaleString() : "—"}</td></tr>)}</tbody></table></div>}</section>
      </div>
    </main>
  );
}
