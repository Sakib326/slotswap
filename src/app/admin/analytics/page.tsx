"use client";

import React, { useState } from "react";
import { useAdminAnalytics } from "@/lib/mock/admin-api";
import { PageHeader } from "@/components/app/PageHeader";
import { StatLine } from "@/components/admin/AdminCommon";
import { TableSkeleton } from "@/components/app/Skeleton";
import { useToast } from "@/components/app/Toast";
import { Download, BarChart2, Table } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [rangeDays, setRangeDays] = useState(30);
  const [chartViewTable, setChartViewTable] = useState(false);
  const { analytics, loading } = useAdminAnalytics(rangeDays);
  const { toast } = useToast();

  const handleExportCSV = () => {
    let csv = "Section,Course,Requests,Capacity\n";
    for (const item of analytics.mostRequestedSections) {
      csv += `Sec ${item.sectionNumber},${item.courseCode},${item.requestCount},${item.capacity}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `slotswap_analytics_${rangeDays}d.csv`;
    a.click();
    toast("Exported analytics CSV");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Loading metrics..." />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  const maxDailyCount = Math.max(...analytics.swapsByDay.map((d) => d.count), 1);

  return (
    <div className="space-y-8 text-left">
      <PageHeader
        title="Institutional Analytics & Demand"
        description="Course bottleneck analysis, multi-way cycle resolution rates, and advising queue health."
        action={
          <div className="flex items-center gap-2">
            {/* Range selector */}
            <div className="flex p-0.5 bg-white border border-[#16231F]/15 rounded-[8px]">
              {[7, 30].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRangeDays(r)}
                  className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition ${
                    rangeDays === r
                      ? "bg-[#1D5B4A] text-white"
                      : "text-[#16231F]/70 hover:text-[#16231F]"
                  }`}
                >
                  Last {r} days
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#1D5B4A] text-white text-xs font-semibold hover:bg-[#164639]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* KPI Statlines */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatLine
          label="Requests Submitted"
          value={analytics.funnel.requestsCreated}
          subtext="+14% this advising term"
        />
        <StatLine
          label="Swaps Completed"
          value={analytics.funnel.completed}
          subtext="77% success completion rate"
        />
        <StatLine
          label="3-Way Closed Chains"
          value={analytics.swapTypeSplit.threeWay}
          subtext="37% of resolved cycles"
        />
        <StatLine
          label="Cancelled / Expired"
          value={analytics.funnel.cancelled + analytics.funnel.expired}
          subtext="Timeout or student decline"
        />
      </div>

      {/* Swaps Completed Over Time (Pure CSS / SVG Bar Chart) */}
      <div className="p-6 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#16231F]/10">
          <div>
            <h2 className="font-heading font-bold text-base text-[#16231F]">
              Swaps Completed Over Time
            </h2>
            <p className="text-xs text-[#16231F]/60">
              Daily successful section exchanges for the last {rangeDays} days.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setChartViewTable(!chartViewTable)}
            className="text-xs text-[#1D5B4A] font-semibold flex items-center gap-1 hover:underline"
          >
            {chartViewTable ? <BarChart2 className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
            <span>{chartViewTable ? "View as chart" : "View as table"}</span>
          </button>
        </div>

        {!chartViewTable ? (
          <div
            className="h-44 flex items-end gap-1.5 pt-6 pb-2"
            role="region"
            aria-label="Daily completed swaps bar chart"
          >
            {analytics.swapsByDay.map((d, i) => {
              const heightPct = Math.round((d.count / maxDailyCount) * 100);

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#1D5B4A] hover:bg-[#164639] rounded-t-[3px] transition"
                  />
                  <span className="text-[9px] font-mono text-[#16231F]/50 hidden sm:block truncate w-full text-center">
                    {d.date}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#16231F]/10 text-[#16231F]/60">
                  <th className="py-1">Date</th>
                  <th className="py-1 text-right">Completed Swaps</th>
                </tr>
              </thead>
              <tbody>
                {analytics.swapsByDay.map((d, idx) => (
                  <tr key={idx} className="border-b border-[#16231F]/5">
                    <td className="py-1 font-mono">{d.date}</td>
                    <td className="py-1 text-right font-bold tabular-nums">{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Analysis: Bottleneck Sections + Unmet Course Demand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Most Requested Sections */}
        <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
          <h2 className="font-heading font-bold text-base text-[#16231F]">
            High-Demand Bottleneck Sections
          </h2>
          <div className="space-y-3">
            {analytics.mostRequestedSections.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-[#16231F]">
                  <span>
                    {item.courseCode} · Section {item.sectionNumber}
                  </span>
                  <span className="text-[#1D5B4A] tabular-nums font-bold">
                    {item.requestCount} student requests
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F4F6F3] overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (item.requestCount / 25) * 100)}%` }}
                    className="h-full bg-[#1D5B4A] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unmet Demand Courses */}
        <div className="p-5 rounded-[12px] bg-white border border-[#16231F]/15 space-y-4">
          <h2 className="font-heading font-bold text-base text-[#16231F]">
            Courses with Unmet Demand
          </h2>
          <div className="divide-y divide-[#16231F]/10 text-xs">
            {analytics.unmetDemandCourses.map((c, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-sm text-[#16231F]">
                    {c.courseCode}
                  </span>
                  <p className="text-[11px] text-[#D9381E] font-medium">
                    {c.fullSectionsCount} sections full (0 seats left)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-[6px] bg-[#F5E39B] font-bold text-xs tabular-nums text-[#16231F]">
                  {c.openRequests} open requests
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
