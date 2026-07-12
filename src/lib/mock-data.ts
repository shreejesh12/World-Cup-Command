// Mock/demo datasets for StadiumOS AI. All values are simulated.

export const STADIUMS = [
  // The 16 official host venues for the FIFA World Cup 2026 (US / MX / CA).
  { id: "nynj", name: "MetLife Stadium (NY/NJ Stadium)", city: "New York / New Jersey", country: "US", capacity: 82500, attendance: 81420, incidents: 2, risk: "elevated" as const, host: "Final",       lat: 40.8135, lng: -74.0745 },
  { id: "sof",  name: "SoFi Stadium",                   city: "Los Angeles",           country: "US", capacity: 70240, attendance: 68990, incidents: 1, risk: "moderate" as const, host: "Group + KO",  lat: 33.9535, lng: -118.3392 },
  { id: "att",  name: "AT&T Stadium",                   city: "Dallas",                country: "US", capacity: 80000, attendance: 74210, incidents: 0, risk: "safe" as const,     host: "Semifinal",   lat: 32.7473, lng: -97.0945 },
  { id: "arr",  name: "Arrowhead Stadium",              city: "Kansas City",           country: "US", capacity: 76416, attendance: 60110, incidents: 3, risk: "critical" as const, host: "Group + KO",  lat: 39.0489, lng: -94.4839 },
  { id: "mbs",  name: "Mercedes-Benz Stadium",          city: "Atlanta",               country: "US", capacity: 71000, attendance: 66540, incidents: 1, risk: "moderate" as const, host: "Semifinal",   lat: 33.7554, lng: -84.4008 },
  { id: "nrg",  name: "NRG Stadium",                    city: "Houston",               country: "US", capacity: 72220, attendance: 65120, incidents: 0, risk: "safe" as const,     host: "Group + KO",  lat: 29.6847, lng: -95.4107 },
  { id: "hrd",  name: "Hard Rock Stadium",              city: "Miami",                 country: "US", capacity: 65326, attendance: 62110, incidents: 1, risk: "moderate" as const, host: "3rd Place",   lat: 25.9580, lng: -80.2389 },
  { id: "lin",  name: "Lincoln Financial Field",        city: "Philadelphia",          country: "US", capacity: 69796, attendance: 63400, incidents: 0, risk: "safe" as const,     host: "Group + KO",  lat: 39.9008, lng: -75.1675 },
  { id: "gil",  name: "Gillette Stadium",               city: "Boston",                country: "US", capacity: 65878, attendance: 61220, incidents: 0, risk: "safe" as const,     host: "Group + KO",  lat: 42.0909, lng: -71.2643 },
  { id: "lev",  name: "Levi's Stadium",                 city: "San Francisco Bay",     country: "US", capacity: 68500, attendance: 62890, incidents: 0, risk: "safe" as const,     host: "Group + KO",  lat: 37.4030, lng: -121.9700 },
  { id: "lum",  name: "Lumen Field",                    city: "Seattle",               country: "US", capacity: 68740, attendance: 60110, incidents: 0, risk: "safe" as const,     host: "Group + KO",  lat: 47.5952, lng: -122.3316 },
  { id: "azt",  name: "Estadio Azteca",                 city: "Mexico City",           country: "MX", capacity: 87000, attendance: 82340, incidents: 2, risk: "elevated" as const, host: "Opening",     lat: 19.3029, lng: -99.1505 },
  { id: "akr",  name: "Estadio Akron",                  city: "Guadalajara",           country: "MX", capacity: 49850, attendance: 47100, incidents: 1, risk: "moderate" as const, host: "Group",       lat: 20.6819, lng: -103.4626 },
  { id: "bbv",  name: "Estadio BBVA",                   city: "Monterrey",             country: "MX", capacity: 53500, attendance: 50210, incidents: 0, risk: "safe" as const,     host: "Group + R32", lat: 25.6692, lng: -100.2447 },
  { id: "bmo",  name: "BMO Field",                      city: "Toronto",               country: "CA", capacity: 45500, attendance: 41200, incidents: 0, risk: "safe" as const,     host: "Group",       lat: 43.6332, lng: -79.4185 },
  { id: "bcp",  name: "BC Place",                       city: "Vancouver",             country: "CA", capacity: 54500, attendance: 49880, incidents: 0, risk: "safe" as const,     host: "Group + R32", lat: 49.2768, lng: -123.1119 },
];

export interface Match {
  id: string;
  venueId: string;
  matchup: string;
  round: string;
  kickoff: string; // ISO
  status: "scheduled" | "delayed" | "rescheduled" | "live" | "final";
  note?: string;
}

