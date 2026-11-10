export type Sensor = "MODIS" | "VIIRS";
export type Confidence = "All" | "High" | "Nominal" | "Low";
export type TimeOfDay = "All" | "Day" | "Night";
export type FireType = "All" | "Vegetation" | "Volcano" | "Static" | "Offshore";
export type DashboardFilters = {
  sensor: "All" | Sensor;
  confidence: Confidence;
  timeOfDay: TimeOfDay;
  fireType: FireType;
};

export type Observation = {
  id: string;
  sensor: Sensor;
  satellite: string;
  date: string;
  time: string;
  lat: string;
  lon: string;
  frp: number;
  confidence: string;
  confidenceLevel: Exclude<Confidence, "All">;
  timeOfDay: Exclude<TimeOfDay, "All">;
  fireTypeCategory: Exclude<FireType, "All">;
  brightness: number;
  fireType: string;
  x: number;
  y: number;
};

const observationRecords: Omit<Observation, "confidenceLevel" | "timeOfDay" | "fireTypeCategory">[] = [
  { id: "v1", sensor: "VIIRS", satellite: "NOAA-20", date: "18 Mar 2025", time: "20:42:16", lat: "39.7284", lon: "-121.6182", frp: 1284, confidence: "High · 94%", brightness: 367.8, fireType: "Vegetation fire", x: 42, y: 29 },
  { id: "m1", sensor: "MODIS", satellite: "TERRA", date: "18 Mar 2025", time: "19:51:08", lat: "39.6842", lon: "-121.7021", frp: 842, confidence: "Nominal", brightness: 341.2, fireType: "Vegetation fire", x: 39, y: 31 },
  { id: "v2", sensor: "VIIRS", satellite: "S-NPP", date: "18 Mar 2025", time: "21:06:44", lat: "40.1285", lon: "-121.3261", frp: 614, confidence: "High · 89%", brightness: 351.6, fireType: "Vegetation fire", x: 45, y: 22 },
  { id: "v3", sensor: "VIIRS", satellite: "NOAA-21", date: "18 Mar 2025", time: "21:14:02", lat: "38.1481", lon: "-120.4148", frp: 462, confidence: "High · 91%", brightness: 338.3, fireType: "Vegetation fire", x: 56, y: 47 },
  { id: "m2", sensor: "MODIS", satellite: "AQUA", date: "18 Mar 2025", time: "20:19:36", lat: "37.7486", lon: "-120.9142", frp: 391, confidence: "Nominal", brightness: 329.7, fireType: "Vegetation fire", x: 52, y: 57 },
  { id: "v4", sensor: "VIIRS", satellite: "S-NPP", date: "18 Mar 2025", time: "21:27:51", lat: "36.8241", lon: "-119.6844", frp: 348, confidence: "High · 88%", brightness: 342.8, fireType: "Vegetation fire", x: 62, y: 66 },
  { id: "v5", sensor: "VIIRS", satellite: "NOAA-20", date: "18 Mar 2025", time: "21:31:09", lat: "41.0821", lon: "-123.0174", frp: 274, confidence: "Nominal", brightness: 319.5, fireType: "Vegetation fire", x: 29, y: 13 },
  { id: "m3", sensor: "MODIS", satellite: "TERRA", date: "18 Mar 2025", time: "19:43:20", lat: "34.8412", lon: "-118.6238", frp: 226, confidence: "Nominal", brightness: 326.9, fireType: "Vegetation fire", x: 72, y: 79 },
  { id: "v6", sensor: "VIIRS", satellite: "NOAA-21", date: "18 Mar 2025", time: "21:44:11", lat: "37.1628", lon: "-119.3821", frp: 204, confidence: "High · 92%", brightness: 337.1, fireType: "Vegetation fire", x: 66, y: 58 },
  { id: "m4", sensor: "MODIS", satellite: "AQUA", date: "18 Mar 2025", time: "20:27:54", lat: "38.0241", lon: "-121.9820", frp: 183, confidence: "Nominal", brightness: 312.6, fireType: "Vegetation fire", x: 37, y: 48 },
  { id: "v7", sensor: "VIIRS", satellite: "S-NPP", date: "18 Mar 2025", time: "21:19:08", lat: "35.9144", lon: "-118.4170", frp: 176, confidence: "Nominal", brightness: 321.4, fireType: "Vegetation fire", x: 76, y: 71 },
  { id: "m5", sensor: "MODIS", satellite: "TERRA", date: "18 Mar 2025", time: "19:38:47", lat: "40.6517", lon: "-122.5850", frp: 143, confidence: "Nominal", brightness: 308.8, fireType: "Vegetation fire", x: 34, y: 17 },
  { id: "v8", sensor: "VIIRS", satellite: "NOAA-20", date: "18 Mar 2025", time: "21:53:31", lat: "34.2801", lon: "-117.4689", frp: 121, confidence: "High · 86%", brightness: 316.4, fireType: "Vegetation fire", x: 84, y: 88 },
  { id: "m6", sensor: "MODIS", satellite: "AQUA", date: "18 Mar 2025", time: "20:34:18", lat: "39.2491", lon: "-120.0772", frp: 94, confidence: "Nominal", brightness: 301.7, fireType: "Vegetation fire", x: 58, y: 36 },
  { id: "v9", sensor: "VIIRS", satellite: "NOAA-21", date: "18 Mar 2025", time: "21:02:12", lat: "40.4921", lon: "-121.5050", frp: 59, confidence: "Low", brightness: 306.2, fireType: "Volcano", x: 49, y: 18 },
  { id: "m7", sensor: "MODIS", satellite: "TERRA", date: "18 Mar 2025", time: "19:56:43", lat: "37.8044", lon: "-122.2712", frp: 39, confidence: "Nominal", brightness: 301.1, fireType: "Static", x: 32, y: 52 },
  { id: "v10", sensor: "VIIRS", satellite: "S-NPP", date: "18 Mar 2025", time: "21:18:57", lat: "33.9212", lon: "-120.7310", frp: 23, confidence: "Low", brightness: 298.4, fireType: "Offshore", x: 46, y: 91 },
  { id: "m8", sensor: "MODIS", satellite: "AQUA", date: "07 Jan 2025", time: "20:08:12", lat: "38.6214", lon: "-121.2842", frp: 318, confidence: "Nominal", brightness: 322.4, fireType: "Vegetation fire", x: 43, y: 35 },
  { id: "v11", sensor: "VIIRS", satellite: "NOAA-20", date: "22 Feb 2025", time: "21:31:44", lat: "37.9128", lon: "-120.0761", frp: 427, confidence: "High · 91%", brightness: 348.1, fireType: "Vegetation fire", x: 55, y: 48 },
  { id: "m9", sensor: "MODIS", satellite: "TERRA", date: "04 Apr 2025", time: "19:47:29", lat: "39.2041", lon: "-122.1188", frp: 286, confidence: "Nominal", brightness: 319.6, fireType: "Vegetation fire", x: 38, y: 27 },
  { id: "v12", sensor: "VIIRS", satellite: "S-NPP", date: "16 May 2025", time: "21:08:53", lat: "40.3817", lon: "-123.6112", frp: 512, confidence: "High · 93%", brightness: 355.2, fireType: "Vegetation fire", x: 27, y: 18 },
  { id: "m10", sensor: "MODIS", satellite: "AQUA", date: "29 Jun 2025", time: "20:22:17", lat: "36.7426", lon: "-119.5843", frp: 194, confidence: "Low", brightness: 310.8, fireType: "Static", x: 63, y: 68 },
  { id: "v13", sensor: "VIIRS", satellite: "NOAA-21", date: "11 Aug 2025", time: "21:44:36", lat: "38.9038", lon: "-120.8414", frp: 738, confidence: "High · 96%", brightness: 361.4, fireType: "Vegetation fire", x: 50, y: 30 },
  { id: "m11", sensor: "MODIS", satellite: "TERRA", date: "03 Sep 2025", time: "19:36:08", lat: "35.6221", lon: "-118.8927", frp: 371, confidence: "Nominal", brightness: 327.3, fireType: "Volcano", x: 75, y: 74 },
  { id: "v14", sensor: "VIIRS", satellite: "S-NPP", date: "19 Oct 2025", time: "21:57:02", lat: "39.4825", lon: "-121.7213", frp: 623, confidence: "High · 90%", brightness: 358.9, fireType: "Vegetation fire", x: 40, y: 32 },
];

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const generatedObservationDate = (index: number) => {
  const dayOffset = 3 + index * 2;
  const date = new Date(Date.UTC(2025, 0, dayOffset));
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = monthNames[date.getUTCMonth()];
  return `${day} ${month} 2025`;
};

