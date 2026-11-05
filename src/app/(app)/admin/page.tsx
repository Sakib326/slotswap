"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building,
  GraduationCap,
  ArrowRightLeft,
  ShieldAlert,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    students: 0,
    admins: 0,
  });

  useEffect(() => {
    fetch("/api/admin/users?pageSize=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const items = data.items;
          setStats({
            totalUsers: data.total || items.length,
            activeUsers: items.filter((u: any) => u.status === "ACTIVE").length,
            students: items.filter((u: any) => u.role === "STUDENT").length,
            admins: items.filter((u: any) => u.role === "ADMIN").length,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-7xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#16231F]/15 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[4px] bg-[#F5E39B] text-[#16231F] text-xs font-semibold mb-2">
            <span>ADMINISTRATIVE PORTAL</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#16231F]">
            System Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#16231F]/70 mt-1">
            Institutional overview, course section quotas, advising controls, and student moderation.
          </p>
        </div>
      </div>

      {/* Overview Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
              Total Enrolled Students
            </span>
            <Users className="w-4 h-4 text-[#1D5B4A]" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-[#16231F] mt-2">
            {stats.totalUsers}
          </p>
          <p className="text-xs text-[#1D5B4A] mt-1">{stats.activeUsers} Active Accounts</p>
        </div>

        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
              Departments
            </span>
            <Building className="w-4 h-4 text-[#16231F]/70" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-[#16231F] mt-2">
            5 Departments
          </p>
          <p className="text-xs text-[#16231F]/60 mt-1">CSE, EEE, BBA, ENG, MAT</p>
        </div>

        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
              Advising Swaps
            </span>
            <ArrowRightLeft className="w-4 h-4 text-[#1D5B4A]" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-[#1D5B4A] mt-2">
            128 Cycles
          </p>
          <p className="text-xs text-[#1D5B4A] mt-1">94% Clash-Free Rate</p>
        </div>

        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#16231F]/60 uppercase tracking-wider">
              System Administrators
            </span>
            <UserCheck className="w-4 h-4 text-[#16231F]/70" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-[#16231F] mt-2">
            {stats.admins} Staff
          </p>
          <p className="text-xs text-[#16231F]/60 mt-1">Active role permissions</p>
        </div>
      </div>

      {/* Admin Modules Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: User Management */}
        <Link
          href="/admin/users"
          className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 hover:border-[#1D5B4A] transition group block shadow-sm"
        >
          <div className="w-10 h-10 rounded-[8px] bg-[#C2E4CE] text-[#16231F] flex items-center justify-center mb-4">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-lg text-[#16231F] group-hover:text-[#1D5B4A] transition">
              User Management
            </h3>
            <ArrowRight className="w-4 h-4 text-[#16231F]/40 group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-[#16231F]/70 leading-relaxed">
            Search registered students, review verification statuses, promote/demote administrator roles, and suspend violating accounts.
          </p>
        </Link>

        {/* Module 2: Section Demand & Advising Cycles */}
        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-sm">
          <div className="w-10 h-10 rounded-[8px] bg-[#F5E39B] text-[#16231F] flex items-center justify-center mb-4">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#16231F] mb-2">
            Swap Cycles & Demand
          </h3>
          <p className="text-xs text-[#16231F]/70 leading-relaxed mb-4">
            Inspect real-time bottleneck sections, high-demand advising times, and active multi-way swap resolution graphs.
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16231F]/40 bg-[#F4F6F3] px-2 py-1 rounded">
            Auto-managed by cycle engine
          </span>
        </div>

        {/* Module 3: Security & Audit Policy */}
        <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-6 shadow-sm">
          <div className="w-10 h-10 rounded-[8px] bg-[#F2C4C4] text-[#D9381E] flex items-center justify-center mb-4">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#16231F] mb-2">
            Security & Session Rules
          </h3>
          <p className="text-xs text-[#16231F]/70 leading-relaxed mb-4">
            Strict domain enforcement (@northsouth.edu), atomic session revocations, and rate limiting controls active.
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D5B4A] bg-[#C2E4CE] px-2 py-1 rounded">
            Policy Enforced
          </span>
        </div>
      </div>
    </div>
  );
}
