"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Activity, CalendarDays, ChevronDown, Crosshair, Info, Layers2, MapPin, X } from "lucide-react";
import {
  CalendarHeatmap,
  FrpChart,
  HistoricalActivityTrend,
  MonthlySensorChart,
  SeasonalChart,
} from "@/components/dashboard/dashboard-visualizations";
import {
  dateKey,
  dayLabel,
  filterObservations,
  observations,
  type Confidence,
  type DashboardFilters,
  type FireType,
  type Observation,
  type Sensor,
  type TimeOfDay,
} from "@/components/dashboard/dashboard-data";

const CaliforniaMap = dynamic(() => import("@/components/fire-map"), { ssr: false });

export default function DashboardPage() {
  const [view, setView] = useState<"RAW" | "HARMONIZED">("RAW");
  const [sensor, setSensor] = useState<"All" | Sensor>("All");
  const [confidence, setConfidence] = useState<Confidence>("All");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("All");
  const [fireType, setFireType] = useState<FireType>("All");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 1));
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [mapStyle, setMapStyle] = useState<"standard" | "light">("standard");
  const [mapRecenterKey, setMapRecenterKey] = useState(0);

  const filters: DashboardFilters = { sensor, confidence, timeOfDay, fireType };
  const matchingObservations = filterObservations(observations, filters, undefined, false, startDate, endDate);
  const modisCount = matchingObservations.filter((item) => item.sensor === "MODIS").length;
  const viirsCount = matchingObservations.filter((item) => item.sensor === "VIIRS").length;
  const frps = matchingObservations.map((item) => item.frp).filter((value): value is number => typeof value === "number");
  const peakFrp = frps.length ? Math.max(...frps) : null;
  const meanFrp = frps.length ? Math.round(frps.reduce((sum, value) => sum + value, 0) / frps.length) : null;

  const periodLabel = startDate === endDate ? dayLabel(new Date(`${startDate}T12:00:00`)) : `${dayLabel(new Date(`${startDate}T12:00:00`))} — ${dayLabel(new Date(`${endDate}T12:00:00`))}`;
  const fullYearSelected = startDate === "2025-01-01" && endDate === "2025-12-31";
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

  function chooseDate(date: Date) {
    const key = dateKey(date);
    setSelectedDate(date);
    setStartDate(key);
    setEndDate(key);
    setSelectedObservation(null);
  }

  function chooseStartDate(value: string) {
    if (!value) return;
    const nextEndDate = value > endDate ? value : endDate;
    setStartDate(value);
    setEndDate(nextEndDate);
    if (dateKey(selectedDate) < value || dateKey(selectedDate) > nextEndDate) {
      setSelectedDate(new Date(`${value}T12:00:00`));
    }
    setSelectedObservation(null);
  }

  function chooseEndDate(value: string) {
    if (!value) return;
    const nextStartDate = value < startDate ? value : startDate;
    setStartDate(nextStartDate);
    setEndDate(value);
    if (dateKey(selectedDate) < nextStartDate || dateKey(selectedDate) > value) {
      setSelectedDate(new Date(`${nextStartDate}T12:00:00`));
    }
    setSelectedObservation(null);
  }

  function chooseFilter(update: () => void) {
    update();
    setSelectedObservation(null);
  }

  return (
    <main className="dashboard-page-content">
      <div className="dashboard-content">
        <section className="dashboard-intro">
          <div>
            <div className="eyebrow"><span>FIRE ACTIVITY MONITOR</span><span className="eyebrow-divider" />CALIFORNIA, USA</div>
            <h1>Active Fire Dashboard</h1>
            <p>Compare illustrative MODIS and VIIRS detections for a fixed California area of interest.</p>
          </div>
          <div className="data-stamp"><span>SYNTHETIC DEMONSTRATION</span><strong>STATIC DEMO DATA</strong><b>NOT LIVE</b><small>{fullYearSelected ? "Selected period: full year 2025" : `Selected period: ${periodLabel}`}</small></div>
        </section>

        <section className="control-bar" aria-label="Dashboard controls">
          <label className="control-field control-aoi"><span>AREA OF INTEREST</span><span className="control-input control-static"><MapPin aria-hidden="true" />California, USA</span></label>
          <fieldset className="control-field control-range"><legend>DATE RANGE / YEAR</legend><div className="date-range-inputs"><label className="date-range-input"><span>Start Date</span><input type="date" min="2025-01-01" max="2025-12-31" value={startDate} onChange={(event) => chooseStartDate(event.target.value)} /></label><label className="date-range-input"><span>End Date</span><input type="date" min="2025-01-01" max="2025-12-31" value={endDate} onChange={(event) => chooseEndDate(event.target.value)} /></label></div></fieldset>
          <fieldset className="control-field control-sensor"><legend>SENSOR</legend><div className="segmented-control">{(["All", "MODIS", "VIIRS"] as const).map((option) => <button key={option} aria-pressed={sensor === option} className={sensor === option ? "segment-active" : ""} onClick={() => chooseFilter(() => setSensor(option))}>{option}</button>)}</div></fieldset>
          <fieldset className="control-field control-view"><legend>VIEW</legend><div className="view-control">{(["RAW", "HARMONIZED"] as const).map((option) => <button key={option} aria-pressed={view === option} className={view === option ? "view-active" : ""} onClick={() => setView(option)}>{option}</button>)}</div></fieldset>
        </section>

        <section className="filter-bar" aria-label="Observation filters">
          <label className="filter-select"><span>CONFIDENCE</span><select value={confidence} onChange={(event) => chooseFilter(() => setConfidence(event.target.value as Confidence))}><option>All</option><option>High</option><option>Nominal</option><option>Low</option></select><ChevronDown /></label>
          <label className="filter-select"><span>TIME OF DAY</span><select value={timeOfDay} onChange={(event) => chooseFilter(() => setTimeOfDay(event.target.value as TimeOfDay))}><option>All</option><option>Day</option><option>Night</option></select><ChevronDown /></label>
          <label className="filter-select"><span>FIRE TYPE</span><select value={fireType} onChange={(event) => chooseFilter(() => setFireType(event.target.value as FireType))}><option>All</option><option>Vegetation</option><option>Volcano</option><option>Static</option><option>Offshore</option></select><ChevronDown /></label>
          <span className="filter-state">{matchingObservations.length} matching sample records</span>
        </section>

        <section className="metrics-row" aria-label="Activity summary">
          <article className="metric"><span>OBSERVED DETECTIONS <Info /></span><strong>{formatNumber(matchingObservations.length)}</strong><small>{periodLabel}</small></article>
          <article className="metric"><span>MODIS COUNT <Info /></span><strong>{modisCount}</strong><small>Synthetic sample records</small></article>
          <article className="metric"><span>VIIRS COUNT <Info /></span><strong>{viirsCount}</strong><small>Synthetic sample records</small></article>
          <article className="metric"><span>PEAK FRP <Info /></span><strong>{peakFrp === null ? "—" : formatNumber(peakFrp)}<em> MW</em></strong><small>{meanFrp === null ? "No FRP available" : `Mean ${formatNumber(meanFrp)} MW`}</small></article>
        </section>

        <section className="map-summary-grid">
          <article className="panel map-panel">
            <div className="panel-heading map-heading"><div><span className="section-kicker">GEOGRAPHIC DISTRIBUTION</span><h2>California detections</h2><p>{view === "RAW" ? "Separate MODIS and VIIRS sample detections." : "Illustrative common activity view; no scientific harmonization."}</p></div><div className="map-tools"><button type="button" aria-label={`Switch to ${mapStyle === "standard" ? "light" : "standard"} map`} onClick={() => setMapStyle((current) => current === "standard" ? "light" : "standard")}><Layers2 /></button><button type="button" aria-label="Recenter California map" onClick={() => setMapRecenterKey((key) => key + 1)}><Crosshair /></button></div></div>
            <div className="map-legend"><span><i className="legend-modis" />MODIS · square</span><span><i className="legend-viirs" />VIIRS · circle</span><span><i className="legend-selected" />Selected</span><span className="map-count">{formatNumber(matchingObservations.length)} SHOWN</span></div>
            {matchingObservations.length === 0 ? <div className="map-empty-state"><Activity /><strong>No sample detections match</strong><span>Change the filters or select 18 Mar 2025.</span></div> : <CaliforniaMap observations={matchingObservations} view={view} aoi="California, USA" mapStyle={mapStyle} recenterKey={mapRecenterKey} selectedObservation={selectedObservation} onSelect={(id) => setSelectedObservation(observations.find((item) => item.id === id) ?? null)} />}
            {selectedObservation && <div className="observation-info"><div className="observation-info-top"><div><span className={`sensor-chip ${selectedObservation.sensor.toLowerCase()}`}>{selectedObservation.sensor}</span><span className="observation-satellite">{selectedObservation.satellite} · {selectedObservation.date}</span></div><button aria-label="Close observation details" onClick={() => setSelectedObservation(null)}><X /></button></div><div className="observation-data"><span><small>DATE / TIME</small>{selectedObservation.date} · {selectedObservation.time}</span><span><small>COORDINATES</small>{selectedObservation.lat}, {selectedObservation.lon}</span><span><small>FRP</small>{typeof selectedObservation.frp === "number" ? `${selectedObservation.frp.toLocaleString()} MW` : "Not available"}</span><span><small>CONFIDENCE</small>{selectedObservation.confidence}</span><span><small>FIRE TYPE</small>{selectedObservation.fireType}</span><span><small>DAY / NIGHT</small>{selectedObservation.timeOfDay}</span></div></div>}
          </article>

        </section>

        <section className="panel calendar-panel"><div className="panel-heading calendar-heading"><div><span className="section-kicker">ANNUAL BURNING ACTIVITY</span><h2>Daily pattern — 2025</h2><p>Select a date. Days without sample records are shown as zero or missing.</p></div><span className="calendar-unit"><Activity />ILLUSTRATIVE SERIES</span></div><CalendarHeatmap selectedDate={selectedDate} filters={filters} view={view} onSelect={chooseDate} /><div className="calendar-foot"><span>365 DAYS · STATIC DEMO DATA</span><span>{matchingObservations.length} mapped records in selected range</span></div></section>


        
      </div>
    </main>
  );
}
