"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/mock/admin-store";
import { PageHeader } from "@/components/app/PageHeader";
import { Breadcrumbs } from "@/components/admin/AdminCommon";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { useToast } from "@/components/app/Toast";
import { parseAndValidateCSV, SAMPLE_CSV_CONTENT } from "@/lib/mock/csv";
import { ImportRow } from "@/types/admin";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
} from "lucide-react";

export default function SectionCSVImportPage() {
  const router = useRouter();
  const { dispatch } = useAdminStore();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csvRaw, setCsvRaw] = useState("");
  const [parsedData, setParsedData] = useState<{
    rows: ImportRow[];
    validCount: number;
    invalidCount: number;
  }>({ rows: [], validCount: 0, invalidCount: 0 });

  const [skipInvalid, setSkipInvalid] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [filterErrorsOnly, setFilterErrorsOnly] = useState(false);

  const handleProcessText = (text: string) => {
    setCsvRaw(text);
    const res = parseAndValidateCSV(text);
    setParsedData(res);
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast("Please select a .csv file", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessText(content);
    };
    reader.readAsText(file);
  };

  const handleUseSample = () => {
    handleProcessText(SAMPLE_CSV_CONTENT);
    toast("Loaded built-in sample CSV with valid and invalid rows");
  };

  const handleDownloadTemplate = () => {
    const element = document.createElement("a");
    const file = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "slotswap_section_import_template.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast("Downloaded CSV template");
  };

  const handleExecuteImport = () => {
    dispatch({ type: "IMPORT_SECTIONS", payload: parsedData.rows });
    toast(`Successfully imported ${parsedData.validCount} sections`);
    setStep(3);
  };

  const rowsToDisplay = filterErrorsOnly
    ? parsedData.rows.filter((r) => !r.isValid)
    : parsedData.rows;

  return (
    <div className="space-y-6 text-left">
      <div>
        <Breadcrumbs
          items={[
            { label: "Courses", href: "/admin/courses" },
            { label: "CSV Import" },
          ]}
        />
        <PageHeader
          title="Import Course Sections"
          description="Batch import university section offerings and time schedules from a registrar CSV file."
        />
      </div>

      {/* Stepper Indicator */}
      <div className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? "bg-[#1D5B4A] text-white" : "bg-[#16231F]/10 text-[#16231F]"
            }`}
          >
            1
          </span>
          <span>Upload CSV</span>
        </div>

        <ArrowRight className="w-4 h-4 text-[#16231F]/30" />

        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? "bg-[#1D5B4A] text-white" : "bg-[#16231F]/10 text-[#16231F]"
            }`}
          >
            2
          </span>
          <span>Validate & Preview</span>
        </div>

        <ArrowRight className="w-4 h-4 text-[#16231F]/30" />

        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step === 3 ? "bg-[#1D5B4A] text-white" : "bg-[#16231F]/10 text-[#16231F]"
            }`}
          >
            3
          </span>
          <span>Complete</span>
        </div>
      </div>

      {/* STEP 1: Upload */}
      {step === 1 && (
        <div className="p-8 rounded-[12px] bg-white border border-[#16231F]/15 space-y-6 text-center max-w-2xl mx-auto">
          <div className="border-2 border-dashed border-[#16231F]/20 rounded-[12px] p-8 flex flex-col items-center justify-center space-y-3">
            <UploadCloud className="w-10 h-10 text-[#1D5B4A]" />
            <h3 className="font-heading font-bold text-base text-[#16231F]">
              Drop your section CSV file here
            </h3>
            <p className="text-xs text-[#16231F]/60 max-w-sm">
              Accepts .csv up to 2 MB with headers (department, courseCode, courseTitle, section, facultyCode, room, capacity, slots).
            </p>

            <label className="cursor-pointer px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition mt-2">
              Browse computer
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 text-[#1D5B4A] font-semibold hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download sample template</span>
            </button>
            <span className="text-[#16231F]/30">·</span>
            <button
              type="button"
              onClick={handleUseSample}
              className="inline-flex items-center gap-1.5 text-[#16231F]/70 font-semibold hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Load sample demo file</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Validation & Review */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="p-4 rounded-[12px] bg-white border border-[#16231F]/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-base text-[#16231F]">
                {parsedData.validCount} rows valid, {parsedData.invalidCount} need fixing
              </p>
              <p className="text-xs text-[#16231F]/60 mt-0.5">
                Review parsed records below before committing to database.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterErrorsOnly}
                  onChange={(e) => setFilterErrorsOnly(e.target.checked)}
                  className="rounded accent-[#1D5B4A]"
                />
                <span>Show invalid rows only</span>
              </label>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
              >
                Choose another file
              </button>

              <button
                type="button"
                disabled={parsedData.validCount === 0}
                onClick={() => setConfirmModalOpen(true)}
                className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] disabled:bg-[#16231F]/20 text-white text-xs font-semibold transition"
              >
                Import {parsedData.validCount} valid sections
              </button>
            </div>
          </div>

          <div className="border border-[#16231F]/15 rounded-[12px] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F4F6F3] border-b border-[#16231F]/15 text-[#16231F]/70 font-semibold uppercase tracking-wider text-[11px] sticky top-0">
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Section</th>
                    <th className="py-2.5 px-3">Faculty</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Schedule</th>
                    <th className="py-2.5 px-3">Validation Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16231F]/10">
                  {rowsToDisplay.map((r) => (
                    <tr
                      key={r.rowNumber}
                      className={r.isValid ? "hover:bg-[#F4F6F3]/50" : "bg-[#F2C4C4]/15"}
                    >
                      <td className="py-2.5 px-3 font-mono text-[#16231F]/60">
                        {r.rowNumber}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                            r.isValid
                              ? "bg-[#C2E4CE] text-[#1D5B4A]"
                              : "bg-[#F2C4C4] text-[#D9381E]"
                          }`}
                        >
                          {r.isValid ? "VALID" : "INVALID"}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-bold">{r.courseCode}</td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold">
                        Sec {r.section}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{r.facultyCode}</td>
                      <td className="py-2.5 px-3 font-mono">{r.room}</td>
                      <td className="py-2.5 px-3 text-[11px]">
                        {r.day1} {r.time1} {r.day2 && `· ${r.day2} ${r.time2}`}
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">
                        {r.errors.length > 0 ? (
                          <span className="text-[#D9381E] font-semibold">
                            {r.errors.join("; ")}
                          </span>
                        ) : (
                          <span className="text-[#1D5B4A]">Ready to insert</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Complete */}
      {step === 3 && (
        <div className="p-8 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#C2E4CE] text-[#1D5B4A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-[#16231F]">
            Sections successfully imported
          </h2>
          <p className="text-xs text-[#16231F]/70">
            Created {parsedData.validCount} course sections. An audit entry has been logged.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/admin/courses"
              className="px-4 py-2 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold"
            >
              View updated courses
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setParsedData({ rows: [], validCount: 0, invalidCount: 0 });
              }}
              className="px-3.5 py-2 rounded-[8px] border border-[#16231F]/20 text-xs font-semibold"
            >
              Import another file
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleExecuteImport}
        title="Commit section import?"
        description={`This will create ${parsedData.validCount} sections across departments for Fall 2026. Invalid rows will be skipped.`}
        confirmLabel="Import sections"
      />
    </div>
  );
}
