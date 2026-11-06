import { ImportRow } from "@/types/admin";
import { DAYS } from "./colors";

const VALID_TIMES = [
  "08:30-10:00",
  "10:00-11:30",
  "11:30-13:00",
  "13:00-14:30",
  "14:30-16:00",
];

const VALID_DEPTS = ["CSE", "EEE", "BBA", "ENG", "MAT", "PHY"];

export function parseAndValidateCSV(csvText: string): {
  rows: ImportRow[];
  validCount: number;
  invalidCount: number;
} {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    return { rows: [], validCount: 0, invalidCount: 0 };
  }

  // Header is line 0: department,courseCode,courseTitle,credits,section,facultyName,facultyCode,room,capacity,day1,time1,day2,time2
  const rows: ImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(",").map((c) => c.trim());
    const errors: string[] = [];

    const dept = (rawCols[0] || "").toUpperCase();
    const courseCode = (rawCols[1] || "").toUpperCase();
    const courseTitle = rawCols[2] || "";
    const credits = parseFloat(rawCols[3] || "0");
    const sectionNum = parseInt(rawCols[4] || "0", 10);
    const facultyName = rawCols[5] || "";
    const facultyCode = (rawCols[6] || "").toUpperCase();
    const room = (rawCols[7] || "").toUpperCase();
    const capacity = parseInt(rawCols[8] || "0", 10);
    const day1 = (rawCols[9] || "").toUpperCase();
    const time1 = rawCols[10] || "";
    const day2 = rawCols[11] ? rawCols[11].toUpperCase() : undefined;
    const time2 = rawCols[12] || undefined;

    // Validation rules
    if (!VALID_DEPTS.includes(dept)) {
      errors.push(`Unknown department '${dept}'`);
    }
    if (!courseCode || courseCode.length < 3) {
      errors.push("Invalid course code");
    }
    if (!courseTitle || courseTitle.length < 3) {
      errors.push("Course title required (min 3 chars)");
    }
    if (isNaN(credits) || credits < 1 || credits > 4) {
      errors.push("Credits must be between 1 and 4");
    }
    if (isNaN(sectionNum) || sectionNum < 1 || sectionNum > 99) {
      errors.push("Section must be a number (1-99)");
    }
    if (!facultyCode || facultyCode.length < 2) {
      errors.push("Faculty short code required (e.g. MRK)");
    }
    if (!room) {
      errors.push("Room is required");
    }
    if (isNaN(capacity) || capacity < 1 || capacity > 200) {
      errors.push("Capacity must be between 1 and 200");
    }

    // Slot 1
    if (!DAYS.includes(day1 as any)) {
      errors.push(`Invalid day1 '${day1}'. Allowed: SUN, MON, TUE, WED, THU`);
    }
    if (!VALID_TIMES.includes(time1)) {
      errors.push(`Invalid time1 '${time1}'. Example: 08:30-10:00`);
    }

    // Slot 2 if specified
    if (day2) {
      if (!DAYS.includes(day2 as any)) {
        errors.push(`Invalid day2 '${day2}'`);
      }
      if (!time2 || !VALID_TIMES.includes(time2)) {
        errors.push(`Invalid time2 '${time2}'`);
      }
      if (day1 === day2 && time1 === time2) {
        errors.push("Slots overlap (day1 and day2 have identical time)");
      }
    }

    rows.push({
      rowNumber: i,
      department: dept,
      courseCode,
      courseTitle,
      credits,
      section: sectionNum,
      facultyName,
      facultyCode,
      room,
      capacity,
      day1,
      time1,
      day2,
      time2,
      isValid: errors.length === 0,
      errors,
    });
  }

  const validCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.filter((r) => !r.isValid).length;

  return { rows, validCount, invalidCount };
}

export const SAMPLE_CSV_CONTENT = `department,courseCode,courseTitle,credits,section,facultyName,facultyCode,room,capacity,day1,time1,day2,time2
CSE,CSE327,Software Engineering,3,7,Mohammad Rashed,MRK,SAC401,35,SUN,14:30-16:00,TUE,14:30-16:00
CSE,CSE311,Database Systems,3,4,Syeda Binte,SBD,LIB602,35,MON,08:30-10:00,WED,08:30-10:00
MAT,MAT216,Linear Algebra,3,4,Farzana Haque,FZH,NAC501,40,SUN,11:30-13:00,TUE,11:30-13:00
EEE,EEE141,Electrical Circuits I,3,1,Tanvir Alam,TVA,SAC201,30,MON,10:00-11:30,WED,10:00-11:30
BBA,MKT202,Principles of Marketing,3,5,Ahmed Shakil,ASK,NAC302,40,THU,08:30-10:00,THU,10:00-11:30
CS,CSE225,Data Structures,3,1,Nafis Hasan,NFH,SAC404,35,SUN,10:00-11:30,TUE,10:00-11:30
CSE,CSE231,Digital Logic Design,3,2,Kazi Shafiq,KSQ,SAC405,0,MON,13:00-14:30,WED,13:00-14:30
ENG,ENG102,Advanced Reading,3,3,Shaila M,SHM,NAC201,30,SUN,08:30-10:00,SUN,08:30-10:00`;