const californiaBoundary = [
  [42, -124.4], [42, -120], [39, -120], [35, -114.6], [32.5, -114.6],
  [32.5, -117.1], [34, -120.5], [36, -121.9], [38, -123], [40, -124.2],
];

function seededRandom(seed: number) {
  let value = seed + 0x6D2B79F5;
  return () => {
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function californiaCoordinate(index: number): { lat: number; lon: number } {
  const random = seededRandom(index + 20250318);
  let attempt = 0;
  while (attempt < 100) {
    const lat = 32.5 + random() * 9.5;
    const lon = -124.4 + random() * 9.8;
    let inside = false;
    for (let i = 0, j = californiaBoundary.length - 1; i < californiaBoundary.length; j = i++) {
      const [latitudeA, longitudeA] = californiaBoundary[i];
      const [latitudeB, longitudeB] = californiaBoundary[j];
      if ((longitudeA > lon) !== (longitudeB > lon) && lat < (latitudeB - latitudeA) * (lon - longitudeA) / (longitudeB - longitudeA) + latitudeA) inside = !inside;
    }
    if (inside) return { lat, lon };
    attempt += 1;
  }
  const fallback = [[37.2, -121.1], [38.6, -122.4], [36.1, -119.5], [34.5, -118.2], [39.7, -123.1]];
  return { lat: fallback[index % fallback.length][0], lon: fallback[index % fallback.length][1] };
}

const generatedObservationRecords: Omit<Observation, "confidenceLevel" | "timeOfDay" | "fireTypeCategory">[] = Array.from({ length: 175 }, (_, index) => {
  const sensor: Sensor = index % 5 === 0 ? "MODIS" : index % 3 === 0 ? "MODIS" : "VIIRS";
  const coordinates = californiaCoordinate(index);
  const fireType = index % 31 === 0 ? "Volcano" : index % 43 === 0 ? "Static" : index % 47 === 0 ? "Offshore" : "Vegetation fire";
  const confidence = index % 13 === 0 ? "Low" : index % 4 === 0 ? `High · ${88 + index % 10}%` : "Nominal";
  return {
    id: `generated-${String(index + 1).padStart(3, "0")}`,
    sensor,
    satellite: sensor === "MODIS" ? (index % 2 === 0 ? "TERRA" : "AQUA") : (index % 3 === 0 ? "NOAA-20" : index % 3 === 1 ? "NOAA-21" : "S-NPP"),
    date: generatedObservationDate(index),
    time: `${String(18 + index % 5).padStart(2, "0")}:${String(index * 7 % 60).padStart(2, "0")}:${String(index * 11 % 60).padStart(2, "0")}`,
    lat: coordinates.lat.toFixed(4),
    lon: coordinates.lon.toFixed(4),
    frp: 18 + ((index * 137 + index * index * 7) % 780),
    confidence,
    brightness: 298 + index % 68 + (index % 5) / 10,
    fireType,
    x: 24 + index * 7 % 68,
    y: 12 + index * 11 % 82,
  };
});

export const observations: Observation[] = [...observationRecords, ...generatedObservationRecords].map((observation, index) => ({
  ...observation,
  confidenceLevel: observation.confidence.startsWith("High") ? "High" : observation.confidence === "Low" ? "Low" : "Nominal",
  timeOfDay: [1, 5, 9, 13, 16].includes(index % 20) ? "Night" : "Day",
  fireTypeCategory: observation.fireType === "Vegetation fire" ? "Vegetation" : observation.fireType as Exclude<FireType, "All">,
}));

export const dayOfYear = (date: Date) => Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function dailyActivity(date: Date, filters?: DashboardFilters) {
  const day = dayOfYear(date);
  const seasonal = Math.max(0, Math.sin(((day - 90) / 365) * Math.PI * 2));
  const pulse = Math.max(0, 1 - Math.abs(day - 77) / 13);
  const summerPulse = Math.max(0, 1 - Math.abs(day - 230) / 45);
  const wobble = (Math.sin(day * 12.9898) + Math.cos(day * 4.1414)) * 0.5;
  const sensorFactor = filters?.sensor === "MODIS" ? 0.328 : filters?.sensor === "VIIRS" ? 0.672 : 1;
  const confidenceFactor = filters?.confidence === "High" ? 0.43 : filters?.confidence === "Nominal" ? 0.48 : filters?.confidence === "Low" ? 0.09 : 1;
  const timeFactor = filters?.timeOfDay === "Day" ? 0.72 : filters?.timeOfDay === "Night" ? 0.28 : 1;
  const fireFactor = filters?.fireType === "All" || !filters ? 1 : filters.fireType === "Vegetation" ? 0.91 : filters.fireType === "Volcano" ? 0.035 : filters.fireType === "Static" ? 0.035 : 0.02;
  const multiplier = sensorFactor * confidenceFactor * timeFactor * fireFactor;
  const baseObservations = Math.max(0, Math.round(18 + seasonal * 175 + pulse * 235 + summerPulse * 270 + wobble * 28));
  const observationsCount = Math.round(baseObservations * multiplier);
  const baseActivity = dateKey(date) === "2025-03-18" ? 89 : Math.min(100, Math.round(baseObservations / 4.8));
  const activity = Math.min(100, Math.round(baseActivity * (filters?.sensor === "All" || !filters ? 1 : 0.84) * (filters?.confidence === "All" || !filters ? 1 : 0.87) * (filters?.timeOfDay === "All" || !filters ? 1 : 0.9) * (filters?.fireType === "All" || !filters ? 1 : filters.fireType === "Vegetation" ? 1 : 0.56)));
  const baseFrp = dateKey(date) === "2025-03-18" ? 1284 : Math.round(90 + baseObservations * 1.42);
  const frp = Math.max(0, Math.round(baseFrp * (filters?.sensor === "MODIS" ? 0.74 : filters?.sensor === "VIIRS" ? 1 : 1) * (filters?.confidence === "Low" ? 0.35 : 1) * (filters?.fireType === "All" || !filters || filters.fireType === "Vegetation" ? 1 : 0.24)));
  const anomaly = dateKey(date) === "2025-03-18" ? 42 : Math.round(wobble * 14 + seasonal * 8);
  return {
    date,
    key: dateKey(date),
    observations: observationsCount,
    activity,
    meanFrp: observationsCount ? Math.max(0, Math.round(frp / Math.max(1, observationsCount / 38))) : 0,
    frp,
    anomaly,
  };
}

export function observationDateKey(observation: Observation) {
  const [day, month, year] = observation.date.split(" ");
  const monthIndex = monthNames.findIndex((name) => name.toLowerCase() === month.toLowerCase());
  return monthIndex >= 0 ? `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day.padStart(2, "0")}` : "";
}

export function filterObservations(
  records: Observation[],
  filters: DashboardFilters,
  selectedDate?: Date,
  includeFullYear = false,
  startDate?: string,
  endDate?: string,
) {
  return records.filter((item) => {
    const matchesFilters = (filters.sensor === "All" || item.sensor === filters.sensor)
      && (filters.confidence === "All" || item.confidenceLevel === filters.confidence)
      && (filters.timeOfDay === "All" || item.timeOfDay === filters.timeOfDay)
      && (filters.fireType === "All" || item.fireTypeCategory === filters.fireType);
    if (!matchesFilters) return false;

    const key = observationDateKey(item);
    if (startDate || endDate) {
      return (!startDate || key >= startDate) && (!endDate || key <= endDate);
    }
    if (includeFullYear) return key.startsWith("2025-");
    if (selectedDate) return key === dateKey(selectedDate);
    return true;
  });
}

export function dayLabel(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} ${monthNames[date.getMonth()].toUpperCase()} ${date.getFullYear()}`;
}