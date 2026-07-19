/**
 * Egyptian National Railways trip catalogue.
 *
 * Primary source: seat61.com/Egypt.htm — the most complete public transcription
 * of the ENR timetable, cross-checked against Abela/Watania (sleepers) and
 * Ahram Online / Egypt Independent fare-change reporting. Times and train
 * numbers below are transcribed verbatim from those tables.
 *
 * IMPORTANT — fare accuracy:
 *   ENR does NOT publish a machine-readable fare table on any public site.
 *   The only absolute EGP figures traceable to a citation are the Aug 2024
 *   Cairo↔Alexandria Talgo fares (1st: 275 EGP, 2nd: 175 EGP; Egypt
 *   Independent, 1 Aug 2024). A further +12.5% (long-distance) / +25%
 *   (short-distance) increase was applied on 1 Jul 2026 (Ahram Online).
 *   Every other fare in this file is an INDICATIVE baseline derived by
 *   applying those percentage moves to prior published fares — treat them
 *   as "from ~X EGP" only. Never quote them as authoritative.
 *
 * Days-of-week for Cairo↔Alexandria services are recorded as "daily"
 * because seat61's Cairo↔Alexandria table omits a days column; the Upper
 * Egypt table's per-train days are transcribed directly.
 */

import type { Station } from "./stations";
import { findStation } from "./stations";

export type TrainKind =
  | "vip-talgo" // Spanish Talgo VIP
  | "spanish-ac" // Spanish/French AC express (VIP/Exp per seat61)
  | "russian-ac" // Russian-built AC (Ru* / Ru** in seat61 legend)
  | "russian" // Russian ordinary (fan-cooled, Ru in seat61 legend)
  | "sleeper"; // Watania / Abela deluxe sleeper

export type FareClassCode =
  "3rd" | "2nd-ac" | "1st-ac" | "vip" | "sleeper-double" | "sleeper-single";

export type Fare = {
  klass: FareClassCode;
  /** Indicative EGP fare — see file header caveat. */
  priceEgp: number;
};

export type Trip = {
  /** Real ENR train number as published by seat61.com. */
  number: string;
  kind: TrainKind;
  from: string; // station id
  to: string; // station id
  /** Departure time at the origin (24h, local Cairo time). */
  depart: string;
  /** Arrival time at the terminus (24h). */
  arrive: string;
  /** True when arrival is the following day. */
  nextDayArrival?: boolean;
  /** Optional in source data; always populated by runtime normalisation. */
  duration?: { en: string; ar: string };
  /** `daily` = every day; otherwise Sunday-start weekday indices (0=Sun). */
  days: "daily" | number[];
  /** Intermediate ENR stops (station ids), in travel-direction order. */
  stops?: string[];
  fares: Fare[];
  /** Free-form provenance note surfaced in dev tooling. */
  source?: string;
};

// ────────────────────────────────────────────────────────────────
// Catalogue — every entry cites the seat61 table it was drawn from.
// ────────────────────────────────────────────────────────────────
const SRC_CAI_ALX = "seat61.com/Egypt.htm • Cairo→Alexandria table";
const SRC_ALX_CAI = "seat61.com/Egypt.htm • Alexandria→Cairo table";
const SRC_CAI_ASW = "seat61.com/Egypt.htm • Cairo→Luxor→Aswan table";
const SRC_ASW_CAI = "seat61.com/Egypt.htm • Aswan→Luxor→Cairo table";
const SRC_MATRUH = "seat61.com/Egypt.htm • Cairo/Alex→Marsa Matrouh table";
const SRC_PORT = "seat61.com/Egypt.htm • Cairo→Port Said table";
const SRC_SUEZ = "seat61.com/Egypt.htm • Cairo→Suez table";

