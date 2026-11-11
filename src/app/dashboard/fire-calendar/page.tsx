"use client";

import { useMemo, useState } from "react";
import { Activity, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { CalendarHeatmap, HistoricalActivityTrend } from "@/components/dashboard/dashboard-visualizations";
import { dailyActivity, dateKey, dayLabel, dayOfYear, monthNames, type DashboardFilters } from "@/components/dashboard/dashboard-data";

const availableYears = [2020, 2021, 2022, 2023, 2024, 2025];
const allFilters: DashboardFilters = { sensor: "All", confidence: "All", timeOfDay: "All", fireType: "All" };

export default function FireCalendarPage() {
  const [year, setYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 1));
  const days = useMemo(
    () => Array.from({ length: dayOfYear(new Date(year, 11, 31)) }, (_, index) => dailyActivity(new Date(year, 0, index + 1), allFilters)),
    [year],
  );
  const selectedDay = days.find((day) => day.key === dateKey(selectedDate));
  const totalDetections = days.reduce((total, day) => total + day.observations, 0);
  const averageActivity = Math.round(days.reduce((total, day) => total + day.activity, 0) / days.length);
  const peakActivity = Math.max(...days.map((day) => day.activity));
  const peakFrp = Math.max(...days.map((day) => day.frp));

  function chooseYear(value: number) {
    setYear(value);
    setSelectedDate(new Date(value, 0, 1));
  }

  return (
    <main className="dashboard-page-content fire-calendar-shell">
      <div className="dashboard-content">
        <section className="dashboard-intro">
          <div>
            <div className="eyebrow"><span>ACTIVITY HISTORY</span><span className="eyebrow-divider" />CALIFORNIA, USA</div>
            <h1>Fire Calendar</h1>
            <p>Explore daily fire activity by year and compare monthly patterns across the full demo history.</p>
          </div>
          <div className="data-stamp"><span>ILLUSTRATIVE SERIES</span><strong>STATIC DEMO DATA</strong><b>NOT LIVE</b><small>Available years: 2020–2025</small></div>
        </section>

        <section className="metrics-row" aria-label={`${year} activity summary`}>
          <article className="metric"><span>ILLUSTRATIVE DETECTIONS <Info /></span><strong>{totalDetections.toLocaleString()}</strong><small>Daily synthetic index · {year}</small></article>
          <article className="metric"><span>AVERAGE DAILY ACTIVITY <Info /></span><strong>{averageActivity}</strong><small>Activity index, 0–100</small></article>
          <article className="metric"><span>PEAK DAILY ACTIVITY <Info /></span><strong>{peakActivity}</strong><small>Activity index, 0–100</small></article>
          <article className="metric"><span>PEAK FRP <Info /></span><strong>{peakFrp.toLocaleString()}<em> MW</em></strong><small>Maximum daily value · {year}</small></article>
        </section>

        <section className="panel calendar-panel fire-calendar-daily">
          <div className="panel-heading calendar-heading"><div><span className="section-kicker">DAILY FIRE ACTIVITY</span><h2>Daily pattern — {year}</h2><p>Select a day to inspect its illustrative detections, activity, and FRP.</p></div><div className="fire-calendar-year-nav" aria-label="Change calendar year"><button type="button" aria-label="Previous year" disabled={year === availableYears[0]} onClick={() => chooseYear(year - 1)}><ChevronLeft aria-hidden="true" /></button><strong aria-live="polite">{year}</strong><button type="button" aria-label="Next year" disabled={year === availableYears[availableYears.length - 1]} onClick={() => chooseYear(year + 1)}><ChevronRight aria-hidden="true" /></button><span className="calendar-unit"><Activity aria-hidden="true" />{days.length} DAYS</span></div></div>
          <CalendarHeatmap selectedDate={selectedDate} filters={allFilters} view="HARMONIZED" year={year} onSelect={setSelectedDate} />
          {selectedDay && <div className="fire-calendar-selection" aria-live="polite"><strong>{dayLabel(selectedDay.date)}</strong><span>{selectedDay.observations.toLocaleString()} illustrative detections</span><span>Activity {selectedDay.activity}/100</span><span>Peak FRP {selectedDay.frp.toLocaleString()} MW</span></div>}
          <div className="calendar-foot"><span>DAILY SYNTHETIC ACTIVITY · {year}</span><span>Leap years include 366 days</span></div>
        </section>

        <section className="panel historical-trend-panel fire-calendar-monthly">
          <div className="panel-heading chart-heading"><div><span className="section-kicker">MONTHLY FIRE ACTIVITY · ALL YEARS</span><h2>Monthly activity by year</h2><p>Illustrative monthly activity index, compared across 2020–2025; not historical satellite observations.</p></div></div>
          <HistoricalActivityTrend filters={allFilters} />
        </section>
        <p className="fire-calendar-data-note">These daily and monthly values are synthetic demonstration data, not validated or live fire observations. <span>Current daily selection: {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {year}.</span></p>
      </div>
    </main>
  );
}