// Simulated remaining fixtures across host venues (WC26 knockout window).
export const MATCH_SCHEDULE: Match[] = [
  { id: "M-FIN",  venueId: "nynj", matchup: "Final — TBD vs TBD",           round: "Final",       kickoff: "2026-07-19T21:00:00-04:00", status: "scheduled" },
  { id: "M-3RD",  venueId: "hrd",  matchup: "3rd Place — TBD vs TBD",       round: "3rd Place",   kickoff: "2026-07-18T15:00:00-04:00", status: "scheduled" },
  { id: "M-SF1",  venueId: "att",  matchup: "Semifinal 1 — TBD vs TBD",     round: "Semifinal",   kickoff: "2026-07-14T20:00:00-05:00", status: "delayed",     note: "Weather delay: +30 min" },
  { id: "M-SF2",  venueId: "mbs",  matchup: "Semifinal 2 — TBD vs TBD",     round: "Semifinal",   kickoff: "2026-07-15T20:00:00-04:00", status: "rescheduled", note: "Moved from 19:00 → 20:00 ET" },
  { id: "M-QF1",  venueId: "sof",  matchup: "Quarterfinal — TBD vs TBD",    round: "Quarterfinal", kickoff: "2026-07-11T17:00:00-07:00", status: "scheduled" },
  { id: "M-QF2",  venueId: "nrg",  matchup: "Quarterfinal — TBD vs TBD",    round: "Quarterfinal", kickoff: "2026-07-11T20:00:00-05:00", status: "scheduled" },
];

export const KPIS = {
  attendance: { value: 81420, capacity: 82500, delta: 2.4 },
  crowdDensity: { value: 0.72, delta: 0.04 },
  securityScore: { value: 94, delta: -1 },
  medicalReadiness: { value: 88, delta: 0 },
  activeAlerts: { value: 4, delta: 1 },
  weather: { temp: 26, condition: "Clear", wind: 9 },
};

export type Severity = "safe" | "info" | "warn" | "crit";

export interface Alert {
  id: string;
  ts: string;
  severity: Severity;
  zone: string;
  title: string;
  source: string;
}

export const ALERTS: Alert[] = [
  { id: "AL-1042", ts: "21:14:03", severity: "crit", zone: "Gate 4", title: "Crowd density > 0.92 sustained 3m", source: "CV+Sensor" },
  { id: "AL-1041", ts: "21:12:47", severity: "warn", zone: "Sector 7B", title: "Queue length exceeds threshold", source: "Ticket scans" },
  { id: "AL-1040", ts: "21:10:12", severity: "warn", zone: "Concourse N", title: "Medical response requested", source: "Volunteer" },
  { id: "AL-1039", ts: "21:04:58", severity: "info", zone: "Parking C", title: "Rideshare zone at 80% capacity", source: "Transport" },
  { id: "AL-1038", ts: "20:58:22", severity: "safe", zone: "Gate 6", title: "Gate opened, load balancing", source: "Ops" },
  { id: "AL-1037", ts: "20:52:04", severity: "info", zone: "Concessions E", title: "Water inventory below 30%", source: "F&B" },
];

export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  density: number; // 0-1
  status: Severity;
}

// Approx coords centered on MetLife Stadium (NY/NJ) — 2026 World Cup Final venue.
export const CENTER: [number, number] = [40.8135, -74.0745];

export const ZONES: Zone[] = [
  { id: "z1", name: "Gate A — North",   lat: 40.8145, lng: -74.0745, density: 0.55, status: "info" },
  { id: "z2", name: "Gate D — East",    lat: 40.8135, lng: -74.0730, density: 0.93, status: "crit" },
  { id: "z3", name: "Gate F — South",   lat: 40.8125, lng: -74.0745, density: 0.42, status: "safe" },
  { id: "z4", name: "Gate H — West",    lat: 40.8135, lng: -74.0760, density: 0.68, status: "info" },
  { id: "z5", name: "Sector 7B",        lat: 40.8140, lng: -74.0738, density: 0.81, status: "warn" },
  { id: "z6", name: "Concourse N",      lat: 40.8142, lng: -74.0745, density: 0.74, status: "warn" },
  { id: "z7", name: "Parking Lot C",    lat: 40.8115, lng: -74.0730, density: 0.62, status: "info" },
  { id: "z8", name: "Medical Bay A",    lat: 40.8130, lng: -74.0755, density: 0.20, status: "safe" },
];

export const DENSITY_FORECAST = Array.from({ length: 24 }, (_, i) => {
  const t = i;
  const base = 0.45 + Math.sin(i / 3) * 0.15 + i * 0.012;
  const actual = i < 12 ? Math.max(0.1, Math.min(0.95, base + (Math.random() - 0.5) * 0.05)) : null;
  const predicted = Math.max(0.1, Math.min(0.98, base + i * 0.008));
  return {
    t: `${20 + Math.floor(t / 4)}:${String((t % 4) * 15).padStart(2, "0")}`,
    actual,
    predicted,
    low: predicted - 0.06,
    high: predicted + 0.06,
  };
});

