/**
 * Central station catalogue for the Egyptian National Railways (ENR) network.
 *
 * Sources: Wikipedia "List of railway stations in Egypt", egypttrains.com
 * route listings, and ENR public timetable documents. Station names use the
 * standard ENR/Wikipedia transliteration. Codes are internal 3-letter slugs
 * used only for URL params and display — ENR does not publish official
 * IATA-style station codes.
 */
import { EXTRA_STATIONS } from "./stations.generated";
export type StationFacility =
  | "ticketing"
  | "waiting"
  | "accessible"
  | "parking"
  | "cafe"
  | "shops"
  | "wifi"
  | "atm"
  | "prayer"
  | "luggage"
  | "taxi"
  | "metro";

export type Station = {
  id: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
  /** Internal 3-letter code (not an official ENR code). */
  code: string;
  /** ENR line/corridor grouping for the station finder. */
  line:
    | "cairo-alexandria"
    | "upper-egypt"
    | "delta"
    | "canal"
    | "north-coast"
    | "fayoum";
  /** Major interchange/terminal stations, prioritised in autocomplete. */
  hub?: boolean;
  /** Short bilingual description shown on the station detail page. */
  about?: { en: string; ar: string };
  /** On-site facilities used to render the amenities grid. */
  facilities?: readonly StationFacility[];
  /** Approximate coordinates for the location panel. */
  coords?: { lat: number; lng: number };
  /** Year the station opened, when documented. */
  opened?: number;
};

