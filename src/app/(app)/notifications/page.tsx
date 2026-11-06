"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useNotifications } from "@/lib/mock/api";
import { PageHeader } from "@/components/app/PageHeader";
import { TableSkeleton } from "@/components/app/Skeleton";
import { EmptyState, ErrorState } from "@/components/app/StateViews";
import { formatRelativeTime } from "@/lib/mock/time";
import { Check, CheckCheck, Bell } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, loading, error, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const filteredNotifs = notifications.filter((n) =>
    filter === "UNREAD" ? !n.isRead : true
  );

  // Group notifications into Today and Earlier
  const today = new Date().toDateString();
  const todayNotifs = filteredNotifs.filter(
    (n) => new Date(n.createdAt).toDateString() === today
  );
  const earlierNotifs = filteredNotifs.filter(
    (n) => new Date(n.createdAt).toDateString() !== today
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Notifications"
          description="Updates on match cycles, partner confirmations, and deadline alerts."
        />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Notifications"
          description="Updates on match cycles, partner confirmations, and deadline alerts."
        />
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Notifications"
        description="Updates on match cycles, partner confirmations, and advising deadline alerts."
        action={
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-[#16231F]/20 text-xs font-semibold text-[#16231F] hover:bg-[#16231F]/5 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#16231F]/15 pb-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            filter === "ALL"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("UNREAD")}
          className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition ${
            filter === "UNREAD"
              ? "bg-[#1D5B4A] text-white"
              : "text-[#16231F]/70 hover:text-[#16231F]"
          }`}
        >
          Unread
        </button>
      </div>

      {filteredNotifs.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={
            filter === "UNREAD"
              ? "You have caught up with all your notifications."
              : "No notifications have been received yet."
          }
          icon={<Bell className="w-6 h-6" />}
        />
      ) : (
        <div className="space-y-6">
          {/* Today Group */}
          {todayNotifs.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#16231F]/50 px-1">
                Today
              </h2>
              <div className="space-y-2">
                {todayNotifs.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link}
                    onClick={() => markRead(n.id)}
                    className={`p-4 rounded-[10px] border transition flex items-start justify-between gap-4 block ${
                      !n.isRead
                        ? "bg-white border-[#1D5B4A]/40 font-semibold"
                        : "bg-white/80 border-[#16231F]/15 font-normal"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#1D5B4A] mt-1.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs sm:text-sm text-[#16231F]">{n.title}</p>
                        <p className="text-xs text-[#16231F]/70 mt-0.5">{n.description}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#16231F]/50 whitespace-nowrap shrink-0 font-mono">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Earlier Group */}
          {earlierNotifs.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#16231F]/50 px-1">
                Earlier
              </h2>
              <div className="space-y-2">
                {earlierNotifs.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link}
                    onClick={() => markRead(n.id)}
                    className={`p-4 rounded-[10px] border transition flex items-start justify-between gap-4 block ${
                      !n.isRead
                        ? "bg-white border-[#1D5B4A]/40 font-semibold"
                        : "bg-white/80 border-[#16231F]/15 font-normal"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#1D5B4A] mt-1.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs sm:text-sm text-[#16231F]">{n.title}</p>
                        <p className="text-xs text-[#16231F]/70 mt-0.5">{n.description}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#16231F]/50 whitespace-nowrap shrink-0 font-mono">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