export interface Incident {
  id: string;
  ts: string;
  severity: Severity;
  title: string;
  zone: string;
  status: "open" | "responding" | "resolved";
  responders: string[];
  timeline: { ts: string; text: string }[];
}

export const INCIDENTS: Incident[] = [
  {
    id: "INC-2026-0042",
    ts: "21:14",
    severity: "crit",
    title: "Overcrowding — Gate 4 East",
    zone: "Gate 4",
    status: "responding",
    responders: ["Security Alpha-3", "Medical Unit 2", "Volunteer Lead K. Patel"],
    timeline: [
      { ts: "21:14:03", text: "CV threshold breach: density 0.93 sustained 3m" },
      { ts: "21:14:47", text: "Auto-notification sent to Security Ops" },
      { ts: "21:15:20", text: "Security Alpha-3 dispatched (ETA 90s)" },
      { ts: "21:15:55", text: "Gate 6 opened for load balancing" },
      { ts: "21:16:40", text: "Multilingual announcement drafted (EN/ES)" },
    ],
  },
  {
    id: "INC-2026-0041",
    ts: "21:10",
    severity: "warn",
    title: "Medical assistance — Concourse N",
    zone: "Concourse N",
    status: "responding",
    responders: ["Medical Unit 4"],
    timeline: [
      { ts: "21:10:12", text: "Volunteer triggered medical call" },
      { ts: "21:10:40", text: "Nearest ambulance dispatched (ETA 2m)" },
    ],
  },
  {
    id: "INC-2026-0040",
    ts: "20:41",
    severity: "info",
    title: "Restricted zone access — press gate",
    zone: "Press A",
    status: "resolved",
    responders: ["Security Bravo-1"],
    timeline: [
      { ts: "20:41:00", text: "Badge scan mismatch" },
      { ts: "20:42:11", text: "Cleared — press escort confirmed" },
    ],
  },
];

export const CV_EVENTS = [
  { id: "CV-9821", ts: "21:14:03", label: "High density", zone: "Gate 4", conf: 0.94 },
  { id: "CV-9820", ts: "21:11:22", label: "Fallen person", zone: "Concourse N", conf: 0.81 },
  { id: "CV-9819", ts: "21:04:44", label: "Unattended bag", zone: "Sector 3", conf: 0.73 },
  { id: "CV-9818", ts: "20:52:10", label: "Restricted access", zone: "Press A", conf: 0.88 },
  { id: "CV-9817", ts: "20:44:03", label: "High density", zone: "Gate 8", conf: 0.69 },
];

export const VOLUNTEERS = [
  { id: "V-101", name: "K. Patel", zone: "Gate 4", task: "Crowd guidance", skills: ["ES", "First-aid"], available: true },
  { id: "V-102", name: "M. Nguyen", zone: "Sector 7B", task: "Ticket assist", skills: ["EN", "VI"], available: true },
  { id: "V-103", name: "A. Silva", zone: "Concourse N", task: "Medical liaison", skills: ["PT", "First-aid"], available: false },
  { id: "V-104", name: "R. Okafor", zone: "Gate 1", task: "Wayfinding", skills: ["EN", "FR"], available: true },
  { id: "V-105", name: "S. Haddad", zone: "Parking C", task: "Traffic support", skills: ["AR", "EN"], available: true },
  { id: "V-106", name: "L. Chen", zone: "Medical Bay A", task: "Standby", skills: ["ZH", "EN", "First-aid"], available: true },
];

export const TRANSPORT = {
  parking: [
    { name: "Lot A", occ: 0.94 },
    { name: "Lot B", occ: 0.82 },
    { name: "Lot C", occ: 0.61 },
    { name: "Lot D", occ: 0.44 },
  ],
  transit: [
    { name: "Metro Line 2", load: 0.88, status: "warn" as Severity },
    { name: "Bus 108", load: 0.62, status: "info" as Severity },
    { name: "Rideshare Zone C", load: 0.80, status: "warn" as Severity },
    { name: "Bus 141", load: 0.34, status: "safe" as Severity },
  ],
};

export const FOOD_STALLS = [
  { id: "F-1", name: "Concessions N-01", zone: "Concourse N", water: 0.28, food: 0.61, queue: 8, status: "warn" as Severity },
  { id: "F-2", name: "Concessions E-04", zone: "Concourse E", water: 0.72, food: 0.55, queue: 3, status: "safe" as Severity },
  { id: "F-3", name: "Concessions S-02", zone: "Concourse S", water: 0.14, food: 0.32, queue: 12, status: "crit" as Severity },
  { id: "F-4", name: "Concessions W-03", zone: "Concourse W", water: 0.65, food: 0.71, queue: 5, status: "info" as Severity },
];