export const STATIONS: readonly Station[] = [
  // ─── Cairo–Alexandria main line ────────────────────────────────
  { id: "cairo-central",   code: "CAI", hub: true, line: "cairo-alexandria", name: { en: "Cairo Central (Ramses)",  ar: "القاهرة الرئيسية (رمسيس)" }, city: { en: "Cairo",       ar: "القاهرة" } },
  { id: "cairo-upper-egypt", code: "CUE", hub: true, line: "upper-egypt",     name: { en: "Cairo Upper Egypt (Bashtil)", ar: "القاهرة الصعيد (بشتيل)" }, city: { en: "Cairo",     ar: "القاهرة" } },
  { id: "cairo-adly-mansour", code: "ADM",         line: "canal",             name: { en: "Cairo Adly Mansour",      ar: "عدلي منصور" },                city: { en: "Cairo",       ar: "القاهرة" } },
  { id: "giza",            code: "GIZ", hub: true, line: "upper-egypt",       name: { en: "Giza",                    ar: "الجيزة" },                     city: { en: "Giza",        ar: "الجيزة" } },
  { id: "alexandria-moharam-bek", code: "AMB",     line: "north-coast",       name: { en: "Alexandria Moharam Bek",  ar: "الإسكندرية محرم بك" },        city: { en: "Alexandria",  ar: "الإسكندرية" } },
  { id: "shobra-el-kheima",code: "SBK",           line: "cairo-alexandria", name: { en: "Shobra El-Kheima",        ar: "شبرا الخيمة" },               city: { en: "Cairo",       ar: "القاهرة" } },
  { id: "qalyoub",         code: "QLB",           line: "cairo-alexandria", name: { en: "Qalyoub",                 ar: "قليوب" },                     city: { en: "Qalyubia",    ar: "القليوبية" } },
  { id: "benha",           code: "BNH", hub: true, line: "cairo-alexandria", name: { en: "Benha",                   ar: "بنها" },                       city: { en: "Benha",       ar: "بنها" } },
  { id: "quesna",          code: "QSN",           line: "cairo-alexandria", name: { en: "Quesna",                  ar: "قويسنا" },                    city: { en: "Menoufia",    ar: "المنوفية" } },
  { id: "birket-el-saba",  code: "BKS",           line: "cairo-alexandria", name: { en: "Birket El-Sabaa",         ar: "بركة السبع" },                city: { en: "Menoufia",    ar: "المنوفية" } },
  { id: "tanta",           code: "TAN", hub: true, line: "cairo-alexandria", name: { en: "Tanta",                   ar: "طنطا" },                       city: { en: "Tanta",       ar: "طنطا" } },
  { id: "kafr-el-zayat",   code: "KZY",           line: "cairo-alexandria", name: { en: "Kafr El-Zayat",           ar: "كفر الزيات" },                city: { en: "Gharbia",     ar: "الغربية" } },
  { id: "tawfiqia",        code: "TWF",           line: "cairo-alexandria", name: { en: "Tawfiqia",                ar: "التوفيقية" },                 city: { en: "Beheira",     ar: "البحيرة" } },
  { id: "itay-el-barud",   code: "IBD",           line: "cairo-alexandria", name: { en: "Itay El-Barud",           ar: "إيتاي البارود" },             city: { en: "Beheira",     ar: "البحيرة" } },
  { id: "damanhur",        code: "DAM",           line: "cairo-alexandria", name: { en: "Damanhur",                ar: "دمنهور" },                    city: { en: "Damanhur",    ar: "دمنهور" } },
  { id: "abu-hummus",      code: "AHM",           line: "cairo-alexandria", name: { en: "Abu Hummus",              ar: "أبو حمص" },                   city: { en: "Beheira",     ar: "البحيرة" } },
  { id: "kafr-el-dawar",   code: "KDW",           line: "cairo-alexandria", name: { en: "Kafr El-Dawar",           ar: "كفر الدوار" },                city: { en: "Beheira",     ar: "البحيرة" } },
  { id: "sidi-gaber",      code: "SGB", hub: true, line: "cairo-alexandria", name: { en: "Sidi Gaber",              ar: "سيدي جابر" },                 city: { en: "Alexandria",  ar: "الإسكندرية" } },
  { id: "alexandria-misr", code: "ALY", hub: true, line: "cairo-alexandria", name: { en: "Alexandria Misr",         ar: "الإسكندرية مصر" },            city: { en: "Alexandria",  ar: "الإسكندرية" } },

  // ─── Upper Egypt line (Cairo → Aswan) ──────────────────────────
  { id: "beni-suef",       code: "BSF",           line: "upper-egypt", name: { en: "Beni Suef",             ar: "بني سويف" },       city: { en: "Beni Suef", ar: "بني سويف" } },
  { id: "maghagha",        code: "MGH",           line: "upper-egypt", name: { en: "Maghagha",              ar: "مغاغة" },          city: { en: "Minya",     ar: "المنيا" } },
  { id: "beni-mazar",      code: "BMZ",           line: "upper-egypt", name: { en: "Beni Mazar",            ar: "بني مزار" },       city: { en: "Minya",     ar: "المنيا" } },
  { id: "minya",           code: "MNY", hub: true, line: "upper-egypt", name: { en: "Minya",                 ar: "المنيا" },         city: { en: "Minya",     ar: "المنيا" } },
  { id: "mallawi",         code: "MLW",           line: "upper-egypt", name: { en: "Mallawi",               ar: "ملوي" },           city: { en: "Minya",     ar: "المنيا" } },
  { id: "deir-mawas",      code: "DMW",           line: "upper-egypt", name: { en: "Deir Mawas",            ar: "دير مواس" },       city: { en: "Minya",     ar: "المنيا" } },
  { id: "manfalut",        code: "MFT",           line: "upper-egypt", name: { en: "Manfalut",              ar: "منفلوط" },         city: { en: "Asyut",     ar: "أسيوط" } },
  { id: "asyut",           code: "AST", hub: true, line: "upper-egypt", name: { en: "Asyut",                 ar: "أسيوط" },          city: { en: "Asyut",     ar: "أسيوط" } },
  { id: "abu-tig",         code: "ABT",           line: "upper-egypt", name: { en: "Abu Tig",               ar: "أبو تيج" },        city: { en: "Asyut",     ar: "أسيوط" } },
  { id: "sidfa",           code: "SDF",           line: "upper-egypt", name: { en: "Sidfa",                 ar: "صدفا" },           city: { en: "Asyut",     ar: "أسيوط" } },
  { id: "tima",            code: "TMA",           line: "upper-egypt", name: { en: "Tima",                  ar: "طما" },            city: { en: "Sohag",     ar: "سوهاج" } },
  { id: "tahta",           code: "THT",           line: "upper-egypt", name: { en: "Tahta",                 ar: "طهطا" },           city: { en: "Sohag",     ar: "سوهاج" } },
  { id: "sohag",           code: "SHG", hub: true, line: "upper-egypt", name: { en: "Sohag",                 ar: "سوهاج" },          city: { en: "Sohag",     ar: "سوهاج" } },
  { id: "girga",           code: "GRG",           line: "upper-egypt", name: { en: "Girga",                 ar: "جرجا" },           city: { en: "Sohag",     ar: "سوهاج" } },
  { id: "el-balyana",      code: "BLY",           line: "upper-egypt", name: { en: "El-Balyana",            ar: "البلينا" },        city: { en: "Sohag",     ar: "سوهاج" } },
  { id: "nag-hammadi",     code: "NHM",           line: "upper-egypt", name: { en: "Nag Hammadi",           ar: "نجع حمادي" },      city: { en: "Qena",      ar: "قنا" } },
  { id: "qena",            code: "QNA", hub: true, line: "upper-egypt", name: { en: "Qena",                  ar: "قنا" },            city: { en: "Qena",      ar: "قنا" } },
  { id: "luxor",           code: "LXR", hub: true, line: "upper-egypt", name: { en: "Luxor",                 ar: "الأقصر" },         city: { en: "Luxor",     ar: "الأقصر" } },
  { id: "esna",            code: "ESN",           line: "upper-egypt", name: { en: "Esna",                  ar: "إسنا" },           city: { en: "Luxor",     ar: "الأقصر" } },
  { id: "edfu",            code: "EDF",           line: "upper-egypt", name: { en: "Edfu",                  ar: "إدفو" },           city: { en: "Aswan",     ar: "أسوان" } },
  { id: "kom-ombo",        code: "KMB",           line: "upper-egypt", name: { en: "Kom Ombo",              ar: "كوم أمبو" },       city: { en: "Aswan",     ar: "أسوان" } },
  { id: "daraw",           code: "DRW",           line: "upper-egypt", name: { en: "Daraw",                 ar: "دراو" },           city: { en: "Aswan",     ar: "أسوان" } },
  { id: "aswan",           code: "ASW", hub: true, line: "upper-egypt", name: { en: "Aswan",                 ar: "أسوان" },          city: { en: "Aswan",     ar: "أسوان" } },

  // ─── Canal / Suez lines ────────────────────────────────────────
  { id: "zagazig",         code: "ZAG", hub: true, line: "canal", name: { en: "Zagazig",         ar: "الزقازيق" },      city: { en: "Sharqia",   ar: "الشرقية" } },
  { id: "abu-kebir",       code: "AKB",           line: "canal", name: { en: "Abu Kebir",       ar: "أبو كبير" },      city: { en: "Sharqia",   ar: "الشرقية" } },
  { id: "faqus",           code: "FQS",           line: "canal", name: { en: "Faqus",           ar: "فاقوس" },         city: { en: "Sharqia",   ar: "الشرقية" } },
  { id: "abu-hammad",      code: "AHD",           line: "canal", name: { en: "Abu Hammad",      ar: "أبو حماد" },      city: { en: "Sharqia",   ar: "الشرقية" } },
  { id: "el-tal-el-kabir", code: "TLK",           line: "canal", name: { en: "El-Tal El-Kabir", ar: "التل الكبير" },   city: { en: "Ismailia",  ar: "الإسماعيلية" } },
  { id: "qassasin",        code: "QSS",           line: "canal", name: { en: "El-Qassasin",     ar: "القصاصين" },      city: { en: "Ismailia",  ar: "الإسماعيلية" } },
  { id: "abu-swer",        code: "ASW2",          line: "canal", name: { en: "Abu Swer",        ar: "أبو صوير" },      city: { en: "Ismailia",  ar: "الإسماعيلية" } },
  { id: "ismailia",        code: "ISM", hub: true, line: "canal", name: { en: "Ismailia",        ar: "الإسماعيلية" },   city: { en: "Ismailia",  ar: "الإسماعيلية" } },
  { id: "el-qantara",      code: "QNT",           line: "canal", name: { en: "El-Qantara Gharb",ar: "القنطرة غرب" },   city: { en: "Ismailia",  ar: "الإسماعيلية" } },
  { id: "port-said",       code: "PSD", hub: true, line: "canal", name: { en: "Port Said",       ar: "بورسعيد" },       city: { en: "Port Said", ar: "بورسعيد" } },
  { id: "suez",            code: "SUZ", hub: true, line: "canal", name: { en: "Suez",            ar: "السويس" },        city: { en: "Suez",      ar: "السويس" } },

  // ─── Delta branches (Mansoura / Damietta / Mahalla / Kafr El-Sheikh) ─
  { id: "mit-ghamr",       code: "MTG",           line: "delta", name: { en: "Mit Ghamr",       ar: "ميت غمر" },      city: { en: "Dakahlia",     ar: "الدقهلية" } },
  { id: "aga",             code: "AGA",           line: "delta", name: { en: "Aga",             ar: "أجا" },           city: { en: "Dakahlia",     ar: "الدقهلية" } },
  { id: "mansoura",        code: "MNS", hub: true, line: "delta", name: { en: "Mansoura",        ar: "المنصورة" },      city: { en: "Mansoura",     ar: "المنصورة" } },
  { id: "talkha",          code: "TLK2",          line: "delta", name: { en: "Talkha",          ar: "طلخا" },          city: { en: "Dakahlia",     ar: "الدقهلية" } },
  { id: "damietta",        code: "DMT", hub: true, line: "delta", name: { en: "Damietta",        ar: "دمياط" },         city: { en: "Damietta",     ar: "دمياط" } },
  { id: "ras-el-bar",      code: "RSB",           line: "delta", name: { en: "Ras El-Bar",      ar: "رأس البر" },      city: { en: "Damietta",     ar: "دمياط" } },
  { id: "mahalla-el-kubra",code: "MHL", hub: true, line: "delta", name: { en: "El-Mahalla El-Kubra", ar: "المحلة الكبرى" }, city: { en: "Gharbia", ar: "الغربية" } },
  { id: "samannoud",       code: "SMD",           line: "delta", name: { en: "Samannoud",       ar: "سمنود" },         city: { en: "Gharbia",      ar: "الغربية" } },
  { id: "kafr-el-sheikh",  code: "KSH", hub: true, line: "delta", name: { en: "Kafr El-Sheikh", ar: "كفر الشيخ" },     city: { en: "Kafr El-Sheikh", ar: "كفر الشيخ" } },
  { id: "desouk",          code: "DSK",           line: "delta", name: { en: "Desouk",          ar: "دسوق" },          city: { en: "Kafr El-Sheikh", ar: "كفر الشيخ" } },
  { id: "rashid",          code: "RSD",           line: "delta", name: { en: "Rashid (Rosetta)",ar: "رشيد" },          city: { en: "Beheira",      ar: "البحيرة" } },

  // ─── North Coast (Alexandria → Marsa Matruh) ──────────────────
  { id: "el-alamein",      code: "ALM",           line: "north-coast", name: { en: "El-Alamein",       ar: "العلمين" },       city: { en: "Matruh", ar: "مطروح" } },
  { id: "el-dabaa",        code: "DBA",           line: "north-coast", name: { en: "El-Dabaa",         ar: "الضبعة" },        city: { en: "Matruh", ar: "مطروح" } },
  { id: "fuka",            code: "FUK",           line: "north-coast", name: { en: "Fuka",             ar: "فوكة" },          city: { en: "Matruh", ar: "مطروح" } },
  { id: "marsa-matruh",    code: "MRM", hub: true, line: "north-coast", name: { en: "Marsa Matruh",     ar: "مرسى مطروح" },    city: { en: "Matruh", ar: "مطروح" } },

  // ─── Fayoum branch ────────────────────────────────────────────
  { id: "fayoum",          code: "FYM", hub: true, line: "fayoum", name: { en: "Fayoum", ar: "الفيوم" }, city: { en: "Fayoum", ar: "الفيوم" } },
  ...EXTRA_STATIONS,
];

