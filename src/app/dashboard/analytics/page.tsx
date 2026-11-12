"use client";

import { useMemo, useState } from "react";
import { Activity, CalendarDays, Info } from "lucide-react";
import {
  dailyActivity,
  filterObservations,
  historicalYearProfiles,
  monthNames,
  monthlyActivitySummary,
  observationDateKey,
  observations,
  type Confidence,
  type DashboardFilters,
} from "@/components/dashboard/dashboard-data";

const confidenceOptions: Confidence[] = ["All", "High", "Nominal", "Low"];
const historicalYears = historicalYearProfiles.map(({ year }) => year);

function riskLevel(score: number) {
  if (score < 20) return { label: "Very Low", className: "very-low" };
  if (score < 40) return { label: "Low", className: "low" };
  if (score < 60) return { label: "Moderate", className: "moderate" };
  if (score < 80) return { label: "High", className: "high" };
  return { label: "Very High", className: "very-high" };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2025-08");
  const [confidence, setConfidence] = useState<Confidence>("All");
  const filters = useMemo<DashboardFilters>(
    () => ({ sensor: "All", confidence, timeOfDay: "All", fireType: "All" }),
    [confidence],
  );
  const matchingObservations = filterObservations(observations, filters);
  const latestDateKey = matchingObservations.reduce((latest, record) => {
    const key = observationDateKey(record);
    return key > latest ? key : latest;
  }, "");
  const latestDate = latestDateKey ? new Date(`${latestDateKey}T12:00:00`) : null;
  const latestRecords = latestDateKey
    ? matchingObservations.filter((record) => observationDateKey(record) === latestDateKey)
    : [];
  const latestActivity = latestDate ? dailyActivity(latestDate, filters) : null;
  const latestFrp = latestRecords.reduce((sum, record) => sum + record.frp, 0);
  const peakLatestFrp = latestRecords.reduce((peak, record) => Math.max(peak, record.frp), 0);
  const dailyBaselines = latestDate
    ? historicalYears
      .filter((year) => year < latestDate.getFullYear())
      .map((year) => new Date(year, latestDate.getMonth(), latestDate.getDate()))
      .filter((date) => date.getMonth() === latestDate.getMonth() && date.getDate() === latestDate.getDate())
      .map((date) => dailyActivity(date, filters))
    : [];
  const dailyBaseline = dailyBaselines.length
    ? {
      activity: dailyBaselines.reduce((sum, day) => sum + day.activity, 0) / dailyBaselines.length,
      observations: dailyBaselines.reduce((sum, day) => sum + day.observations, 0) / dailyBaselines.length,
      frp: dailyBaselines.reduce((sum, day) => sum + day.frp, 0) / dailyBaselines.length,
    }
    : null;
  const latestRisk = latestActivity ? riskLevel(latestActivity.activity) : null;

  const selectedYear = Number(selectedMonth.slice(0, 4));
  const selectedMonthIndex = Number(selectedMonth.slice(5, 7)) - 1;
  const monthDate = new Date(selectedYear, selectedMonthIndex, 1, 12);
  const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const monthlySeries = historicalYears.map((year) => ({
    year,
    ...monthlyActivitySummary(year, selectedMonthIndex, filters),
  }));
  const selectedMonthSummary = monthlySeries.find(({ year }) => year === selectedYear);
  const priorYearSummaries = monthlySeries.filter(({ year }) => year < selectedYear);
  const historicalMonthlyAverage = priorYearSummaries.length
    ? priorYearSummaries.reduce((sum, item) => sum + item.observations, 0) / priorYearSummaries.length
    : null;
  const monthlyDeviation = historicalMonthlyAverage !== null && historicalMonthlyAverage > 0 && selectedMonthSummary
    ? ((selectedMonthSummary.observations - historicalMonthlyAverage) / historicalMonthlyAverage) * 100
    : null;
  const monthlyRisk = selectedMonthSummary ? riskLevel(selectedMonthSummary.activity) : null;
  const maxMonthlyObservations = Math.max(1, ...monthlySeries.map(({ observations: count }) => count));

  const seasonalGrid = historicalYears.map((year) => ({
    year,
    months: monthNames.map((_, month) => monthlyActivitySummary(year, month, filters).activity),
  }));
  const seasonalAverages = monthNames.map((_, month) => ({
    month,
    average: seasonalGrid.reduce((sum, year) => sum + year.months[month], 0) / seasonalGrid.length,
  }));
  const highActivityMonths = [...seasonalAverages]
    .sort((left, right) => right.average - left.average)
    .slice(0, 3);

  function chooseSeasonalMonth(year: number, month: number) {
    setSelectedMonth(`${year}-${String(month + 1).padStart(2, "0")}`);
  }

  return (
    <main className="dashboard-page-content analytics-shell">
      <div className="dashboard-content">
        <section className="dashboard-intro">
          <div>
            <div className="eyebrow"><span>FIRE ANALYTICS</span><span className="eyebrow-divider" />CALIFORNIA, USA</div>
            <h1>Analytics</h1>
            <p>Current activity risk and historical monthly and seasonal patterns for the California, USA area of interest.</p>
          </div>
          <div className="data-stamp"><span>HISTORICAL SERIES</span><strong>2020–2025</strong></div>
        </section>

        <section className="control-bar analytics-controls" aria-label="Analytics filters">
          <label className="control-field control-aoi">
            <span>AREA OF INTEREST</span>
            <span className="control-input control-static"><Activity aria-hidden="true" />California, USA</span>
          </label>
          <label className="control-field control-range">
            <span>MONTHLY PERIOD</span>
            <span className="control-input"><CalendarDays aria-hidden="true" /><input aria-label="Select monthly fire risk period" type="month" min="2020-01" max="2025-12" value={selectedMonth} onChange={(event) => { if (event.target.value) setSelectedMonth(event.target.value); }} /></span>
          </label>
          <label className="filter-select">
            <span>CONFIDENCE</span>
            <select value={confidence} onChange={(event) => setConfidence(event.target.value as Confidence)}>{confidenceOptions.map((option) => <option key={option}>{option}</option>)}</select>
          </label>
        </section>

        <section className="panel analytics-current-panel" aria-labelledby="analytics-current-heading">
          <div className="panel-heading">
            <div><span className="section-kicker">TODAY · CURRENT FIRE ACTIVITY RISK</span><h2 id="analytics-current-heading">California, USA</h2><p>Risk is based on the latest available sample observations; no live feed is connected.</p></div>
            {latestRisk && <span className={`analytics-risk-badge risk-${latestRisk.className}`}>{latestRisk.label} risk</span>}
          </div>
          <div className="analytics-current-content">
            <div className="analytics-index-card">
              <span>HISTORICAL FIRE ACTIVITY INDEX</span>
              <strong>{latestActivity ? latestActivity.activity : "—"}<em> / 100</em></strong>
              {latestActivity
                ? <div className="analytics-index-track" role="meter" aria-label="Historical Fire Activity Index" aria-valuemin={0} aria-valuemax={100} aria-valuenow={latestActivity.activity}><i style={{ width: `${latestActivity.activity}%` }} /></div>
                : <p className="analytics-index-empty">No activity index is available.</p>}
              <small>Latest available observation date: <b>{latestDate ? latestDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unavailable"}</b></small>
            </div>
            <div className="analytics-current-metrics">
              <article><span>HOTSPOT OBSERVATIONS</span><strong>{latestRecords.length ? formatNumber(latestRecords.length) : "—"}</strong><small>{dailyBaseline ? `Same-day historical average: ${formatNumber(dailyBaseline.observations)}` : "Historical baseline unavailable"}</small></article>
              <article><span>TOTAL FRP</span><strong>{latestRecords.length ? `${formatNumber(latestFrp)} MW` : "—"}</strong><small>{dailyBaseline ? `Same-day FRP baseline: ${formatNumber(dailyBaseline.frp)} MW` : "Historical baseline unavailable"}</small></article>
              <article><span>PEAK FRP</span><strong>{latestRecords.length ? `${formatNumber(peakLatestFrp)} MW` : "—"}</strong><small>Across latest-date sample records</small></article>
              <article><span>ACTIVITY BASELINE</span><strong>{dailyBaseline ? `${Math.round(dailyBaseline.activity)} / 100` : "—"}</strong><small>Same calendar day in prior years</small></article>
            </div>
          </div>
          <p className="analytics-note"><Info aria-hidden="true" />Risk bands: Very Low 0–19 · Low 20–39 · Moderate 40–59 · High 60–79 · Very High 80–100. Sample FRP and observation counts are illustrative, not validated satellite measurements.</p>
        </section>

        <section className="panel analytics-month-panel" aria-labelledby="analytics-month-heading">
          <div className="panel-heading">
            <div><span className="section-kicker">MONTHLY FIRE RISK</span><h2 id="analytics-month-heading">{monthLabel} · year-by-year comparison</h2><p>Monthly hotspot-observation estimates compared with earlier years in the illustrative series.</p></div>
            {monthlyRisk && <span className={`analytics-risk-badge risk-${monthlyRisk.className}`}>{monthlyRisk.label} risk</span>}
          </div>
          <div className="analytics-month-metrics">
            <article><span>MONTHLY ACTIVITY SCORE</span><strong>{selectedMonthSummary?.activity ?? "—"}<em> / 100</em></strong><small>{monthlyRisk?.label ?? "Unavailable"} activity risk</small></article>
            <article><span>MONTHLY HOTSPOT ESTIMATE</span><strong>{selectedMonthSummary ? formatNumber(selectedMonthSummary.observations) : "—"}</strong><small>{monthLabel}</small></article>
            <article><span>HISTORICAL MONTHLY AVERAGE</span><strong>{historicalMonthlyAverage === null ? "—" : formatNumber(Math.round(historicalMonthlyAverage))}</strong><small>{priorYearSummaries.length ? `Average of ${priorYearSummaries.length} prior years` : "No prior-year baseline available"}</small></article>
            <article><span>DEVIATION FROM AVERAGE</span><strong className={monthlyDeviation !== null && monthlyDeviation > 0 ? "analytics-positive" : monthlyDeviation !== null && monthlyDeviation < 0 ? "analytics-negative" : ""}>{monthlyDeviation === null ? "—" : `${monthlyDeviation > 0 ? "+" : ""}${Math.round(monthlyDeviation)}%`}</strong><small>Selected month vs. prior years</small></article>
          </div>
          <div className="analytics-year-chart" role="group" aria-label={`Illustrative monthly hotspot estimate for ${monthNames[selectedMonthIndex]} compared across years`}>
            {monthlySeries.map(({ year, observations: count, activity }) => (
              <div className={`analytics-year-bar-row${year === selectedYear ? " is-selected" : ""}`} key={year} role="group" aria-label={`${year}: ${formatNumber(count)} estimated observations, activity score ${activity}`}>
                <span>{year}</span>
                <div className="analytics-year-bar-track"><i style={{ width: `${(count / maxMonthlyObservations) * 100}%` }} /></div>
                <strong>{formatNumber(count)}</strong>
                <small>Index {activity}</small>
              </div>
            ))}
          </div>
          <p className="analytics-note"><Info aria-hidden="true" />Yearly counts are synthetic estimates derived from the demo activity series; historical satellite counts are not available.</p>
        </section>

        <section className="panel analytics-season-panel" aria-labelledby="analytics-season-heading">
          <div className="panel-heading">
            <div><span className="section-kicker">SEASONAL FIRE RISK</span><h2 id="analytics-season-heading">Historical activity by month</h2><p>Select a month to inspect its monthly risk and year-by-year comparison above.</p></div>
            <span className="calendar-unit">ACTIVITY INDEX · 0–100</span>
          </div>
          <div className="analytics-season-wrap">
            <div className="analytics-season-labels"><span>YEAR</span>{monthNames.map((month) => <span key={month}>{month}</span>)}</div>
            {seasonalGrid.map(({ year, months }) => (
              <div className="analytics-season-row" key={year}>
                <strong>{year}</strong>
                {months.map((score, month) => {
                  const heatLevel = riskLevel(score).className;
                  const isSelected = selectedYear === year && selectedMonthIndex === month;
                  return <button
                    className={`analytics-season-cell heat-${heatLevel}${isSelected ? " is-selected" : ""}`}
                    type="button"
                    key={monthNames[month]}
                    aria-label={`${monthNames[month]} ${year}: activity index ${score}${isSelected ? ", selected month" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => chooseSeasonalMonth(year, month)}
                  >{score}</button>;
                })}
              </div>
            ))}
          </div>
          <div className="analytics-season-legend" aria-label="Activity index levels">
            <span>Very Low</span><i className="heat-very-low" /><i className="heat-low" /><i className="heat-moderate" /><i className="heat-high" /><i className="heat-very-high" /><span>Very High</span>
          </div>
          <div className="analytics-high-months">
            <strong>Historically high-activity months</strong>
            {highActivityMonths.map(({ month, average }) => <button key={month} type="button" onClick={() => chooseSeasonalMonth(selectedYear, month)}>{monthNames[month]} <span>avg. {Math.round(average)}</span></button>)}
          </div>
          <p className="analytics-note"><Info aria-hidden="true" />Heatmap values summarize the illustrative monthly activity index for each year; they are not historical satellite observations.</p>
        </section>

        <p className="analytics-disclaimer">All values are static synthetic demonstration data for California, USA. This prototype is not a live fire-risk service or a validated scientific assessment.</p>
      </div>
    </main>
  );
}