export const WASHROOMS = [
  { id: "W-1", name: "Restroom N-1", zone: "Concourse N", wait: 6, cleaning: "20:40", status: "info" as Severity },
  { id: "W-2", name: "Restroom E-2", zone: "Concourse E", wait: 2, cleaning: "20:55", status: "safe" as Severity },
  { id: "W-3", name: "Restroom S-1", zone: "Concourse S", wait: 11, cleaning: "20:20", status: "warn" as Severity },
  { id: "W-4", name: "Accessible W-1", zone: "Concourse W", wait: 1, cleaning: "21:00", status: "safe" as Severity },
];

export const SUSTAINABILITY = [
  { label: "Energy use", value: 62, unit: "% of baseline", delta: -8, progress: 0.62 },
  { label: "Water use", value: 74, unit: "% of baseline", delta: -3, progress: 0.74 },
  { label: "Waste diverted", value: 68, unit: "%", delta: 5, progress: 0.68 },
  { label: "Carbon estimate", value: 41, unit: "t CO₂e", delta: -12, progress: 0.55 },
];

export const ANOMALIES = [
  { id: "AN-01", ts: "21:12", title: "Gate 6 queue dropping unusually fast", zone: "Gate 6", why: "Scan rate down 60% vs. Matchday-2 baseline — possible turnstile fault." },
  { id: "AN-02", ts: "21:03", title: "Sector 3 density flat despite kickoff approach", zone: "Sector 3", why: "Expected +18% by T-30m; observed +2%. Possible blocked entrance." },
  { id: "AN-03", ts: "20:47", title: "Concessions S-02 sales spike +240%", zone: "Concourse S", why: "Water inventory dropped 3x faster than trend — restock trigger recommended." },
];

export const SHIFT_LOG = [
  { ts: "21:14", who: "System", text: "Critical overcrowding at Gate 4 — INC-2026-0042 opened." },
  { ts: "21:00", who: "Shift Lead R. Ortiz", text: "Kickoff. All gates green except 4 (elevated)." },
  { ts: "20:42", who: "System", text: "Restricted access resolved at Press A." },
  { ts: "20:15", who: "Shift Lead R. Ortiz", text: "Handoff from afternoon shift. 2 open items, 0 critical." },
  { ts: "19:58", who: "Medical Lead", text: "All medical bays staffed and stocked. First-aid drill complete." },
];

export const STAFFING_RECS = [
  { id: "SR-1", text: "Move 2 medical units to Sector 7B by 21:15", basis: "density trend +22%, forecast peak 21:22" },
  { id: "SR-2", text: "Open Gate 6 for 15 minutes to relieve Gate 4", basis: "Gate 4 density 0.93 sustained, Gate 6 at 0.42" },
  { id: "SR-3", text: "Assign 3 volunteers to Concourse N wayfinding", basis: "Queue length exceeds threshold at 21:12" },
];

// Extended datasets ---------------------------------------------------------

export const NEARBY_RESTAURANTS = [
  { id: "R-1", name: "Redd's Restaurant",         cuisine: "American",   distance: "0.3 mi", eta: "6 min walk",  rating: 4.4, price: "$$",  status: "safe"  as Severity, note: "Open · seats 120" },
  { id: "R-2", name: "Rutherford Pancake House",  cuisine: "Breakfast",  distance: "0.8 mi", eta: "4 min drive", rating: 4.6, price: "$",   status: "safe"  as Severity, note: "Open until 22:00" },
  { id: "R-3", name: "Park & Orchard",            cuisine: "Healthy",    distance: "1.2 mi", eta: "6 min drive", rating: 4.5, price: "$$",  status: "info"  as Severity, note: "Reservation recommended" },
  { id: "R-4", name: "Il Villaggio",              cuisine: "Italian",    distance: "1.6 mi", eta: "8 min drive", rating: 4.7, price: "$$$", status: "warn"  as Severity, note: "45 min wait" },
  { id: "R-5", name: "Segovia Steakhouse",        cuisine: "Spanish BBQ", distance: "2.1 mi", eta: "9 min drive", rating: 4.6, price: "$$$", status: "info"  as Severity, note: "Full bar" },
];