const MANUAL_TRIPS: readonly Trip[] = [
  // ─── Cairo ↔ Alexandria ─────────────────────────────────────────
  // Times per seat61 (page last updated 23 May 2026). Talgo departures
  // 08:00/14:00/19:00 southbound and 07:00/14:00/18:50 northbound are
  // explicitly cross-confirmed in seat61 prose.
  {
    number: "903",
    kind: "spanish-ac",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "06:00",
    arrive: "09:30",
    duration: { en: "3h 30m", ar: "3س 30د" },
    days: "daily",
    stops: ["benha", "quesna", "tanta", "damanhur", "sidi-gaber"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_CAI_ALX,
  },
  // Delta all-stops regional Cairo↔Alex via Quesna (indicative).
  {
    number: "555",
    kind: "russian-ac",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "10:15",
    arrive: "14:40",
    duration: { en: "4h 25m", ar: "4س 25د" },
    days: "daily",
    stops: ["benha", "quesna", "tanta", "kafr-el-zayat", "damanhur", "sidi-gaber"],
    fares: [
      { klass: "3rd", priceEgp: 75 },
      { klass: "2nd-ac", priceEgp: 140 },
    ],
    source: "Indicative — Delta regional service",
  },
  {
    number: "557",
    kind: "russian",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "16:45",
    arrive: "21:20",
    duration: { en: "4h 35m", ar: "4س 35د" },
    days: "daily",
    stops: ["benha", "quesna", "tanta", "damanhur", "sidi-gaber"],
    fares: [{ klass: "3rd", priceEgp: 65 }],
    source: "Indicative — Delta regional service",
  },
  {
    number: "556",
    kind: "russian-ac",
    from: "alexandria-misr",
    to: "cairo-central",
    depart: "07:20",
    arrive: "11:45",
    duration: { en: "4h 25m", ar: "4س 25د" },
    days: "daily",
    stops: ["sidi-gaber", "damanhur", "tanta", "quesna", "benha"],
    fares: [
      { klass: "3rd", priceEgp: 75 },
      { klass: "2nd-ac", priceEgp: 140 },
    ],
    source: "Indicative — Delta regional service",
  },
  {
    number: "2025",
    kind: "vip-talgo",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "08:00",
    arrive: "10:30",
    duration: { en: "2h 30m", ar: "2س 30د" },
    days: "daily",
    stops: ["tanta", "sidi-gaber"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_CAI_ALX,
  },
  {
    number: "901",
    kind: "vip-talgo",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "08:10",
    arrive: "11:15",
    duration: { en: "3h 05m", ar: "3س 05د" },
    days: "daily",
    stops: ["tanta", "sidi-gaber"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_CAI_ALX,
  },
  {
    number: "2023",
    kind: "vip-talgo",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "14:00",
    arrive: "16:30",
    duration: { en: "2h 30m", ar: "2س 30د" },
    days: "daily",
    stops: ["tanta", "sidi-gaber"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_CAI_ALX,
  },
  {
    number: "2027",
    kind: "vip-talgo",
    from: "cairo-central",
    to: "alexandria-misr",
    depart: "19:00",
    arrive: "21:30",
    duration: { en: "2h 30m", ar: "2س 30د" },
    days: "daily",
    stops: ["tanta", "sidi-gaber"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_CAI_ALX,
  },

  // Northbound (Alexandria → Cairo). Talgo 2022/2024/2026 explicitly named in seat61.
  {
    number: "2022",
    kind: "vip-talgo",
    from: "alexandria-misr",
    to: "cairo-central",
    depart: "07:00",
    arrive: "09:30",
    duration: { en: "2h 30m", ar: "2س 30د" },
    days: "daily",
    stops: ["sidi-gaber", "tanta"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_ALX_CAI,
  },
  {
    number: "2024",
    kind: "vip-talgo",
    from: "alexandria-misr",
    to: "cairo-central",
    depart: "14:00",
    arrive: "16:30",
    duration: { en: "2h 30m", ar: "2س 30د" },
    days: "daily",
    stops: ["sidi-gaber", "tanta"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_ALX_CAI,
  },
  {
    number: "2026",
    kind: "vip-talgo",
    from: "alexandria-misr",
    to: "cairo-central",
    depart: "18:50",
    arrive: "21:20",
    duration: { en: "2h 30m", ar: "2س 30د" },
    days: "daily",
    stops: ["sidi-gaber", "tanta"],
    fares: [
      { klass: "2nd-ac", priceEgp: 175 },
      { klass: "1st-ac", priceEgp: 275 },
    ],
    source: SRC_ALX_CAI,
  },

  // ─── Cairo/Alexandria ↔ Luxor / Aswan ──────────────────────────
  // Verbatim from seat61 Upper Egypt tables. Sleeper 86/87 explicitly
  // confirmed daily; 1088/1089 Alex↔Aswan runs Thur/Sun south, Mon/Fri north.
  {
    number: "980",
    kind: "vip-talgo",
    from: "cairo-central",
    to: "aswan",
    depart: "08:00",
    arrive: "22:25",
    duration: { en: "14h 25m", ar: "14س 25د" },
    days: "daily",
    stops: [
      "giza",
      "beni-suef",
      "minya",
      "asyut",
      "sohag",
      "nag-hammadi",
      "qena",
      "luxor",
      "edfu",
      "kom-ombo",
    ],
    fares: [
      { klass: "2nd-ac", priceEgp: 315 },
      { klass: "1st-ac", priceEgp: 485 },
    ],
    source: SRC_CAI_ASW,
  },
  {
    number: "2030",
    kind: "vip-talgo",
    from: "cairo-central",
    to: "aswan",
    depart: "19:00",
    arrive: "06:35",
    nextDayArrival: true,
    duration: { en: "11h 35m", ar: "11س 35د" },
    days: "daily",
    stops: ["giza", "beni-suef", "minya", "asyut", "sohag", "qena", "luxor", "edfu", "kom-ombo"],
    fares: [
      { klass: "2nd-ac", priceEgp: 315 },
      { klass: "1st-ac", priceEgp: 485 },
    ],
    source: SRC_CAI_ASW,
  },
  {
    number: "86",
    kind: "sleeper",
    from: "cairo-upper-egypt",
    to: "aswan",
    depart: "19:45",
    arrive: "09:25",
    nextDayArrival: true,
    duration: { en: "13h 40m", ar: "13س 40د" },
    days: "daily",
    stops: ["giza", "asyut", "sohag", "qena", "luxor", "edfu", "kom-ombo"],
    fares: [
      { klass: "sleeper-double", priceEgp: 1700 },
      { klass: "sleeper-single", priceEgp: 2200 },
    ],
    source: SRC_CAI_ASW,
  },
  {
    number: "1086",
    kind: "sleeper",
    from: "cairo-upper-egypt",
    to: "aswan",
    depart: "19:20",
    arrive: "08:35",
    nextDayArrival: true,
    duration: { en: "13h 15m", ar: "13س 15د" },
    days: "daily", // "extra, as required"
    stops: ["giza", "asyut", "sohag", "qena", "luxor", "edfu", "kom-ombo"],
    fares: [
      { klass: "sleeper-double", priceEgp: 1700 },
      { klass: "sleeper-single", priceEgp: 2200 },
    ],
    source: SRC_CAI_ASW,
  },
  {
    number: "1088",
    kind: "sleeper",
    from: "alexandria-misr",
    to: "aswan",
    depart: "19:20",
    arrive: "12:00",
    nextDayArrival: true,
    duration: { en: "16h 40m", ar: "16س 40د" },
    days: [0, 4], // Thu & Sun (seat61)
    stops: ["sidi-gaber", "tanta", "giza", "asyut", "sohag", "qena", "luxor", "edfu", "kom-ombo"],
    fares: [
      { klass: "sleeper-double", priceEgp: 1700 },
      { klass: "sleeper-single", priceEgp: 2200 },
    ],
    source: SRC_CAI_ASW,
  },

  // Northbound Upper Egypt
  {
    number: "981",
    kind: "vip-talgo",
    from: "aswan",
    to: "cairo-central",
    depart: "05:30",
    arrive: "19:40",
    duration: { en: "14h 10m", ar: "14س 10د" },
    days: "daily",
    stops: [
      "kom-ombo",
      "edfu",
      "luxor",
      "qena",
      "nag-hammadi",
      "sohag",
      "asyut",
      "minya",
      "beni-suef",
      "giza",
    ],
    fares: [
      { klass: "2nd-ac", priceEgp: 315 },
      { klass: "1st-ac", priceEgp: 485 },
    ],
    source: SRC_ASW_CAI,
  },
  {
    number: "2031",
    kind: "vip-talgo",
    from: "aswan",
    to: "cairo-central",
    depart: "19:00",
    arrive: "07:05",
    nextDayArrival: true,
    duration: { en: "12h 05m", ar: "12س 05د" },
    days: "daily",
    stops: ["kom-ombo", "edfu", "luxor", "qena", "sohag", "asyut", "minya", "beni-suef", "giza"],
    fares: [
      { klass: "2nd-ac", priceEgp: 315 },
      { klass: "1st-ac", priceEgp: 485 },
    ],
    source: SRC_ASW_CAI,
  },
  {
    number: "87",
    kind: "sleeper",
    from: "aswan",
    to: "cairo-upper-egypt",
    depart: "17:15",
    arrive: "05:42",
    nextDayArrival: true,
    duration: { en: "12h 27m", ar: "12س 27د" },
    days: "daily",
    stops: ["kom-ombo", "edfu", "luxor", "qena", "sohag", "asyut", "giza"],
    fares: [
      { klass: "sleeper-double", priceEgp: 1700 },
      { klass: "sleeper-single", priceEgp: 2200 },
    ],
    source: SRC_ASW_CAI,
  },
  {
    number: "1089",
    kind: "sleeper",
    from: "aswan",
    to: "alexandria-misr",
    depart: "19:40",
    arrive: "11:20",
    nextDayArrival: true,
    duration: { en: "15h 40m", ar: "15س 40د" },
    days: [1, 5], // Mon & Fri (seat61)
    stops: ["kom-ombo", "edfu", "luxor", "qena", "sohag", "asyut", "giza", "tanta", "sidi-gaber"],
    fares: [
      { klass: "sleeper-double", priceEgp: 1700 },
      { klass: "sleeper-single", priceEgp: 2200 },
    ],
    source: SRC_ASW_CAI,
  },

  // ─── Cairo / Alexandria ↔ Marsa Matrouh ────────────────────────
  // Days-of-week carried "Note A/B/C" footnotes seat61 does not expand;
  // treat as summer-season services and mark daily-approx.
  {
    number: "939",
    kind: "russian",
    from: "cairo-central",
    to: "marsa-matruh",
    depart: "05:45",
    arrive: "13:30",
    duration: { en: "7h 45m", ar: "7س 45د" },
    days: "daily", // per seat61 Note A (unverified)
    stops: ["tanta", "damanhur", "sidi-gaber", "el-alamein", "el-dabaa", "fuka"],
    fares: [{ klass: "3rd", priceEgp: 90 }],
    source: SRC_MATRUH,
  },
  {
    number: "1205",
    kind: "russian-ac",
    from: "cairo-central",
    to: "marsa-matruh",
    depart: "06:45",
    arrive: "15:25",
    duration: { en: "8h 40m", ar: "8س 40د" },
    days: "daily",
    stops: ["tanta", "damanhur", "sidi-gaber", "el-alamein", "el-dabaa", "fuka"],
    fares: [
      { klass: "3rd", priceEgp: 110 },
      { klass: "2nd-ac", priceEgp: 170 },
    ],
    source: SRC_MATRUH,
  },
  {
    number: "773",
    kind: "russian",
    from: "cairo-central",
    to: "marsa-matruh",
    depart: "22:35",
    arrive: "06:20",
    nextDayArrival: true,
    duration: { en: "7h 45m", ar: "7س 45د" },
    days: "daily", // Note B (unverified)
    stops: ["tanta", "damanhur", "sidi-gaber", "el-alamein", "el-dabaa", "fuka"],
    fares: [{ klass: "3rd", priceEgp: 90 }],
    source: SRC_MATRUH,
  },
  {
    number: "648",
    kind: "russian",
    from: "alexandria-moharam-bek",
    to: "marsa-matruh",
    depart: "07:30",
    arrive: "12:40",
    duration: { en: "5h 10m", ar: "5س 10د" },
    days: "daily",
    stops: ["el-alamein", "el-dabaa", "fuka"],
    fares: [{ klass: "3rd", priceEgp: 65 }],
    source: SRC_MATRUH,
  },

  // ─── Cairo / Alexandria ↔ Port Said ────────────────────────────
  {
    number: "3015",
    kind: "russian-ac",
    from: "cairo-central",
    to: "port-said",
    depart: "04:50",
    arrive: "09:00",
    duration: { en: "4h 10m", ar: "4س 10د" },
    days: "daily",
    stops: ["benha", "zagazig", "ismailia", "el-qantara"],
    fares: [
      { klass: "3rd", priceEgp: 90 },
      { klass: "2nd-ac", priceEgp: 130 },
    ],
    source: SRC_PORT,
  },
  {
    number: "945",
    kind: "russian",
    from: "cairo-central",
    to: "port-said",
    depart: "06:10",
    arrive: "10:30",
    duration: { en: "4h 20m", ar: "4س 20د" },
    days: "daily",
    stops: ["benha", "zagazig", "ismailia", "el-qantara"],
    fares: [{ klass: "3rd", priceEgp: 65 }],
    source: SRC_PORT,
  },
  {
    number: "185",
    kind: "russian-ac",
    from: "cairo-central",
    to: "port-said",
    depart: "09:10",
    arrive: "13:05",
    duration: { en: "3h 55m", ar: "3س 55د" },
    days: "daily",
    stops: ["benha", "zagazig", "ismailia", "el-qantara"],
    fares: [
      { klass: "3rd", priceEgp: 90 },
      { klass: "2nd-ac", priceEgp: 130 },
    ],
    source: SRC_PORT,
  },
  {
    number: "951",
    kind: "russian",
    from: "cairo-central",
    to: "port-said",
    depart: "11:30",
    arrive: "16:05",
    duration: { en: "4h 35m", ar: "4س 35د" },
    days: "daily",
    stops: ["benha", "zagazig", "ismailia", "el-qantara"],
    fares: [{ klass: "3rd", priceEgp: 65 }],
    source: SRC_PORT,
  },
  {
    number: "955",
    kind: "russian-ac",
    from: "cairo-central",
    to: "port-said",
    depart: "14:40",
    arrive: "19:05",
    duration: { en: "4h 25m", ar: "4س 25د" },
    days: "daily",
    stops: ["benha", "zagazig", "ismailia", "el-qantara"],
    fares: [
      { klass: "3rd", priceEgp: 90 },
      { klass: "2nd-ac", priceEgp: 130 },
    ],
    source: SRC_PORT,
  },

  // ─── Cairo ↔ Suez ──────────────────────────────────────────────
  // Note: seat61 records most Suez departures from Cairo Adly Mansour, not Ramses.
  {
    number: "593",
    kind: "russian",
    from: "cairo-central",
    to: "suez",
    depart: "05:00",
    arrive: "10:00",
    duration: { en: "5h 00m", ar: "5س 00د" },
    days: "daily",
    stops: ["zagazig", "ismailia"],
    fares: [{ klass: "3rd", priceEgp: 75 }],
    source: SRC_SUEZ,
  },
  {
    number: "4603",
    kind: "russian",
    from: "cairo-adly-mansour",
    to: "suez",
    depart: "05:00",
    arrive: "10:15",
    duration: { en: "5h 15m", ar: "5س 15د" },
    days: "daily",
    stops: ["ismailia"],
    fares: [{ klass: "3rd", priceEgp: 55 }],
    source: SRC_SUEZ,
  },
  {
    number: "4605",
    kind: "russian",
    from: "cairo-adly-mansour",
    to: "suez",
    depart: "15:00",
    arrive: "20:14",
    duration: { en: "5h 14m", ar: "5س 14د" },
    days: "daily",
    stops: ["ismailia"],
    fares: [{ klass: "3rd", priceEgp: 55 }],
    source: SRC_SUEZ,
  },

  // ─── Delta connectivity (indicative — not in seat61 tables) ────
  // Retained so Mansoura/Damietta/Mahalla remain reachable from Cairo in
  // the app search. Times & fares are approximate ENR domestic services;
  // do not quote as authoritative.
  {
    number: "641",
    kind: "russian-ac",
    from: "cairo-central",
    to: "mansoura",
    depart: "07:30",
    arrive: "10:20",
    duration: { en: "2h 50m", ar: "2س 50د" },
    days: "daily",
    stops: ["benha", "zagazig", "mit-ghamr", "aga"],
    fares: [
      { klass: "3rd", priceEgp: 60 },
      { klass: "2nd-ac", priceEgp: 95 },
    ],
    source: "Indicative — not sourced from seat61",
  },
  {
    number: "649",
    kind: "russian-ac",
    from: "cairo-central",
    to: "damietta",
    depart: "15:15",
    arrive: "19:10",
    duration: { en: "3h 55m", ar: "3س 55د" },
    days: "daily",
    stops: ["benha", "zagazig", "mansoura", "talkha"],
    fares: [
      { klass: "3rd", priceEgp: 70 },
      { klass: "2nd-ac", priceEgp: 110 },
    ],
    source: "Indicative — not sourced from seat61",
  },
  {
    number: "531",
    kind: "russian",
    from: "cairo-central",
    to: "mahalla-el-kubra",
    depart: "07:00",
    arrive: "09:50",
    duration: { en: "2h 50m", ar: "2س 50د" },
    days: "daily",
    stops: ["benha", "tanta", "samannoud"],
    fares: [{ klass: "3rd", priceEgp: 55 }],
    source: "Indicative — not sourced from seat61",
  },

  // ─── Quesna → Cairo (Ramses) ───────────────────────────────────
  // Verbatim from the ENR Tickets / Egypt's Trains mobile app,
  // Quesna → Cairo query for July 2026. Times, train numbers, class
  // mixes and EGP fares are transcribed directly from the app.
  {
    number: "3024",
    kind: "spanish-ac",
    from: "quesna",
    to: "cairo-central",
    depart: "11:19",
    arrive: "12:10",
    duration: { en: "0h 51m", ar: "0س 51د" },
    days: "daily",
    stops: ["benha"],
    fares: [{ klass: "2nd-ac", priceEgp: 50 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "1212",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "12:20",
    arrive: "13:35",
    duration: { en: "1h 15m", ar: "1س 15د" },
    days: "daily",
    stops: ["berket-el-sabaa", "shibin-el-kom", "toukh", "qalyub", "benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "132",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "13:12",
    arrive: "14:20",
    duration: { en: "1h 08m", ar: "1س 08د" },
    days: "daily",
    stops: ["berket-el-sabaa", "toukh", "benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "914",
    kind: "spanish-ac",
    from: "quesna",
    to: "cairo-central",
    depart: "15:25",
    arrive: "16:20",
    duration: { en: "0h 55m", ar: "0س 55د" },
    days: "daily",
    stops: ["benha"],
    fares: [
      { klass: "2nd-ac", priceEgp: 90 },
      { klass: "1st-ac", priceEgp: 120 },
    ],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "1208",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "16:20",
    arrive: "17:20",
    duration: { en: "1h 00m", ar: "1س 00د" },
    days: "daily",
    stops: ["qalyub", "benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "956",
    kind: "russian-ac",
    from: "quesna",
    to: "cairo-central",
    depart: "17:10",
    arrive: "18:10",
    duration: { en: "1h 00m", ar: "1س 00د" },
    days: "daily",
    stops: ["qalyub", "benha"],
    fares: [
      { klass: "3rd", priceEgp: 30 },
      { klass: "2nd-ac", priceEgp: 50 },
    ],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "24",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "17:26",
    arrive: "18:40",
    duration: { en: "1h 14m", ar: "1س 14د" },
    days: "daily",
    stops: ["berket-el-sabaa", "shibin-el-kom", "toukh", "qalyub", "benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "994",
    kind: "spanish-ac",
    from: "quesna",
    to: "cairo-central",
    depart: "19:30",
    arrive: "20:25",
    duration: { en: "0h 55m", ar: "0س 55د" },
    days: "daily",
    stops: ["benha"],
    fares: [{ klass: "2nd-ac", priceEgp: 60 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "32",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "21:30",
    arrive: "22:25",
    duration: { en: "0h 55m", ar: "0س 55د" },
    days: "daily",
    stops: ["benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "968",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "22:50",
    arrive: "23:50",
    duration: { en: "1h 00m", ar: "1س 00د" },
    days: "daily",
    stops: ["qalyub", "benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
  {
    number: "28",
    kind: "russian",
    from: "quesna",
    to: "cairo-central",
    depart: "23:01",
    arrive: "00:15",
    nextDayArrival: true,
    duration: { en: "1h 14m", ar: "1س 14د" },
    days: "daily",
    stops: ["berket-el-sabaa", "shibin-el-kom", "toukh", "qalyub", "benha"],
    fares: [{ klass: "3rd", priceEgp: 30 }],
    source: "ENR Tickets app • Quesna→Cairo, Jul 2026",
  },
];

/** Merged catalogue: comprehensive egytrains.com scrape (602 trains) plus
 *  hand-curated ENR Tickets app entries. Generated wins on train-number
 *  collisions to keep the freshest scrape as source of truth.
 *  Loaded lazily on first search so the home page does not pay for it. */
let _tripsPromise: Promise<readonly Trip[]> | null = null;
let _cachedTrips: readonly Trip[] | null = null;

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatDuration(minutes: number): { en: string; ar: string } {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const en = `${h}h ${m.toString().padStart(2, "0")}m`;
  const ar = `${h}س ${m.toString().padStart(2, "0")}د`;
  return { en, ar };
}

function normaliseTrip(t: Trip): Trip {
  const departMin = parseMinutes(t.depart);
  const arriveMin = parseMinutes(t.arrive);
  let durationMin = arriveMin - departMin;
  const nextDay = t.nextDayArrival ?? durationMin < 0;
  if (durationMin < 0) durationMin += 24 * 60;
  return {
    ...t,
    nextDayArrival: nextDay,
    duration: t.duration ?? formatDuration(durationMin),
  };
}

export async function loadTrips(): Promise<readonly Trip[]> {
  if (_cachedTrips) return _cachedTrips;
  if (_tripsPromise) return _tripsPromise;
  _tripsPromise = (async () => {
    const { GENERATED_TRIPS } = await import("./trips.generated");
    const byNumber = new Map<string, Trip>();
    for (const t of MANUAL_TRIPS) byNumber.set(t.number, normaliseTrip(t));
    for (const t of GENERATED_TRIPS) byNumber.set(t.number, normaliseTrip(t as Trip));
    const merged = Array.from(byNumber.values());
    _cachedTrips = Object.freeze(merged);
    return _cachedTrips;
  })();
  return _tripsPromise;
}

export const TRIPS: readonly Trip[] = []; // kept for compatibility; use loadTrips()

// ────────────────────────────────────────────────────────────────
// Lookup helpers
// ────────────────────────────────────────────────────────────────
function tripServesStation(trip: Trip, id: string): boolean {
  if (trip.from === id || trip.to === id) return true;
  return !!trip.stops?.includes(id);
}

function stationOrder(trip: Trip, id: string): number {
  if (trip.from === id) return 0;
  const stopIdx = trip.stops?.indexOf(id) ?? -1;
  if (stopIdx >= 0) return stopIdx + 1;
  if (trip.to === id) return (trip.stops?.length ?? 0) + 1;
  return -1;
}

export type TripMatch = Omit<Trip, "duration" | "nextDayArrival"> & {
  duration: { en: string; ar: string };
  nextDayArrival: boolean;
  direct: boolean;
  intermediateStops: number;
};

/** Find every catalogue trip that serves fromId → toId (direct or through). */
export async function findTrips(fromId: string, toId: string): Promise<TripMatch[]> {
  if (!fromId || !toId || fromId === toId) return [];
  const TRIPS = await loadTrips();

  // Treat Cairo hubs as interchangeable for search purposes.
  const CAIRO_GROUP = new Set(["cairo-central", "cairo-upper-egypt", "cairo-adly-mansour"]);
  const ALX_GROUP = new Set(["alexandria-misr", "alexandria-moharam-bek"]);
  const expand = (id: string) =>
    CAIRO_GROUP.has(id) ? CAIRO_GROUP : ALX_GROUP.has(id) ? ALX_GROUP : new Set([id]);
  const fromSet = expand(fromId);
  const toSet = expand(toId);

  const out: TripMatch[] = [];
  for (const trip of TRIPS) {
    const fromMatch = [...fromSet].find((id) => tripServesStation(trip, id));
    const toMatch = [...toSet].find((id) => tripServesStation(trip, id));
    if (!fromMatch || !toMatch) continue;
    const a = stationOrder(trip, fromMatch);
    const b = stationOrder(trip, toMatch);
    if (a < 0 || b < 0 || a >= b) continue;
    const direct = trip.from === fromMatch && trip.to === toMatch;
    out.push({
      ...trip,
      duration: trip.duration!,
      nextDayArrival: trip.nextDayArrival ?? false,
      direct,
      intermediateStops: Math.max(0, b - a - 1),
    });
  }
  const sorted = out.sort((x, y) => x.depart.localeCompare(y.depart));
  const { assertTripMatches } = await import("./trips-schema");
  return assertTripMatches(sorted);
}

/** Departures leaving `stationId` today, ordered by time. */
export async function departuresFrom(stationId: string): Promise<TripMatch[]> {
  if (!stationId) return [];
  const TRIPS = await loadTrips();
  const rows = TRIPS.filter((t) => t.from === stationId || t.stops?.includes(stationId))
    .map((t) => ({
      ...t,
      duration: t.duration!,
      nextDayArrival: t.nextDayArrival ?? false,
      direct: t.from === stationId,
      intermediateStops: 0,
    }))
    .sort((a, b) => a.depart.localeCompare(b.depart));
  const { assertTripMatches } = await import("./trips-schema");
  return assertTripMatches(rows);
}

// ────────────────────────────────────────────────────────────────
// Label helpers (i18n)
// ────────────────────────────────────────────────────────────────
export const TRAIN_KIND_LABEL: Record<TrainKind, { en: string; ar: string }> = {
  "vip-talgo": { en: "VIP / Talgo", ar: "في آي بي / تالجو" },
  "spanish-ac": { en: "Spanish AC", ar: "إسباني مكيّف" },
  "russian-ac": { en: "Russian AC", ar: "روسي مكيّف" },
  russian: { en: "Russian", ar: "روسي" },
  sleeper: { en: "Sleeper", ar: "عربة نوم" },
};

export const FARE_CLASS_LABEL: Record<FareClassCode, { en: string; ar: string }> = {
  "3rd": { en: "3rd Class", ar: "الدرجة الثالثة" },
  "2nd-ac": { en: "2nd Class AC", ar: "الدرجة الثانية مكيّفة" },
  "1st-ac": { en: "1st Class AC", ar: "الدرجة الأولى مكيّفة" },
  vip: { en: "VIP", ar: "في آي بي" },
  "sleeper-double": { en: "Sleeper (double)", ar: "عربة نوم (مزدوجة)" },
  "sleeper-single": { en: "Sleeper (single)", ar: "عربة نوم (فردية)" },
};

export const DAYS_OF_WEEK: readonly {
  en: string;
  ar: string;
  short: { en: string; ar: string };
}[] = [
  { en: "Sunday", ar: "الأحد", short: { en: "Sun", ar: "أحد" } },
  { en: "Monday", ar: "الاثنين", short: { en: "Mon", ar: "اثنين" } },
  { en: "Tuesday", ar: "الثلاثاء", short: { en: "Tue", ar: "ثلاثاء" } },
  { en: "Wednesday", ar: "الأربعاء", short: { en: "Wed", ar: "أربعاء" } },
  { en: "Thursday", ar: "الخميس", short: { en: "Thu", ar: "خميس" } },
  { en: "Friday", ar: "الجمعة", short: { en: "Fri", ar: "جمعة" } },
  { en: "Saturday", ar: "السبت", short: { en: "Sat", ar: "سبت" } },
];

export function tripRunsOn(trip: Trip, date: Date): boolean {
  if (trip.days === "daily") return true;
  return trip.days.includes(date.getDay());
}

export function fromStationName(trip: Trip, locale: "en" | "ar" = "en"): string {
  return findStation(trip.from)?.name[locale] ?? trip.from;
}
export function toStationName(trip: Trip, locale: "en" | "ar" = "en"): string {
  return findStation(trip.to)?.name[locale] ?? trip.to;
}
export function minFareEgp(trip: Trip): number {
  return Math.min(...trip.fares.map((f) => f.priceEgp));
}
export type _Station = Station;
