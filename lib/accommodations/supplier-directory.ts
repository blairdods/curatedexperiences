import * as XLSX from "xlsx";

export type AccommodationTier = "platinum" | "gold" | "silver";
export type AccommodationPropertyType =
  | "lodge"
  | "hotel"
  | "boutique_hotel"
  | "camp"
  | "villa"
  | "retreat"
  | "other";

export interface SupplierDirectoryRecord {
  property_id: string;
  slug: string;
  name: string;
  tier: AccommodationTier;
  region: string;
  location: string | null;
  property_type: AccommodationPropertyType;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contracted: boolean;
  notes: string | null;
  active: boolean;
}

export interface SupplierDirectoryParseResult {
  records: SupplierDirectoryRecord[];
  warnings: string[];
}

interface SupplierDirectoryRow {
  property_id: string;
  region: string;
  area: string;
  name: string;
  property_type: string;
  tier: string;
  address: string;
  website_url: string;
  contact_name: string;
  contact_email: string;
  booking_email: string;
  contract_status: string;
  contract_expiry: string;
  notes: string;
  mp_notes: string;
  last_updated: string;
}

type SupplierColumn = keyof SupplierDirectoryRow;

const HEADER_ALIASES: Record<string, SupplierColumn> = {
  propertyid: "property_id",
  region: "region",
  area: "area",
  propertyname: "name",
  prpoertyname: "name",
  name: "name",
  propertytype: "property_type",
  tier: "tier",
  address: "address",
  website: "website_url",
  websiteurl: "website_url",
  keycontactname: "contact_name",
  contactname: "contact_name",
  contactemail: "contact_email",
  bookingemail: "booking_email",
  contractstatus: "contract_status",
  contractexpiry: "contract_expiry",
  contractexpirydate: "contract_expiry",
  notes: "notes",
  mpnotestrnotes: "mp_notes",
  lastupdated: "last_updated",
};

const websiteOverrides: Record<string, string> = {
  "rathmoy-estate-lodge": "https://www.rathmoy.co.nz/",
};

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function cleanName(value: unknown): string {
  return clean(value).replace(/[,\s]+$/g, "");
}

export function toAccommodationSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function headerKey(value: unknown): string {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normaliseTier(raw: string): AccommodationTier {
  const tier = clean(raw).toLowerCase();
  if (tier.startsWith("platinum")) return "platinum";
  if (tier.startsWith("gold")) return "gold";
  return "silver";
}

function normalisePropertyType(raw: string): AccommodationPropertyType {
  const type = clean(raw).toLowerCase();

  if (type.includes("camp") || type.includes("glamp")) return "camp";
  if (type.includes("lodge") || type.includes("station") || type.includes("fishing")) {
    return "lodge";
  }
  if (type.includes("boutique") || type.includes("b&b") || type.includes("bed and breakfast")) {
    return "boutique_hotel";
  }
  if (
    type.includes("villa") ||
    type.includes("hut") ||
    type.includes("residence") ||
    type.includes("exclusive-use") ||
    type.includes("private")
  ) {
    return "villa";
  }
  if (
    type.includes("retreat") ||
    type.includes("vineyard") ||
    type.includes("estate") ||
    type.includes("serviced apartment") ||
    type.includes("apartment")
  ) {
    return "retreat";
  }
  if (type.includes("hotel") || type.includes("resort") || type.includes("golf")) {
    return "hotel";
  }
  return "other";
}

function valueOrNull(value: string): string | null {
  const cleaned = clean(value);
  return cleaned || null;
}

function emailOrNull(value: string): string | null {
  const email = clean(value);
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function isContracted(statusValue: string): boolean {
  const status = clean(statusValue).toLowerCase();
  if (status.includes("awaiting contract")) return false;
  return (
    status.includes("secured") ||
    status.includes("contracted portal") ||
    status.includes("portal access confirmed")
  );
}

function isActive(statusValue: string): boolean {
  return !clean(statusValue).toLowerCase().includes("opening late 2027");
}

function buildNotes(row: SupplierDirectoryRow): string | null {
  const fragments = [
    clean(row.contract_status) ? `Contract status: ${clean(row.contract_status)}` : null,
    clean(row.contract_expiry) ? `Contract expiry: ${clean(row.contract_expiry)}` : null,
    clean(row.tier) ? `Original tier: ${clean(row.tier)}` : null,
    clean(row.property_type) ? `Original type: ${clean(row.property_type)}` : null,
    clean(row.address) ? `Address: ${clean(row.address)}` : null,
    emailOrNull(row.booking_email) ? `Booking email: ${emailOrNull(row.booking_email)}` : null,
    clean(row.last_updated) ? `Supplier directory last updated: ${clean(row.last_updated)}` : null,
    clean(row.notes) || null,
    clean(row.mp_notes) || null,
  ].filter(Boolean);

  return fragments.length ? fragments.join(" | ") : null;
}

function readRows(data: Uint8Array, fileName: string): unknown[][] {
  const isCsv = fileName.toLowerCase().endsWith(".csv");
  const workbook = isCsv
    ? XLSX.read(new TextDecoder().decode(data).replace(/^\uFEFF/, ""), {
        type: "string",
        raw: false,
      })
    : XLSX.read(data, { type: "array", raw: false });

  const sheetName = workbook.SheetNames.find(
    (name) => name.toLowerCase() === "supplier directory"
  ) ?? workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) throw new Error("The spreadsheet does not contain a worksheet.");

  return XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false,
  });
}