export const DELIVERY_PARTNERS = [
  { id: "D-1", name: "Uber Eats",  eta: "18–28 min", surge: 1.3, status: "warn" as Severity, note: "Surge · matchday demand" },
  { id: "D-2", name: "DoorDash",   eta: "22–35 min", surge: 1.4, status: "warn" as Severity, note: "Limited couriers within 2 mi" },
  { id: "D-3", name: "Grubhub",    eta: "30–45 min", surge: 1.1, status: "info" as Severity, note: "Concourse pickup lockers" },
  { id: "D-4", name: "StadiumEats (in-seat)", eta: "9–14 min", surge: 1.0, status: "safe" as Severity, note: "Runners active · Sections 100–140" },
];

export const SEATING_SECTIONS = [
  { id: "S-100", label: "Lower 100s",   capacity: 26000, occupied: 25610, status: "warn" as Severity },
  { id: "S-200", label: "Club 200s",    capacity:  9500, occupied:  9100, status: "warn" as Severity },
  { id: "S-300", label: "Mezz 300s",    capacity: 12500, occupied: 12010, status: "info" as Severity },
  { id: "S-400", label: "Upper 400s",   capacity: 30000, occupied: 28020, status: "info" as Severity },
  { id: "S-VIP", label: "Suites / VIP", capacity:  2000, occupied:  1780, status: "safe" as Severity },
  { id: "S-ADA", label: "Accessible",   capacity:  1000, occupied:   900, status: "safe" as Severity },
];

export const ROAD_CLOSURES = [
  { id: "RC-1", road: "NJ-120 EB (Stadium approach)", from: "18:00", to: "23:59", status: "warn" as Severity },
  { id: "RC-2", road: "Route 3 Service Rd", from: "19:00", to: "23:30", status: "info" as Severity },
  { id: "RC-3", road: "Paterson Plank Rd", from: "20:30", to: "23:30", status: "info" as Severity },
];

export const SHUTTLES = [
  { id: "SH-1", route: "Secaucus Jct → Gate H",  headway: "6 min",  load: 0.82, status: "warn" as Severity },
  { id: "SH-2", route: "NY Port Auth → Gate A",  headway: "12 min", load: 0.71, status: "info" as Severity },
  { id: "SH-3", route: "Newark Penn → Gate D",   headway: "10 min", load: 0.55, status: "safe" as Severity },
  { id: "SH-4", route: "Fan Fest → Gate F",      headway: "8 min",  load: 0.63, status: "info" as Severity },
];

export const EGRESS_TIMELINE = [
  { t: "22:45", flow: 0.10, note: "Full-time whistle" },
  { t: "22:52", flow: 0.42, note: "Concourses filling" },
  { t: "23:00", flow: 0.78, note: "Peak egress" },
  { t: "23:10", flow: 0.66, note: "Transit saturation" },
  { t: "23:20", flow: 0.34, note: "Lots draining" },
  { t: "23:35", flow: 0.12, note: "Cleared" },
];

// Volunteer avatar — DiceBear is a lightweight, free avatar service.
function vAvatar(seed: string) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;
}

export interface VolunteerDetail {
  id: string;
  name: string;
  role: string;
  zone: string;
  task: string;
  skills: string[];
  languages: string[];
  available: boolean;
  phone: string;
  shiftStart: string;
  shiftEnd: string;
  hoursThisWeek: number;
  rating: number;
  photo: string;
}

