export type AlertStatus = "Active" | "Resolved";
export type AlertSeverity = "High" | "Moderate" | "Watch";

export type FireAlert = {
  id: string;
  category: string;
  severity: AlertSeverity;
  status: AlertStatus;
  location: string;
  detectedAt: string;
  signal: string;
};

export const demoAlerts: FireAlert[] = [
  {
    id: "demo-001",
    category: "Unusual Fire Activity",
    severity: "High",
    status: "Active",
    location: "Illustrative area · Northern California",
    detectedAt: "2025-03-18",
    signal: "Synthetic activity index 89, compared with a demo baseline of 47.",
  },
  {
    id: "demo-002",
    category: "High FRP",
    severity: "High",
    status: "Active",
    location: "Illustrative area · Central California",
    detectedAt: "2025-03-17",
    signal: "Sample fire radiative power value reached 1,280 MW.",
  },
  {
    id: "demo-003",
    category: "High Hotspot Concentration",
    severity: "Moderate",
    status: "Active",
    location: "Illustrative area · Southern California",
    detectedAt: "2025-03-14",
    signal: "Synthetic hotspot count exceeded the illustrative cluster threshold.",
  },
  {
    id: "demo-004",
    category: "Historical Risk Change",
    severity: "Watch",
    status: "Active",
    location: "Illustrative area · Sierra Nevada",
    detectedAt: "2025-03-12",
    signal: "Demo risk indicator increased 18% from the previous sample period.",
  },
  {
    id: "demo-005",
    category: "Unusual Fire Activity",
    severity: "Moderate",
    status: "Resolved",
    location: "Illustrative area · Coastal California",
    detectedAt: "2025-03-09",
    signal: "Synthetic activity returned to the sample seasonal range.",
  },
  {
    id: "demo-006",
    category: "High Hotspot Concentration",
    severity: "Watch",
    status: "Resolved",
    location: "Illustrative area · Inland California",
    detectedAt: "2025-03-06",
    signal: "Illustrative cluster count fell below its demo threshold.",
  },
];