export function parseSupplierDirectory(
  data: Uint8Array,
  fileName: string
): SupplierDirectoryParseResult {
  const rows = readRows(data, fileName);
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => headerKey(cell) === "propertyid")
  );

  if (headerIndex < 0) {
    throw new Error('Could not find the required "Property ID" header.');
  }

  const columnIndexes = new Map<SupplierColumn, number>();
  rows[headerIndex].forEach((header, index) => {
    const column = HEADER_ALIASES[headerKey(header)];
    // The historical workbook contains a duplicate property-name column. Use the first.
    if (column && !columnIndexes.has(column)) columnIndexes.set(column, index);
  });

  for (const required of ["property_id", "name"] as const) {
    if (!columnIndexes.has(required)) {
      throw new Error(`The spreadsheet is missing the required "${required === "property_id" ? "Property ID" : "Property Name"}" column.`);
    }
  }

  const parsed: SupplierDirectoryRecord[] = [];
  const warnings: string[] = [];
  const seenPropertyIds = new Set<string>();

  for (let index = headerIndex + 1; index < rows.length; index += 1) {
    const source = rows[index];
    const value = (column: SupplierColumn) => clean(source[columnIndexes.get(column) ?? -1]);
    const row: SupplierDirectoryRow = {
      property_id: value("property_id").toUpperCase(),
      region: value("region"),
      area: value("area"),
      name: cleanName(value("name")),
      property_type: value("property_type"),
      tier: value("tier"),
      address: value("address"),
      website_url: value("website_url"),
      contact_name: value("contact_name"),
      contact_email: value("contact_email"),
      booking_email: value("booking_email"),
      contract_status: value("contract_status"),
      contract_expiry: value("contract_expiry"),
      notes: value("notes"),
      mp_notes: value("mp_notes"),
      last_updated: value("last_updated"),
    };

    if (!Object.values(row).some(Boolean)) continue;

    const excelRow = index + 1;
    if (!row.property_id) {
      warnings.push(`Row ${excelRow} was skipped because Property ID is missing.`);
      continue;
    }
    if (!row.name) {
      warnings.push(`Row ${excelRow} was skipped because Property Name is missing.`);
      continue;
    }
    if (seenPropertyIds.has(row.property_id)) {
      warnings.push(`Row ${excelRow} was skipped because Property ID "${row.property_id}" appears earlier in the file.`);
      continue;
    }
    seenPropertyIds.add(row.property_id);

    const slug = toAccommodationSlug(row.name) || toAccommodationSlug(row.property_id);
    parsed.push({
      property_id: row.property_id,
      slug,
      name: row.name,
      tier: normaliseTier(row.tier),
      region: row.region || "Unknown",
      location: valueOrNull(row.area),
      property_type: normalisePropertyType(row.property_type),
      website_url: websiteOverrides[slug] ?? valueOrNull(row.website_url),
      contact_name: valueOrNull(row.contact_name),
      contact_email: emailOrNull(row.contact_email) ?? emailOrNull(row.booking_email),
      contracted: isContracted(row.contract_status),
      notes: buildNotes(row),
      active: isActive(row.contract_status),
    });
  }

  if (!parsed.length) throw new Error("The spreadsheet does not contain any accommodation rows.");

  return { records: parsed, warnings };
}
