import { useMemo, useState, type PointerEvent } from "react";
import { dailyActivity, dateKey, dayLabel, dayOfYear, filterObservations, monthNames, observations, type DashboardFilters } from "@/components/dashboard/dashboard-data";

export function MonthlySensorChart({ filters, startDate, endDate }: { filters: DashboardFilters; startDate?: string; endDate?: string }) {
  const records = filterObservations(observations, filters, undefined, !startDate && !endDate, startDate, endDate);
  const modis = records.filter((item) => item.sensor === "MODIS").length;
  const viirs = records.filter((item) => item.sensor === "VIIRS").length;
  const max = Math.max(1, modis, viirs);
  const x = 70;
  return (
    <svg className="chart-svg" viewBox="0 0 650 230" role="img" aria-label="Sample detection counts for the selected period">
      {[0, 1, 2, 3, 4].map((tick) => <g key={tick}><line className="chart-gridline" x1="42" x2="604" y1={180 - tick * 38} y2={180 - tick * 38} /><text className="chart-axis" x="32" y={184 - tick * 38} textAnchor="end">{Math.round(max * tick / 4)}</text></g>)}
      <rect x={x} y={180 - (modis / max) * 152} width="74" height={(modis / max) * 152} rx="5" className="chart-observed-bar" />
      <rect x={x + 94} y={180 - (viirs / max) * 152} width="74" height={(viirs / max) * 152} rx="5" className="chart-baseline-bar" />
      <text className="chart-axis" x={x + 37} y="205" textAnchor="middle">MODIS · {modis}</text>
      <text className="chart-axis" x={x + 131} y="205" textAnchor="middle">VIIRS · {viirs}</text>
      <text className="chart-axis" x="610" y="205" textAnchor="end">SELECTED PERIOD</text>
      <text className="chart-axis" x="42" y="18">Sample detections</text>
      <rect x={470} y="44" width="12" height="12" className="chart-observed-bar" /><text className="chart-axis" x="490" y="54">MODIS</text>
      <rect x={470} y="64" width="12" height="12" className="chart-baseline-bar" /><text className="chart-axis" x="490" y="74">VIIRS</text>
    </svg>
  );
}

type DashboardView = "RAW" | "HARMONIZED";

const historicalScenarios = [
  { year: 2020, scale: 0.72, color: "#8797a8", deviations: { 7: 5 } },
  { year: 2021, scale: 0.8, color: "#738c73", deviations: { 2: 5, 7: -4 } },
  { year: 2022, scale: 0.76, color: "#c08752", deviations: { 7: 18 } },
  { year: 2023, scale: 0.89, color: "#8c78a8", deviations: { 6: 8 } },
  { year: 2024, scale: 0.94, color: "#4b8c91", deviations: { 7: -12 } },
  { year: 2025, scale: 1, color: "#bb542e", deviations: { 7: 5 } },
];

