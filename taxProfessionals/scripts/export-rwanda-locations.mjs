import fs from "node:fs/promises";
import path from "node:path";
import { rwandaLocation } from "@devrw/rwanda-location";

const provinces = rwandaLocation.getProvinces();
const districts = rwandaLocation.getDistricts();
const sectors = rwandaLocation.getSectors();
const cells = rwandaLocation.getCells();
const villages = rwandaLocation.getVillages();

const provinceByCode = new Map(provinces.map((p) => [Number(p.code), p]));
const districtByCode = new Map(districts.map((d) => [Number(d.code), d]));
const sectorByCode = new Map(sectors.map((s) => [String(s.code), s]));
const cellByCode = new Map(cells.map((c) => [Number(c.code), c]));

const records = [
  ...provinces.map((p) => ({
    code: `RW-P-${String(p.code).padStart(2, "0")}`,
    name: p.name,
    type: "PROVINCE",
    parentCode: null,
  })),
  ...districts.map((d) => ({
    code: `RW-D-${String(d.code).padStart(3, "0")}`,
    name: d.name,
    type: "DISTRICT",
    parentCode: `RW-P-${String(d.provinceCode).padStart(2, "0")}`,
  })),
  ...sectors.map((s) => ({
    code: `RW-S-${String(s.code).padStart(6, "0")}`,
    name: s.name,
    type: "SECTOR",
    parentCode: `RW-D-${String(s.districtCode).padStart(3, "0")}`,
  })),
  ...cells.map((c) => ({
    code: `RW-C-${String(c.code).padStart(7, "0")}`,
    name: c.name,
    type: "CELL",
    parentCode: `RW-S-${String(c.sectorCode).padStart(6, "0")}`,
  })),
  ...villages.map((v) => ({
    code: `RW-V-${String(v.code).padStart(9, "0")}`,
    name: v.name,
    type: "VILLAGE",
    parentCode: `RW-C-${String(v.cellCode).padStart(7, "0")}`,
  })),
];

for (const district of districts) {
  if (!provinceByCode.has(Number(district.provinceCode))) {
    throw new Error(`Missing province for district ${district.name}`);
  }
}

for (const sector of sectors) {
  if (!districtByCode.has(Number(sector.districtCode))) {
    throw new Error(`Missing district for sector ${sector.name}`);
  }
}

for (const cell of cells) {
  if (!sectorByCode.has(String(cell.sectorCode))) {
    throw new Error(`Missing sector for cell ${cell.name}`);
  }
}

for (const village of villages) {
  if (!cellByCode.has(Number(village.cellCode))) {
    throw new Error(`Missing cell for village ${village.name}`);
  }
}

const outputPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "taxprofessionals",
  "src",
  "main",
  "resources",
  "rwanda-locations-seed.json"
);

await fs.writeFile(outputPath, JSON.stringify(records, null, 2), "utf8");

console.log(`Generated ${records.length} location records at ${outputPath}`);