export const VOLUNTEERS_FULL: VolunteerDetail[] = [
  { id: "V-101", name: "Kavya Patel",    role: "Lead Marshal",    zone: "Gate 4",         task: "Crowd guidance",     skills: ["First-aid", "Radio"],   languages: ["EN", "ES", "HI"], available: true,  phone: "+1 (201) 555-0142", shiftStart: "17:30", shiftEnd: "23:30", hoursThisWeek: 28, rating: 4.9, photo: vAvatar("kavya-patel") },
  { id: "V-102", name: "Minh Nguyen",    role: "Ticketing",       zone: "Sector 7B",      task: "Ticket assist",      skills: ["Ticket Ops"],           languages: ["EN", "VI"],       available: true,  phone: "+1 (201) 555-0193", shiftStart: "18:00", shiftEnd: "23:00", hoursThisWeek: 22, rating: 4.7, photo: vAvatar("minh-nguyen") },
  { id: "V-103", name: "Ana Silva",      role: "Medical Liaison", zone: "Concourse N",    task: "Medical support",    skills: ["First-aid", "EMR"],     languages: ["EN", "PT", "ES"], available: false, phone: "+1 (201) 555-0110", shiftStart: "16:00", shiftEnd: "22:00", hoursThisWeek: 30, rating: 4.8, photo: vAvatar("ana-silva") },
  { id: "V-104", name: "Rufus Okafor",   role: "Wayfinder",       zone: "Gate 1",         task: "Wayfinding",         skills: ["Signage", "Radio"],     languages: ["EN", "FR", "YO"], available: true,  phone: "+1 (201) 555-0176", shiftStart: "17:00", shiftEnd: "23:00", hoursThisWeek: 24, rating: 4.6, photo: vAvatar("rufus-okafor") },
  { id: "V-105", name: "Salma Haddad",   role: "Traffic Marshal", zone: "Parking C",      task: "Traffic support",    skills: ["Traffic", "Radio"],     languages: ["EN", "AR", "FR"], available: true,  phone: "+1 (201) 555-0198", shiftStart: "16:30", shiftEnd: "22:30", hoursThisWeek: 26, rating: 4.8, photo: vAvatar("salma-haddad") },
  { id: "V-106", name: "Li Chen",        role: "Medical Standby", zone: "Medical Bay A",  task: "Standby",            skills: ["First-aid"],            languages: ["EN", "ZH"],       available: true,  phone: "+1 (201) 555-0121", shiftStart: "18:00", shiftEnd: "23:59", hoursThisWeek: 18, rating: 4.9, photo: vAvatar("li-chen") },
  { id: "V-107", name: "Diego Ramirez",  role: "Fan Services",    zone: "Concourse E",    task: "Fan info booth",     skills: ["Hospitality"],          languages: ["EN", "ES"],       available: true,  phone: "+1 (201) 555-0155", shiftStart: "17:00", shiftEnd: "22:30", hoursThisWeek: 20, rating: 4.7, photo: vAvatar("diego-ramirez") },
  { id: "V-108", name: "Yuki Tanaka",    role: "Accessibility",   zone: "Accessible W-1", task: "Accessibility aid",  skills: ["ASL", "First-aid"],     languages: ["EN", "JA"],       available: true,  phone: "+1 (201) 555-0167", shiftStart: "17:30", shiftEnd: "23:00", hoursThisWeek: 25, rating: 5.0, photo: vAvatar("yuki-tanaka") },
];

// Security ------------------------------------------------------------------

export const SECURITY_UNITS = [
  { id: "SEC-01", callsign: "Alpha-1", zone: "Gate A / North",  members: 4, status: "safe" as Severity, activity: "Patrolling perimeter" },
  { id: "SEC-02", callsign: "Alpha-3", zone: "Gate 4 East",     members: 6, status: "crit" as Severity, activity: "Responding INC-2026-0042" },
  { id: "SEC-03", callsign: "Bravo-1", zone: "Press A",         members: 3, status: "safe" as Severity, activity: "Access control" },
  { id: "SEC-04", callsign: "Bravo-2", zone: "Sector 7B",       members: 4, status: "warn" as Severity, activity: "Queue management" },
  { id: "SEC-05", callsign: "K9-2",    zone: "VIP Lot",         members: 2, status: "safe" as Severity, activity: "K9 sweep · complete" },
  { id: "SEC-06", callsign: "Delta-1", zone: "Command Ops",     members: 5, status: "info" as Severity, activity: "Ops standby" },
];

export const CAMERAS = [
  { id: "CAM-01", zone: "Gate A · Turnstiles",  online: true,  ai: "Density"     },
  { id: "CAM-02", zone: "Gate 4 · East",         online: true,  ai: "Density+Face" },
  { id: "CAM-03", zone: "Concourse N",           online: true,  ai: "Fallen-person" },
  { id: "CAM-04", zone: "Sector 7B · Vom",       online: true,  ai: "Queue"       },
  { id: "CAM-05", zone: "Press A · Corridor",    online: true,  ai: "Restricted"  },
  { id: "CAM-06", zone: "Parking Lot C",         online: true,  ai: "Plate"       },
  { id: "CAM-07", zone: "Medical Bay A",         online: false, ai: "—"           },
  { id: "CAM-08", zone: "Loading Dock",          online: true,  ai: "Object"      },
  { id: "CAM-09", zone: "Rooftop North",         online: true,  ai: "Drone"       },
];

// Stadium detail (per venue) ------------------------------------------------

export interface StadiumDetail {
  id: string;
  yearOpened: number;
  surface: string;
  roof: string;
  architect: string;
  homeTeams: string[];
  address: string;
  about: string;
  images: string[];
}