export function HistoricalActivityTrend({ filters }: { filters: DashboardFilters }) {
  const [hoveredPoint, setHoveredPoint] = useState<{ month: number; year: number } | null>(null);
  const series = historicalScenarios.map(({ year, scale, color, deviations }) => {
    const values = monthNames.map((_, month) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthActivity = Array.from({ length: daysInMonth }, (_, day) => (
        dailyActivity(new Date(year, month, day + 1), filters).activity
      )).reduce((sum, value) => sum + value, 0) / daysInMonth;
      return Math.max(0, Math.min(100, Math.round(monthActivity * scale + (deviations[month as keyof typeof deviations] ?? 0))));
    });
    const points = values.map((value, month) => ({
      x: 58 + month * (548 / (monthNames.length - 1)),
      y: 188 - value * 1.5,
      value,
    }));
    return {
      year,
      color,
      points,
      path: points.map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x},${y}`).join(" "),
    };
  });
  const hoveredValues = hoveredPoint ? series.map(({ year, color, points }) => ({
    year,
    color,
    value: points[hoveredPoint.month].value,
    isActive: year === hoveredPoint.year,
  })) : [];
  const hoveredX = hoveredPoint ? series[0].points[hoveredPoint.month].x : null;

  function chooseHoveredPoint(event: PointerEvent<SVGPathElement>, year: number) {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    if (bounds.width === 0) return;
    const viewBoxX = ((event.clientX - bounds.left) / bounds.width) * 650;
    const month = Math.max(0, Math.min(monthNames.length - 1, Math.round((viewBoxX - 58) / (548 / (monthNames.length - 1)))));
    setHoveredPoint({ month, year });
  }

  return (
    <div className="historical-trend">
      <div className="chart-legend historical-trend-legend" aria-label="Years shown">
        {series.map(({ year, color }) => <span className={hoveredPoint?.year === year ? "is-active" : ""} key={year}><i className="historical-year-swatch" style={{ borderColor: color }} />{year}</span>)}
      </div>
      <svg className="chart-svg historical-trend-svg" viewBox="0 0 650 230" role="group" aria-label="Illustrative monthly fire activity index compared across years 2020 to 2025" onPointerLeave={() => setHoveredPoint(null)}>
        <defs>
          <linearGradient id="historical-trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#bb542e" stopOpacity=".2" />
            <stop offset="100%" stopColor="#bb542e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect className="historical-trend-plot" x="48" y="34" width="562" height="154" rx="8" />
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = 188 - tick * 1.5;
          return <g key={tick}><line className="chart-gridline" x1="48" x2="610" y1={y} y2={y} /><text className="chart-axis" x="39" y={y + 3} textAnchor="end">{tick}</text></g>;
        })}
        <text className="chart-axis" x="48" y="18">Activity index (0–100)</text>
        {hoveredX !== null && <line className="historical-trend-cursor" x1={hoveredX} x2={hoveredX} y1="36" y2="188" />}
        {series.map(({ year, color, points, path }) => (
          <g className={hoveredPoint ? (hoveredPoint.year === year ? "historical-series is-active" : "historical-series is-muted") : "historical-series"} key={year}>
            {year === 2025 && <path className="historical-trend-area" d={`${path} L${points[points.length - 1].x},188 L${points[0].x},188 Z`} />}
            <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={year === 2025 ? 3 : 2} />
            <path className="historical-trend-hit-area" d={path} onPointerMove={(event) => chooseHoveredPoint(event, year)} />
            {points.map(({ x, y, value }, month) => <circle
              aria-label={`${monthNames[month]} ${year}: activity index ${value}`}
              className={`historical-trend-point${hoveredPoint?.month === month && hoveredPoint.year === year ? " is-active" : ""}`}
              cx={x}
              cy={y}
              data-month={month}
              fill={color}
              key={month}
              onFocus={() => setHoveredPoint({ month, year })}
              onPointerEnter={() => setHoveredPoint({ month, year })}
              r={hoveredPoint?.month === month && hoveredPoint.year === year ? 5 : year === 2025 ? 3 : 2.5}
              tabIndex={0}
            ><title>{`${monthNames[month]} ${year}: activity index ${value} (illustrative)`}</title></circle>)}
          </g>
        ))}
        {monthNames.map((month, index) => <text className="chart-axis" key={month} x={58 + index * (548 / (monthNames.length - 1))} y="210" textAnchor="middle">{month}</text>)}
      </svg>
      <div className="historical-trend-readout" aria-live="polite">
        {hoveredPoint ? (
          <>
            <div className="historical-trend-readout-title"><strong>{monthNames[hoveredPoint.month]}</strong><span>Monthly activity index · illustrative</span></div>
            <div className="historical-trend-readout-values">
              {hoveredValues.map(({ year, color, value, isActive }) => <span className={isActive ? "is-active" : ""} key={year}><i style={{ backgroundColor: color }} />{year}<strong>{value}</strong></span>)}
            </div>
          </>
        ) : <span className="historical-trend-hint">Hover over a line or focus a point to compare monthly values.</span>}
      </div>
    </div>
  );
}

export function CalendarHeatmap({ selectedDate, onSelect, filters, view }: { selectedDate: Date; onSelect: (date: Date) => void; filters: DashboardFilters; view: DashboardView }) {
  const days = useMemo(() => Array.from({ length: 365 }, (_, index) => dailyActivity(new Date(2025, 0, index + 1), filters)), [filters]);
  const firstOffset = new Date(2025, 0, 1).getDay();
  const monthStarts = monthNames.map((month, index) => ({ month, week: Math.floor((firstOffset + dayOfYear(new Date(2025, index, 1)) - 1) / 7) }));

  return (
    <div className="calendar-wrap">
      <div className="calendar-months" aria-hidden="true">
        {monthStarts.map(({ month, week }) => <span key={month} style={{ left: `${(week / 53) * 100}%` }}>{month}</span>)}
      </div>
      <div className="calendar-grid" role="group" aria-label="Daily fire detections during 2025">
        {Array.from({ length: firstOffset }, (_, index) => <span aria-hidden="true" className="calendar-blank" key={`blank-${index}`} />)}
        {days.map((day, index) => {
          const intensityValue = view === "RAW" ? day.observations / 4.3 : day.activity;
          const intensity = intensityValue === 0 ? 0 : Math.max(1, Math.min(5, Math.ceil(intensityValue / 20)));
          return (
            <button
              key={day.key}
              type="button"
              aria-label={`${dayLabel(day.date)}: ${day.observations} observations, ${day.activity} harmonized activity, ${day.frp} MW FRP, ${day.anomaly}% anomaly`}
              aria-pressed={dateKey(selectedDate) === day.key}
              className={`calendar-day intensity-${intensity} ${index >= 170 ? "tooltip-align-end" : "tooltip-align-start"}${dateKey(selectedDate) === day.key ? " is-selected" : ""}`}
              title={`${dayLabel(day.date)} · ${day.observations} fire observations · ${day.activity} harmonized activity · ${day.meanFrp} MW mean FRP · ${day.frp.toLocaleString()} MW peak FRP · ${day.anomaly > 0 ? "+" : ""}${day.anomaly}% anomaly`}
              onClick={() => onSelect(day.date)}
            ><span className="calendar-tooltip"><strong>{dayLabel(day.date)}</strong><span>{day.observations.toLocaleString()} fire observations</span><span>{day.activity} harmonized activity</span><span>Mean FRP {day.meanFrp} MW · Peak {day.frp.toLocaleString()} MW</span><span>Anomaly {day.anomaly > 0 ? "+" : ""}{day.anomaly}%</span></span></button>
          );
        })}
      </div>
      <div className="calendar-legend"><span>Low</span>{[1, 2, 3, 4, 5].map((level) => <i className={`intensity-${level}`} key={level} />)}<span>High</span></div>
    </div>
  );
}

export function SeasonalChart({ selectedDate, activity, anomaly, view }: { selectedDate: Date; activity: number; anomaly: number; view: DashboardView }) {
  const selectedMonth = selectedDate.getMonth();
  const selectedActivity = view === "RAW" ? Math.round(activity * 0.78) : activity;
  const selectedBaseline = Math.max(1, Math.round(selectedActivity / (1 + anomaly / 100)));
  const baselinePoints = [
    { month: 0, value: 16, baseline: 20 }, { month: 1, value: 22, baseline: 23 }, { month: 2, value: 72, baseline: 51 },
    { month: 3, value: 43, baseline: 35 }, { month: 4, value: 28, baseline: 33 }, { month: 5, value: 38, baseline: 42 },
    { month: 6, value: 55, baseline: 53 }, { month: 7, value: 76, baseline: 65 }, { month: 8, value: 87, baseline: 78 },
    { month: 9, value: 64, baseline: 62 }, { month: 10, value: 33, baseline: 38 }, { month: 11, value: 18, baseline: 24 },
  ];
  const points = baselinePoints.map((point, index) => index === selectedMonth ? { ...point, value: selectedActivity, baseline: selectedBaseline } : point);
  const x = (index: number) => 42 + index * 51;
  const y = (value: number) => 176 - value * 1.55;
  const line = (key: "value" | "baseline") => points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point[key])}`).join(" ");
  const range = `${points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point.baseline + 11)}`).join(" ")} ${points.slice().reverse().map((point, reverseIndex) => { const index = points.length - 1 - reverseIndex; return `L${x(index)},${y(point.baseline - 11)}`; }).join(" ")} Z`;
  const expectedBoundary = selectedActivity > selectedBaseline + 11 ? selectedBaseline + 11 : selectedActivity < selectedBaseline - 11 ? selectedBaseline - 11 : null;
  return (
    <svg className="chart-svg" viewBox="0 0 650 230" role="img" aria-label="Monthly fire activity compared with historical seasonal baseline">
      {[20, 60, 100, 140, 180].map((lineY) => <g key={lineY}><line className="chart-gridline" x1="42" x2="604" y1={lineY} y2={lineY} /><text className="chart-axis" x="30" y={lineY + 3} textAnchor="end">{Math.round((180 - lineY) / 1.55)}</text></g>)}
      <path className="chart-range" d={range} />
      {expectedBoundary !== null && <rect className="chart-anomaly-region" x={x(selectedMonth) - 5} y={Math.min(y(selectedActivity), y(expectedBoundary))} width="10" height={Math.max(2, Math.abs(y(selectedActivity) - y(expectedBoundary)))} />}
      <path className="chart-baseline" d={line("baseline")} />
      <path className="chart-observed" d={line("value")} />
      <line className="chart-selected-guide" x1={x(selectedMonth)} x2={x(selectedMonth)} y1="20" y2="178" />
      {points.map((point, index) => <g key={index}><circle className={index === selectedMonth ? "chart-point chart-point-selected" : "chart-point"} cx={x(index)} cy={y(point.value)} r={index === selectedMonth ? "5" : "3.5"} aria-label={`${monthNames[index]}: activity index ${point.value}`}><title>{`${monthNames[index]}: activity index ${point.value}${index === selectedMonth ? " · selected period" : ""}`}</title></circle><text className="chart-axis" x={x(index)} y="204" textAnchor="middle">{monthNames[index]}</text></g>)}
    </svg>
  );
}

export function FrpChart({ selectedDate, filters, startDate, endDate }: { selectedDate: Date; filters: DashboardFilters; startDate?: string; endDate?: string }) {
  const records = filterObservations(observations, filters, startDate || endDate ? undefined : selectedDate, false, startDate, endDate);
  const peakByDate = new Map<string, number>();
  records.forEach((record) => {
    const frp = Number(record.frp);
    if (!Number.isNaN(frp)) peakByDate.set(record.date, Math.max(peakByDate.get(record.date) ?? 0, frp));
  });
  const daysInMonth = new Date(2025, selectedDate.getMonth() + 1, 0).getDate();
  const values = Array.from({ length: daysInMonth }, (_, index) => {
    const date = `${String(index + 1).padStart(2, "0")} ${monthNames[selectedDate.getMonth()]} 2025`;
    return peakByDate.get(date) ?? null;
  });
  const available = values.filter((value): value is number => value !== null);
  const maximum = Math.max(100, ...available);
  const x = (index: number) => 42 + index * (562 / Math.max(1, values.length - 1));
  const y = (value: number) => 178 - value / maximum * 150;
  const selectedIndex = selectedDate.getDate() - 1;
  const lineSegments = values.slice(0, -1).map((value, index) => {
    const next = values[index + 1];
    return value !== null && next !== null ? <line key={index} className="frp-line" x1={x(index)} y1={y(value)} x2={x(index + 1)} y2={y(next)} /> : null;
  });
  return (
    <svg className="chart-svg" viewBox="0 0 650 230" role="img" aria-label="Daily peak fire radiative power from available sample records">
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => <g key={fraction}><line className="chart-gridline" x1="42" x2="604" y1={178 - fraction * 150} y2={178 - fraction * 150} /><text className="chart-axis" x="30" y={181 - fraction * 150} textAnchor="end">{Math.round(maximum * fraction)}</text></g>)}
      {lineSegments}
      {values.map((value, index) => value !== null ? <circle className={index === selectedIndex ? "frp-point frp-point-selected" : "frp-point"} cx={x(index)} cy={y(value)} key={index} r={index === selectedIndex ? "5" : "3"}><title>{`${index + 1} ${monthNames[selectedDate.getMonth()]} 2025 · peak ${value} MW`}</title></circle> : null)}
      {[1, 8, 15, 22, 29].filter((day) => day <= daysInMonth).map((day) => <text className="chart-axis" key={day} x={x(day - 1)} y="204" textAnchor="middle">{String(day).padStart(2, "0")}</text>)}
      <text className="chart-axis" x="604" y="204" textAnchor="end">{monthNames[selectedDate.getMonth()].toUpperCase()} 2025</text>
      {available.length === 0 && <text className="chart-axis" x="320" y="115" textAnchor="middle">No FRP records match the current filters</text>}
    </svg>
  );
}