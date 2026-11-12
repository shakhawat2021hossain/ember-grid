"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { jsPDF } from "jspdf";
import { demoAlerts, type AlertStatus } from "@/components/dashboard/fire-alert-data";
import {
  dailyActivity,
  filterObservations,
  observations,
  type Confidence,
  type DashboardFilters,
  type FireType,
  type Sensor,
  type TimeOfDay,
} from "@/components/dashboard/dashboard-data";

type ExportDataset = "observations" | "daily-activity" | "alerts";
type DailySummary = {
  date: string;
  observationCount: number;
  activityIndex: number;
  peakFrp: number;
};

const datasetOptions: { id: ExportDataset; label: string }[] = [
  { id: "observations", label: "Fire observations" },
  { id: "daily-activity", label: "Daily activity summaries" },
  { id: "alerts", label: "Fire alert examples" },
];

const chartColors = ["#9b4324", "#617b55", "#d19150", "#657b94", "#8d759b", "#ba6c60"];

function drawReportHeader(doc: jsPDF, title: string, range: string, pageWidth: number, filters: DashboardFilters) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor("#252923");
  doc.text("Ember Grid", 14, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#71766e");
  doc.text("FIRE ACTIVITY DATA REPORT", 14, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor("#873716");
  doc.text(title, 14, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#5a6058");
  doc.text(`Reporting period: ${range}`, 14, 39);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`, pageWidth - 14, 39, { align: "right" });
  doc.setFontSize(7);
  doc.text(`Filters: sensor ${filters.sensor} · confidence ${filters.confidence} · time ${filters.timeOfDay} · fire type ${filters.fireType}`, 14, 45);
  doc.setDrawColor("#e4e5df");
  doc.line(14, 49, pageWidth - 14, 49);
}

function drawMetric(doc: jsPDF, x: number, y: number, width: number, label: string, value: string) {
  doc.setDrawColor("#e4e5df");
  doc.setFillColor("#fbfbf8");
  doc.roundedRect(x, y, width, 20, 1, 1, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor("#71766e");
  doc.text(label.toUpperCase(), x + 4, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor("#252923");
  doc.text(value, x + 4, y + 15);
}

function drawHorizontalBars(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
  items: { label: string; value: number }[],
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#343832");
  doc.text(title, x, y);
  const max = Math.max(1, ...items.map((item) => item.value));
  const labelWidth = Math.min(42, width * 0.34);
  const barWidth = width - labelWidth - 14;
  const rowHeight = 10;

  items.forEach((item, index) => {
    const rowY = y + 8 + index * rowHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#5a6058");
    doc.text(item.label, x, rowY + 4, { maxWidth: labelWidth - 2 });
    doc.setFillColor("#f0f1ec");
    doc.roundedRect(x + labelWidth, rowY, barWidth, 5, 1, 1, "F");
    if (item.value > 0) {
      doc.setFillColor(chartColors[index % chartColors.length]);
      doc.roundedRect(x + labelWidth, rowY, Math.max(1, barWidth * item.value / max), 5, 1, 1, "F");
    }
    doc.setTextColor("#343832");
    doc.text(item.value.toLocaleString(), x + width, rowY + 4, { align: "right" });
  });
}

function drawLineChart(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  points: { label: string; value: number }[],
  maxValue: number,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#343832");
  doc.text(title, x, y);
  const plotX = x + 12;
  const plotY = y + 8;
  const plotWidth = width - 16;
  const plotHeight = height - 23;
  const safeMax = Math.max(1, maxValue);

  [0, 0.5, 1].forEach((ratio) => {
    const lineY = plotY + plotHeight * ratio;
    doc.setDrawColor("#e8e9e3");
    doc.line(plotX, lineY, plotX + plotWidth, lineY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor("#858a81");
    doc.text(String(Math.round(safeMax * (1 - ratio))), plotX - 2, lineY + 1, { align: "right" });
  });

  if (points.length < 1) return;
  const positions = points.map((point, index) => ({
    x: plotX + (points.length === 1 ? plotWidth / 2 : index * plotWidth / (points.length - 1)),
    y: plotY + plotHeight * (1 - Math.min(safeMax, point.value) / safeMax),
  }));
  doc.setDrawColor("#9b4324");
  doc.setLineWidth(0.7);
  positions.slice(1).forEach((point, index) => {
    doc.line(positions[index].x, positions[index].y, point.x, point.y);
  });
  positions.forEach((point, index) => {
    doc.setFillColor("#9b4324");
    doc.circle(point.x, point.y, 1, "F");
    if (points.length <= 12 || index % 6 === 0 || index === points.length - 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.setTextColor("#71766e");
      doc.text(points[index].label, point.x, plotY + plotHeight + 5, { align: "center" });
    }
  });
}

function makePdfReport({
  datasets,
  observations: records,
  dailySummaries,
  alerts,
  startDate,
  endDate,
  filters,
}: {
  datasets: ExportDataset[];
  observations: typeof observations;
  dailySummaries: DailySummary[];
  alerts: typeof demoAlerts;
  startDate: string;
  endDate: string;
  filters: DashboardFilters;
}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const range = `${startDate} to ${endDate}`;
  let hasPage = false;

  if (datasets.includes("observations")) {
    if (hasPage) doc.addPage();
    hasPage = true;
    drawReportHeader(doc, "Fire observations", range, pageWidth, filters);
    const cardWidth = (pageWidth - 36) / 4;
    const modis = records.filter((record) => record.sensor === "MODIS").length;
    const viirs = records.filter((record) => record.sensor === "VIIRS").length;
    const meanFrp = records.length ? Math.round(records.reduce((sum, record) => sum + record.frp, 0) / records.length) : 0;
    drawMetric(doc, 14, 53, cardWidth, "Matching observations", records.length.toLocaleString());
    drawMetric(doc, 18 + cardWidth, 53, cardWidth, "MODIS", modis.toLocaleString());
    drawMetric(doc, 22 + cardWidth * 2, 53, cardWidth, "VIIRS", viirs.toLocaleString());
    drawMetric(doc, 26 + cardWidth * 3, 53, cardWidth, "Mean FRP", `${meanFrp.toLocaleString()} MW`);

    const confidenceLevels = ["High", "Nominal", "Low"];
    const fireTypes = ["Vegetation", "Volcano", "Static", "Offshore"];
    drawHorizontalBars(doc, 14, 80, 82, "Observations by sensor", [
      { label: "MODIS", value: modis },
      { label: "VIIRS", value: viirs },
    ]);
    drawHorizontalBars(doc, 108, 80, 82, "Observations by confidence", confidenceLevels.map((label) => ({
      label,
      value: records.filter((record) => record.confidenceLevel === label).length,
    })));
    drawHorizontalBars(doc, 202, 80, 80, "Observations by fire type", fireTypes.map((label) => ({
      label,
      value: records.filter((record) => record.fireTypeCategory === label).length,
    })));
    const topFrp = [...records].sort((a, b) => b.frp - a.frp).slice(0, 6);
    drawHorizontalBars(doc, 14, 125, pageWidth - 28, "Highest FRP observations (MW)", topFrp.map((record) => ({
      label: `${record.sensor} · ${record.date.slice(0, 6)}`,
      value: record.frp,
    })));
  }

  if (datasets.includes("daily-activity")) {
    if (hasPage) doc.addPage();
    hasPage = true;
    drawReportHeader(doc, "Daily activity summaries", range, pageWidth, filters);
    const meanActivity = dailySummaries.length
      ? Math.round(dailySummaries.reduce((sum, day) => sum + day.activityIndex, 0) / dailySummaries.length)
      : 0;
    const detections = dailySummaries.reduce((sum, day) => sum + day.observationCount, 0);
    const peakFrp = dailySummaries.reduce((peak, day) => Math.max(peak, day.peakFrp), 0);
    const cardWidth = (pageWidth - 36) / 3;
    drawMetric(doc, 14, 53, cardWidth, "Days summarized", dailySummaries.length.toLocaleString());
    drawMetric(doc, 18 + cardWidth, 53, cardWidth, "Mean activity index", `${meanActivity} / 100`);
    drawMetric(doc, 22 + cardWidth * 2, 53, cardWidth, "Peak FRP", `${peakFrp.toLocaleString()} MW`);
    const byMonth = new Map<string, { label: string; activity: number; count: number; days: number }>();
    for (const day of dailySummaries) {
      const monthKey = day.date.slice(0, 7);
      const monthDate = new Date(`${monthKey}-01T12:00:00`);
      const month = byMonth.get(monthKey) ?? {
        label: monthDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        activity: 0,
        count: 0,
        days: 0,
      };
      month.activity += day.activityIndex;
      month.count += day.observationCount;
      month.days += 1;
      byMonth.set(monthKey, month);
    }
    const monthly = [...byMonth.values()];
    drawLineChart(doc, 14, 87, pageWidth - 28, 59, "Monthly mean activity index (0-100)", monthly.map((month) => ({
      label: month.label,
      value: Math.round(month.activity / month.days),
    })), 100);
    drawLineChart(doc, 14, 151, pageWidth - 28, 42, "Monthly illustrative detections", monthly.map((month) => ({
      label: month.label,
      value: month.count,
    })), Math.max(1, ...monthly.map((month) => month.count)));
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#71766e");
    doc.text(`Total illustrative daily detections in selected period: ${detections.toLocaleString()}`, 14, 202);
  }

  if (datasets.includes("alerts")) {
    if (hasPage) doc.addPage();
    drawReportHeader(doc, "Fire alert examples", range, pageWidth, filters);
    const active = alerts.filter((alert) => alert.status === "Active").length;
    const resolved = alerts.filter((alert) => alert.status === "Resolved").length;
    const cardWidth = (pageWidth - 36) / 3;
    drawMetric(doc, 14, 53, cardWidth, "Matching examples", alerts.length.toLocaleString());
    drawMetric(doc, 18 + cardWidth, 53, cardWidth, "Active examples", active.toLocaleString());
    drawMetric(doc, 22 + cardWidth * 2, 53, cardWidth, "Resolved examples", resolved.toLocaleString());
    drawHorizontalBars(doc, 14, 87, 120, "Examples by status", [
      { label: "Active", value: active },
      { label: "Resolved", value: resolved },
    ]);
    const severities = ["High", "Moderate", "Watch"] as const;
    drawHorizontalBars(doc, 158, 87, 124, "Examples by severity", severities.map((label) => ({
      label,
      value: alerts.filter((alert) => alert.severity === label).length,
    })));
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#5a6058");
    doc.text(
      doc.splitTextToSize("These are illustrative signal examples, not verified incidents or confirmed wildfire emergencies.", pageWidth - 28),
      14,
      129,
    );
  }

  for (let page = 1; page <= doc.getNumberOfPages(); page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#858a81");
    doc.text("Illustrative sample data · Not validated satellite measurements", 14, 203);
    doc.text(`${page} / ${doc.getNumberOfPages()}`, pageWidth - 14, 203, { align: "right" });
  }

  const fileRange = `${startDate}-to-${endDate}`;
  doc.save(`ember-grid-visual-report-${fileRange}.pdf`);
}

export default function DataExport() {
  const [isOpen, setIsOpen] = useState(false);
  const [datasets, setDatasets] = useState<ExportDataset[]>(["observations"]);
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [sensor, setSensor] = useState<"All" | Sensor>("All");
  const [confidence, setConfidence] = useState<Confidence>("All");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("All");
  const [fireType, setFireType] = useState<FireType>("All");
  const [alertStatus, setAlertStatus] = useState<"All" | AlertStatus>("All");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen]);

  const filters: DashboardFilters = { sensor, confidence, timeOfDay, fireType };
  const validDateRange = !startDate || !endDate || startDate <= endDate;
  const rangeStart = startDate || "2020-01-01";
  const rangeEnd = endDate || "2025-12-31";
  const filteredObservations = filterObservations(
    observations,
    filters,
    undefined,
    false,
    rangeStart,
    rangeEnd,
  );
  const filteredAlerts = demoAlerts.filter((alert) => (
    alert.detectedAt >= rangeStart
    && alert.detectedAt <= rangeEnd
    && (alertStatus === "All" || alert.status === alertStatus)
  ));
  const dailySummaries: DailySummary[] = [];
  if (datasets.includes("daily-activity") && validDateRange) {
    const currentDate = new Date(`${rangeStart}T12:00:00`);
    const lastDate = new Date(`${rangeEnd}T12:00:00`);
    while (currentDate <= lastDate) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      const summary = dailyActivity(currentDate, filters);
      dailySummaries.push({
        date,
        observationCount: summary.observations,
        activityIndex: summary.activity,
        peakFrp: summary.frp,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  const exportCount = (datasets.includes("observations") ? filteredObservations.length : 0)
    + dailySummaries.length
    + (datasets.includes("alerts") ? filteredAlerts.length : 0);

  function toggleDataset(dataset: ExportDataset) {
    setDatasets((selected) => selected.includes(dataset)
      ? selected.filter((item) => item !== dataset)
      : [...selected, dataset]);
  }

  function downloadExport() {
    if (datasets.length === 0 || !validDateRange) return;
    makePdfReport({
      datasets,
      observations: filteredObservations,
      dailySummaries,
      alerts: filteredAlerts,
      startDate: rangeStart,
      endDate: rangeEnd,
      filters,
    });
  }

  return (
    <>
      <button ref={triggerRef} type="button" className="export-trigger" onClick={() => setIsOpen(true)}>
        <Download aria-hidden="true" />
        Export
      </button>
      {isOpen && (
        <div className="export-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}>
          <section className="export-dialog" role="dialog" aria-modal="true" aria-labelledby="export-title" aria-describedby="export-description">
            <header className="export-dialog-header">
              <div><span className="section-kicker">DOWNLOAD DATA</span><h2 id="export-title">Export dashboard data</h2></div>
              <button ref={closeRef} type="button" className="export-close" aria-label="Close export dialog" onClick={() => setIsOpen(false)}><X aria-hidden="true" /></button>
            </header>
            <p id="export-description" className="export-description">Choose data and filters for a visual PDF report.</p>

            <fieldset className="export-dataset-options">
              <legend>DATA TO INCLUDE</legend>
              {datasetOptions.map(({ id, label }) => (
                <label key={id}>
                  <input type="checkbox" checked={datasets.includes(id)} onChange={() => toggleDataset(id)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            <div className="export-fields">
              <label className="export-field"><span>START DATE</span><input type="date" min="2020-01-01" max="2025-12-31" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
              <label className="export-field"><span>END DATE</span><input type="date" min="2020-01-01" max="2025-12-31" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
              <label className="export-field"><span>SENSOR</span><select value={sensor} onChange={(event) => setSensor(event.target.value as "All" | Sensor)}><option>All</option><option>MODIS</option><option>VIIRS</option></select></label>
              <label className="export-field"><span>CONFIDENCE</span><select value={confidence} onChange={(event) => setConfidence(event.target.value as Confidence)}><option>All</option><option>High</option><option>Nominal</option><option>Low</option></select></label>
              <label className="export-field"><span>TIME OF DAY</span><select value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value as TimeOfDay)}><option>All</option><option>Day</option><option>Night</option></select></label>
              <label className="export-field"><span>FIRE TYPE</span><select value={fireType} onChange={(event) => setFireType(event.target.value as FireType)}><option>All</option><option>Vegetation</option><option>Volcano</option><option>Static</option><option>Offshore</option></select></label>
              <label className="export-field"><span>ALERT STATUS</span><select value={alertStatus} onChange={(event) => setAlertStatus(event.target.value as "All" | AlertStatus)}><option>All</option><option>Active</option><option>Resolved</option></select></label>
            </div>

            {!validDateRange && <p className="export-validation" role="alert">Start date must be on or before end date.</p>}
            <p className="export-count" aria-live="polite">{exportCount.toLocaleString()} items in PDF report</p>
            <footer className="export-actions">
              <button type="button" className="export-cancel" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="button" className="export-download" onClick={downloadExport} disabled={datasets.length === 0 || exportCount === 0 || !validDateRange}><Download aria-hidden="true" />Download PDF</button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