// source.unsplash.com was deprecated. Use picsum.photos with a stable seed
// so each venue gets consistent, real photos that actually load.
function venueImg(seed: string, sig: number) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}-${sig}/1200/800`;
}
const unsplash = venueImg;

export const STADIUM_DETAILS: Record<string, StadiumDetail> = {
  nynj: {
    id: "nynj", yearOpened: 2010, surface: "Grass (converted from turf for WC26)", roof: "Open", architect: "360 Architecture",
    homeTeams: ["New York Giants", "New York Jets"], address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
    about: "MetLife Stadium hosts the 2026 FIFA World Cup Final. It is the largest venue in the tournament by hospitality footprint and features a fully re-sodded natural grass surface for the knockout stage.",
    images: [unsplash("stadium,football,night", 11), unsplash("soccer,stadium,crowd", 12), unsplash("stadium,aerial", 13)],
  },
  sof: {
    id: "sof", yearOpened: 2020, surface: "Grass", roof: "Fixed translucent canopy", architect: "HKS",
    homeTeams: ["Los Angeles Rams", "Los Angeles Chargers"], address: "1001 Stadium Dr, Inglewood, CA 90301",
    about: "SoFi Stadium is a state-of-the-art venue with a signature Infinity Screen. It hosts a full group-stage slate and knockout rounds for WC26.",
    images: [unsplash("sofi,stadium,los-angeles", 21), unsplash("stadium,modern,architecture", 22), unsplash("stadium,soccer", 23)],
  },
  att: {
    id: "att", yearOpened: 2009, surface: "Grass", roof: "Retractable", architect: "HKS",
    homeTeams: ["Dallas Cowboys"], address: "1 AT&T Way, Arlington, TX 76011",
    about: "AT&T Stadium hosts a WC26 semifinal. The retractable roof and enormous center-hung video board make it one of the tournament's marquee venues.",
    images: [unsplash("att,stadium,dallas", 31), unsplash("stadium,dome", 32), unsplash("football,stadium,texas", 33)],
  },
  arr: {
    id: "arr", yearOpened: 1972, surface: "Grass", roof: "Open", architect: "Kivett & Myers",
    homeTeams: ["Kansas City Chiefs"], address: "1 Arrowhead Dr, Kansas City, MO 64129",
    about: "Arrowhead is famous for its atmosphere and record-setting crowd noise. WC26 uses it for group matches and a Round of 16.",
    images: [unsplash("arrowhead,stadium", 41), unsplash("stadium,crowd,red", 42), unsplash("stadium,tailgate", 43)],
  },
  mbs: {
    id: "mbs", yearOpened: 2017, surface: "Grass", roof: "Retractable oculus", architect: "HOK",
    homeTeams: ["Atlanta Falcons", "Atlanta United"], address: "1 AMB Dr NW, Atlanta, GA 30313",
    about: "Mercedes-Benz Stadium hosts a WC26 semifinal. Its retractable pinwheel roof and halo board are unique in world sport.",
    images: [unsplash("mercedes-benz,stadium,atlanta", 51), unsplash("stadium,roof,architecture", 52), unsplash("soccer,pitch", 53)],
  },
  nrg: {
    id: "nrg", yearOpened: 2002, surface: "Grass", roof: "Retractable", architect: "HOK Sport",
    homeTeams: ["Houston Texans"], address: "NRG Pkwy, Houston, TX 77054",
    about: "NRG Stadium in Houston hosts group matches and a Round of 16 with its climate-controlled retractable roof.",
    images: [unsplash("nrg,stadium,houston", 61), unsplash("stadium,texas", 62), unsplash("stadium,football", 63)],
  },
  hrd: {
    id: "hrd", yearOpened: 1987, surface: "Grass", roof: "Open (canopy)", architect: "HOK",
    homeTeams: ["Miami Dolphins", "Miami Hurricanes"], address: "347 Don Shula Dr, Miami Gardens, FL 33056",
    about: "Hard Rock Stadium hosts the WC26 3rd-place match. Its shaded canopy is critical for daytime Miami kickoffs.",
    images: [unsplash("hard-rock,stadium,miami", 71), unsplash("stadium,florida", 72), unsplash("miami,soccer", 73)],
  },
  lin: {
    id: "lin", yearOpened: 2003, surface: "Grass", roof: "Open", architect: "NBBJ",
    homeTeams: ["Philadelphia Eagles"], address: "1 Lincoln Financial Field Way, Philadelphia, PA 19148",
    about: "Lincoln Financial Field hosts WC26 group and knockout matches. Deep in the South Philadelphia Sports Complex.",
    images: [unsplash("lincoln-financial,stadium", 81), unsplash("philadelphia,stadium", 82), unsplash("stadium,eagle", 83)],
  },
  gil: {
    id: "gil", yearOpened: 2002, surface: "Grass", roof: "Open", architect: "HOK",
    homeTeams: ["New England Patriots", "New England Revolution"], address: "1 Patriot Pl, Foxborough, MA 02035",
    about: "Gillette Stadium hosts group and knockout WC26 matches. Located in Foxborough with its Patriot Place complex.",
    images: [unsplash("gillette,stadium,boston", 91), unsplash("new-england,stadium", 92), unsplash("stadium,fall", 93)],
  },
  lev: {
    id: "lev", yearOpened: 2014, surface: "Grass", roof: "Open (solar canopy)", architect: "HNTB",
    homeTeams: ["San Francisco 49ers"], address: "4900 Marie P. DeBartolo Way, Santa Clara, CA 95054",
    about: "Levi's Stadium is a LEED Gold venue with a solar canopy, hosting WC26 group and knockout matches.",
    images: [unsplash("levis,stadium,bay-area", 101), unsplash("stadium,solar", 102), unsplash("santa-clara,stadium", 103)],
  },
  lum: {
    id: "lum", yearOpened: 2002, surface: "Grass (converted)", roof: "Partial", architect: "Ellerbe Becket",
    homeTeams: ["Seattle Seahawks", "Seattle Sounders FC"], address: "800 Occidental Ave S, Seattle, WA 98134",
    about: "Lumen Field, home of the Sounders, is renowned for atmosphere. WC26 uses it for group and knockout rounds.",
    images: [unsplash("lumen,stadium,seattle", 111), unsplash("seattle,sounders", 112), unsplash("stadium,rain", 113)],
  },
  azt: {
    id: "azt", yearOpened: 1966, surface: "Grass", roof: "Open", architect: "Ramírez Vázquez",
    homeTeams: ["Club América", "Mexico NT"], address: "Calz. de Tlalpan 3465, Coyoacán, CDMX",
    about: "Estadio Azteca hosts the 2026 opening match, becoming the first stadium to host matches at three World Cups.",
    images: [unsplash("azteca,stadium,mexico", 121), unsplash("mexico-city,stadium", 122), unsplash("estadio,azteca", 123)],
  },
  akr: {
    id: "akr", yearOpened: 2010, surface: "Grass", roof: "Open (undulating canopy)", architect: "VFO Architects",
    homeTeams: ["Chivas de Guadalajara"], address: "Av. Chivas Torres, Zapopan, Jalisco",
    about: "Estadio Akron, home of Chivas, is a distinctive volcanic-inspired venue hosting WC26 group matches.",
    images: [unsplash("akron,stadium,guadalajara", 131), unsplash("chivas,stadium", 132), unsplash("mexico,soccer", 133)],
  },
  bbv: {
    id: "bbv", yearOpened: 2015, surface: "Grass", roof: "Open (asymmetric canopy)", architect: "Populous",
    homeTeams: ["Monterrey (Rayados)"], address: "Av. Pablo Livas 2011, Guadalupe, Nuevo León",
    about: "Estadio BBVA in Monterrey ('El Gigante de Acero') hosts WC26 group and a Round of 32 match.",
    images: [unsplash("bbva,stadium,monterrey", 141), unsplash("monterrey,estadio", 142), unsplash("mexico,stadium", 143)],
  },
  bmo: {
    id: "bmo", yearOpened: 2007, surface: "Grass", roof: "Open", architect: "Populous",
    homeTeams: ["Toronto FC", "Toronto Argonauts"], address: "170 Princes' Blvd, Toronto, ON M6K 3C3",
    about: "BMO Field is being expanded for WC26 and hosts group-stage matches on Toronto's waterfront.",
    images: [unsplash("bmo,field,toronto", 151), unsplash("toronto,stadium", 152), unsplash("canada,soccer", 153)],
  },
  bcp: {
    id: "bcp", yearOpened: 1983, surface: "Grass (over turf)", roof: "Retractable", architect: "Studio Phillips Barratt",
    homeTeams: ["Vancouver Whitecaps FC", "BC Lions"], address: "777 Pacific Blvd, Vancouver, BC V6B 4Y8",
    about: "BC Place features a retractable roof and hosts group and Round of 32 matches for WC26.",
    images: [unsplash("bc-place,vancouver", 161), unsplash("vancouver,stadium", 162), unsplash("canada,stadium,roof", 163)],
  },
};

export const DATA_SOURCES = [
  { name: "Gate CCTV (Zone 1-4)", status: "safe" as Severity, note: "Online" },
  { name: "Gate CCTV (Zone 4)", status: "warn" as Severity, note: "Frame drop 4%" },
  { name: "Density sensors (concourse)", status: "safe" as Severity, note: "Online" },
  { name: "Weather feed", status: "safe" as Severity, note: "Online" },
  { name: "Ticket scanner Gate 4-B", status: "crit" as Severity, note: "Offline 3 min — stale data" },
  { name: "Transit API", status: "info" as Severity, note: "Degraded, using cache" },
];

export const ATTENDANCE_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  match: `M${i + 1}`,
  attendance: 55000 + Math.floor(Math.random() * 30000),
  incidents: Math.floor(Math.random() * 5),
}));