/** Backwards-compat alias for older imports. */
export type StationId = (typeof STATIONS)[number]["id"];

export function findStation(id: string | undefined | null): Station | undefined {
  if (!id) return undefined;
  return STATIONS.find((s) => s.id === id);
}

export function stationLabel(id: string | undefined | null, locale: "en" | "ar" = "en"): string {
  const s = findStation(id);
  if (!s) return "";
  return s.name[locale];
}

/** Case-insensitive prefix / substring search for autocomplete. Hubs float first. */
export function searchStations(query: string, limit = 8): Station[] {
  const q = query.trim().toLowerCase();
  const sorted = [...STATIONS].sort((a, b) => Number(!!b.hub) - Number(!!a.hub));
  if (!q) return sorted.slice(0, limit);
  return sorted
    .filter(
      (s) =>
        s.name.en.toLowerCase().includes(q) ||
        s.name.ar.includes(query.trim()) ||
        s.city.en.toLowerCase().includes(q) ||
        s.city.ar.includes(query.trim()) ||
        s.code.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

export const STATION_LINES = [
  { id: "cairo-alexandria", label: { en: "Cairo–Alexandria main line", ar: "خط القاهرة – الإسكندرية" } },
  { id: "upper-egypt",       label: { en: "Upper Egypt (Cairo–Aswan)",  ar: "خط الصعيد (القاهرة – أسوان)" } },
  { id: "canal",             label: { en: "Suez Canal corridor",         ar: "محور قناة السويس" } },
  { id: "delta",             label: { en: "Delta branches",              ar: "فروع الدلتا" } },
  { id: "north-coast",       label: { en: "North Coast",                 ar: "الساحل الشمالي" } },
  { id: "fayoum",            label: { en: "Fayoum branch",               ar: "فرع الفيوم" } },
] as const;

/**
 * Per-station details layered on top of the base catalogue. Everything a
 * station page needs: a short about paragraph, on-site facilities, and
 * approximate coordinates for the location panel. Non-hub / smaller
 * stations fall back to generated defaults derived from their line.
 */
type StationDetail = Pick<Station, "about" | "facilities" | "coords" | "opened">;

const STATION_DETAILS: Record<string, StationDetail> = {
  "cairo-central": {
    opened: 1856,
    coords: { lat: 30.0626, lng: 31.2497 },
    facilities: ["ticketing", "waiting", "accessible", "parking", "cafe", "shops", "wifi", "atm", "prayer", "luggage", "taxi", "metro"],
    about: {
      en: "Cairo's flagship terminus at Ramses Square, opened in 1856 and rebuilt in 2011. Hub for every long-distance service on the network and connected to Cairo Metro Line 2 (Al-Shohadaa).",
      ar: "المحطة الرئيسية للقاهرة بميدان رمسيس، افتُتحت عام 1856 وأُعيد بناؤها عام 2011. مركز جميع رحلات المسافات الطويلة على الشبكة ومتصلة بالخط الثاني لمترو القاهرة (الشهداء).",
    },
  },
  "cairo-upper-egypt": {
    opened: 2023,
    coords: { lat: 30.1112, lng: 31.1743 },
    facilities: ["ticketing", "waiting", "accessible", "parking", "cafe", "wifi", "prayer", "luggage", "taxi"],
    about: {
      en: "New western Cairo terminus at Bashtil, opened 2023 to relieve Ramses. Serves most Upper Egypt (Cairo–Aswan) trains including the Watania sleeper.",
      ar: "المحطة الغربية الجديدة للقاهرة في بشتيل، افتُتحت عام 2023 لتخفيف الضغط عن رمسيس. تخدم معظم قطارات الصعيد (القاهرة – أسوان) بما فيها قطار واطنية النوم.",
    },
  },
  "cairo-adly-mansour": {
    opened: 2022,
    coords: { lat: 30.1466, lng: 31.4213 },
    facilities: ["ticketing", "waiting", "accessible", "parking", "wifi", "prayer", "taxi", "metro"],
    about: {
      en: "Eastern Cairo interchange in Al-Salam, opened 2022. Terminus of Cairo Metro Line 3 and the Adly Mansour–Tenth of Ramadan LRT.",
      ar: "محطة تبادل شرق القاهرة بمدينة السلام، افتُتحت عام 2022. المحطة النهائية للخط الثالث لمترو القاهرة والقطار الكهربائي السريع عدلي منصور – العاشر من رمضان.",
    },
  },
  giza: {
    opened: 1867,
    coords: { lat: 30.0121, lng: 31.2079 },
    facilities: ["ticketing", "waiting", "accessible", "parking", "cafe", "wifi", "prayer", "taxi", "metro"],
    about: {
      en: "Giza station on the Upper Egypt line, first opened 1867. Every Aswan- and Luxor-bound express stops here, and it connects to Cairo Metro Line 2.",
      ar: "محطة الجيزة على خط الصعيد، افتُتحت عام 1867. تتوقف بها جميع القطارات السريعة المتجهة إلى الأقصر وأسوان، وترتبط بالخط الثاني لمترو القاهرة.",
    },
  },
  "alexandria-misr": {
    opened: 1854,
    coords: { lat: 31.1930, lng: 29.9047 },
    facilities: ["ticketing", "waiting", "accessible", "parking", "cafe", "shops", "wifi", "atm", "prayer", "luggage", "taxi"],
    about: {
      en: "Alexandria's Misr Station at Al-Gomrok, terminus of the Cairo–Alexandria line since 1854 — one of the oldest continuously-operating stations in Africa.",
      ar: "محطة مصر بالإسكندرية في الجمرك، المحطة النهائية لخط القاهرة – الإسكندرية منذ عام 1854 — من أقدم المحطات العاملة في أفريقيا.",
    },
  },
  "sidi-gaber": {
    opened: 1856,
    coords: { lat: 31.2181, lng: 29.9490 },
    facilities: ["ticketing", "waiting", "accessible", "cafe", "shops", "wifi", "atm", "prayer", "taxi"],
    about: {
      en: "Alexandria's second main station in the residential Sidi Gaber district. Most passengers alight here rather than continuing to Misr.",
      ar: "المحطة الرئيسية الثانية للإسكندرية بحي سيدي جابر السكني. يفضّل معظم الركاب النزول هنا بدلاً من إكمال الرحلة إلى محطة مصر.",
    },
  },
  "alexandria-moharam-bek": {
    coords: { lat: 31.1912, lng: 29.9195 },
    facilities: ["ticketing", "waiting", "parking", "prayer", "taxi"],
    about: {
      en: "Moharam Bek serves regional trains from the Delta and North Coast on the western edge of Alexandria.",
      ar: "محطة محرم بك تخدم القطارات الإقليمية القادمة من الدلتا والساحل الشمالي في الطرف الغربي للإسكندرية.",
    },
  },
  tanta: {
    opened: 1856,
    coords: { lat: 30.7889, lng: 31.0018 },
    facilities: ["ticketing", "waiting", "accessible", "cafe", "prayer", "taxi"],
    about: {
      en: "Central Delta interchange where the Cairo–Alexandria main line meets the branches to Mansoura, Damietta and Mahalla El-Kubra.",
      ar: "محطة تبادل في وسط الدلتا حيث يلتقي خط القاهرة – الإسكندرية بفروع المنصورة ودمياط والمحلة الكبرى.",
    },
  },
  benha: {
    coords: { lat: 30.4599, lng: 31.1783 },
    facilities: ["ticketing", "waiting", "cafe", "prayer", "taxi"],
    about: {
      en: "Benha is the first major stop out of Cairo on the Alexandria line and the junction with the Zagazig / Suez Canal corridor.",
      ar: "بنها هي أول محطة رئيسية بعد القاهرة على خط الإسكندرية ونقطة التقاطع مع خط الزقازيق ومحور قناة السويس.",
    },
  },
  luxor: {
    opened: 1898,
    coords: { lat: 25.6987, lng: 32.6392 },
    facilities: ["ticketing", "waiting", "accessible", "cafe", "shops", "wifi", "prayer", "luggage", "taxi"],
    about: {
      en: "The gateway to the Valley of the Kings and Karnak. Every day and sleeper service between Cairo and Aswan calls here.",
      ar: "بوابة وادي الملوك ومعابد الكرنك. تتوقف بها كل القطارات النهارية والليلية بين القاهرة وأسوان.",
    },
  },
  aswan: {
    opened: 1898,
    coords: { lat: 24.0912, lng: 32.8988 },
    facilities: ["ticketing", "waiting", "accessible", "cafe", "wifi", "prayer", "luggage", "taxi"],
    about: {
      en: "Southern terminus of the Egyptian mainline network, gateway to Abu Simbel and the Nubian temples.",
      ar: "المحطة النهائية الجنوبية للشبكة الرئيسية المصرية، وبوابة أبو سمبل ومعابد النوبة.",
    },
  },
  minya: {
    coords: { lat: 28.0871, lng: 30.7618 },
    facilities: ["ticketing", "waiting", "cafe", "prayer", "taxi"],
    about: {
      en: "Regional capital station serving Middle Egypt. Halt for every Upper-Egypt express and most stopping services.",
      ar: "محطة العاصمة الإقليمية لصعيد مصر الأدنى. تتوقف بها كل قطارات الصعيد السريعة ومعظم القطارات المحلية.",
    },
  },
  asyut: {
    coords: { lat: 27.1832, lng: 31.1859 },
    facilities: ["ticketing", "waiting", "cafe", "prayer", "taxi"],
    about: {
      en: "Largest station in Upper Egypt between Cairo and Luxor, and a major freight interchange.",
      ar: "أكبر محطة في الصعيد بين القاهرة والأقصر، ومركز رئيسي لتبادل الشحن.",
    },
  },
  sohag: {
    coords: { lat: 26.5476, lng: 31.6957 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Sohag serves the governorate capital and the university city of Nag Hammadi to the south.",
      ar: "تخدم محطة سوهاج عاصمة المحافظة ومدينة نجع حمادي الجامعية جنوبًا.",
    },
  },
  qena: {
    coords: { lat: 26.1650, lng: 32.7185 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Qena is the last major stop before Luxor and the branch point toward Safaga on the Red Sea (freight only).",
      ar: "قنا هي آخر محطة رئيسية قبل الأقصر ونقطة التفرع نحو سفاجا على البحر الأحمر (شحن فقط).",
    },
  },
  "beni-suef": {
    coords: { lat: 29.0661, lng: 31.0994 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "First governorate capital south of Cairo on the Upper Egypt line.",
      ar: "أول عاصمة محافظة جنوب القاهرة على خط الصعيد.",
    },
  },
  mansoura: {
    coords: { lat: 31.0410, lng: 31.3789 },
    facilities: ["ticketing", "waiting", "cafe", "prayer", "taxi"],
    about: {
      en: "Terminus of the Delta branch from Tanta; university city and gateway to the north-eastern Delta.",
      ar: "المحطة النهائية لفرع الدلتا القادم من طنطا؛ مدينة جامعية وبوابة شمال شرق الدلتا.",
    },
  },
  damietta: {
    coords: { lat: 31.4165, lng: 31.8144 },
    facilities: ["ticketing", "waiting", "parking", "prayer", "taxi"],
    about: {
      en: "Northern Delta port city on the eastern branch of the Nile.",
      ar: "مدينة ميناء في شمال الدلتا على الفرع الشرقي للنيل.",
    },
  },
  "mahalla-el-kubra": {
    coords: { lat: 30.9700, lng: 31.1650 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Egypt's largest textile-industry city, on the Tanta–Damietta branch.",
      ar: "أكبر مدن صناعة الغزل والنسيج في مصر، على فرع طنطا – دمياط.",
    },
  },
  "kafr-el-sheikh": {
    coords: { lat: 31.1120, lng: 30.9410 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Governorate capital in the northern Delta, terminus of the branch from Tanta via Desouk.",
      ar: "عاصمة محافظة في شمال الدلتا، المحطة النهائية للفرع القادم من طنطا عبر دسوق.",
    },
  },
  zagazig: {
    coords: { lat: 30.5877, lng: 31.5020 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Sharqia governorate capital, junction between the Delta and the Ismailia / Suez Canal corridor.",
      ar: "عاصمة محافظة الشرقية، ونقطة التقاء الدلتا بمحور الإسماعيلية وقناة السويس.",
    },
  },
  ismailia: {
    coords: { lat: 30.5965, lng: 32.2715 },
    facilities: ["ticketing", "waiting", "accessible", "cafe", "prayer", "taxi"],
    about: {
      en: "Central station on the Suez Canal, midway between Port Said and Suez.",
      ar: "المحطة الرئيسية على قناة السويس، في منتصف الطريق بين بورسعيد والسويس.",
    },
  },
  "port-said": {
    coords: { lat: 31.2565, lng: 32.2841 },
    facilities: ["ticketing", "waiting", "cafe", "prayer", "taxi"],
    about: {
      en: "Mediterranean terminus of the Suez Canal corridor line.",
      ar: "المحطة النهائية على البحر المتوسط لخط محور قناة السويس.",
    },
  },
  suez: {
    coords: { lat: 29.9668, lng: 32.5498 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Southern terminus of the Suez Canal corridor line at the head of the Gulf of Suez.",
      ar: "المحطة النهائية الجنوبية لخط محور قناة السويس عند رأس خليج السويس.",
    },
  },
  "marsa-matruh": {
    coords: { lat: 31.3543, lng: 27.2373 },
    facilities: ["ticketing", "waiting", "parking", "prayer", "taxi"],
    about: {
      en: "Summer-seasonal North Coast terminus, 468 km west of Cairo.",
      ar: "المحطة النهائية الموسمية على الساحل الشمالي، على بُعد 468 كم غرب القاهرة.",
    },
  },
  fayoum: {
    coords: { lat: 29.3084, lng: 30.8428 },
    facilities: ["ticketing", "waiting", "prayer", "taxi"],
    about: {
      en: "Terminus of the branch line from Wasta on the Upper Egypt corridor.",
      ar: "المحطة النهائية للخط الفرعي من الواسطة على خط الصعيد.",
    },
  },
};

/** Line-level narrative used to synthesise about-text for smaller stations. */
const LINE_BLURBS: Record<Station["line"], { en: string; ar: string }> = {
  "cairo-alexandria": {
    en: "Intermediate stop on the Cairo–Alexandria main line, served mainly by regional and stopping services.",
    ar: "محطة بينية على خط القاهرة – الإسكندرية الرئيسي، تخدمها في الغالب القطارات الإقليمية والمحلية.",
  },
  "upper-egypt": {
    en: "Stop on the Cairo–Aswan Upper Egypt corridor, served by regional trains and select express services.",
    ar: "محطة على خط الصعيد القاهرة – أسوان، تخدمها قطارات إقليمية وبعض القطارات السريعة.",
  },
  delta: {
    en: "Delta-branch station connecting to Tanta and the main line.",
    ar: "محطة على فروع الدلتا تربط بمحطة طنطا والخط الرئيسي.",
  },
  canal: {
    en: "Stop on the Suez Canal corridor between Cairo, Ismailia, Port Said and Suez.",
    ar: "محطة على محور قناة السويس بين القاهرة والإسماعيلية وبورسعيد والسويس.",
  },
  "north-coast": {
    en: "North Coast branch station between Alexandria and Marsa Matruh, seasonal in summer.",
    ar: "محطة على فرع الساحل الشمالي بين الإسكندرية ومرسى مطروح، وتعمل موسميًا صيفًا.",
  },
  fayoum: {
    en: "Fayoum branch station off the Upper Egypt main line at Wasta.",
    ar: "محطة على فرع الفيوم المتفرع من خط الصعيد عند الواسطة.",
  },
};

const DEFAULT_FACILITIES: readonly StationFacility[] = ["ticketing", "waiting", "prayer", "taxi"];

/** Merge base station with layered detail + line-level defaults. */
export function getStationDetail(id: string): (Station & StationDetail) | undefined {
  const base = findStation(id);
  if (!base) return undefined;
  const extra = STATION_DETAILS[id] ?? {};
  return {
    ...base,
    about: extra.about ?? LINE_BLURBS[base.line],
    facilities: extra.facilities ?? DEFAULT_FACILITIES,
    coords: extra.coords,
    opened: extra.opened,
  };
}

export const STATION_FACILITY_LABELS: Record<StationFacility, { en: string; ar: string }> = {
  ticketing:   { en: "Ticket office",       ar: "شباك التذاكر" },
  waiting:     { en: "Waiting hall",        ar: "قاعة انتظار" },
  accessible:  { en: "Step-free access",    ar: "مسار دون درجات" },
  parking:     { en: "Parking",             ar: "موقف سيارات" },
  cafe:        { en: "Café / kiosk",        ar: "كافيه / كشك" },
  shops:       { en: "Shops",               ar: "محلات" },
  wifi:        { en: "Free Wi-Fi",          ar: "واي فاي مجاني" },
  atm:         { en: "ATM",                 ar: "صراف آلي" },
  prayer:      { en: "Prayer room",         ar: "مصلى" },
  luggage:     { en: "Left-luggage",        ar: "حفظ أمتعة" },
  taxi:        { en: "Taxi rank",           ar: "موقف تاكسي" },
  metro:       { en: "Metro connection",    ar: "ربط مع المترو" },
};
