"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { clinicConfig } from "@/config/clinicConfig";
import { generateAppointmentPdf } from "@/lib/generateAppointmentPdf";
import {
  Lock,
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Phone,
  MessageCircle,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  User,
  Download,
  Calendar,
  FileSpreadsheet,
  PlusCircle,
  X,
  Stethoscope,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface AppointmentRecord {
  id: string;
  bookingId: string;
  patientName: string;
  patientAge: string | null;
  patientGender: string | null;
  patientPhone: string;
  patientEmail: string | null;
  serviceId: string;
  serviceName: string;
  fee: string;
  appointmentDate: string;
  shift: string;
  timeSlot: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL"); // "ALL", "TODAY", "TOMORROW", or "YYYY-MM-DD"

  // Quick Walk-in Modal State
  const [showWalkinModal, setShowWalkinModal] = useState<boolean>(false);
  const [walkinName, setWalkinName] = useState<string>("");
  const [walkinAge, setWalkinAge] = useState<string>("");
  const [walkinGender, setWalkinGender] = useState<"Male" | "Female" | "Other">("Female");
  const [walkinPhone, setWalkinPhone] = useState<string>("");
  const [walkinServiceId, setWalkinServiceId] = useState<string>(clinicConfig.services[0].id);
  const [walkinDate, setWalkinDate] = useState<string>(getTodayString());
  const [walkinShift, setWalkinShift] = useState<"Morning Shift" | "Evening Shift">("Morning Shift");
  const [walkinSlot, setWalkinSlot] = useState<string>(clinicConfig.timings.shifts.morning.slots[0]);
  const [walkinNotes, setWalkinNotes] = useState<string>("");
  const [walkinError, setWalkinError] = useState<string>("");
  const [isSubmittingWalkin, setIsSubmittingWalkin] = useState<boolean>(false);

  // Local date calculation helper
  function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function getTomorrowString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // Check authentication from cookie and localStorage on mount
  useEffect(() => {
    const hasLocalStorageAuth = typeof window !== "undefined" && localStorage.getItem("amulya_admin_auth") === "true";
    const hasCookieAuth = typeof document !== "undefined" && document.cookie.includes("amulya_admin_session=authenticated");

    if (hasLocalStorageAuth || hasCookieAuth) {
      setIsAuthenticated(true);
      fetchAppointments();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("amulya_admin_auth", "true");
        fetchAppointments();
      } else {
        setLoginError(data.error || "Incorrect admin password.");
      }
    } catch (err: any) {
      setLoginError("Failed to authenticate. Please check connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    localStorage.removeItem("amulya_admin_auth");
    if (typeof document !== "undefined") {
      document.cookie = "amulya_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (res.ok && data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus as any } : app))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteAppointment = async (id: string, patientName: string) => {
    if (!confirm(`Are you sure you want to permanently delete appointment for "${patientName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((app) => app.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);
    }
  };

  // CSV Export Function
  const exportToCsv = (recordsToExport: AppointmentRecord[], label: string) => {
    if (recordsToExport.length === 0) {
      alert("No appointments available to export.");
      return;
    }

    const headers = [
      "Booking ID",
      "Patient Name",
      "Age",
      "Gender",
      "Phone Number",
      "Email Address",
      "Selected Treatment",
      "Fee",
      "Appointment Date",
      "Shift",
      "Time Slot",
      "Status",
      "Symptoms / Notes",
      "Booking Timestamp",
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = recordsToExport.map((a) => [
      escapeCsv(a.bookingId),
      escapeCsv(a.patientName),
      escapeCsv(a.patientAge || "N/A"),
      escapeCsv(a.patientGender || "N/A"),
      escapeCsv(a.patientPhone),
      escapeCsv(a.patientEmail || ""),
      escapeCsv(a.serviceName),
      escapeCsv(a.fee),
      escapeCsv(a.appointmentDate),
      escapeCsv(a.shift),
      escapeCsv(a.timeSlot),
      escapeCsv(a.status),
      escapeCsv(a.notes || ""),
      escapeCsv(new Date(a.createdAt).toLocaleString("en-IN")),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = getTodayString();
    link.setAttribute("href", url);
    link.setAttribute("download", `Amulya_Clinic_Patients_${label}_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Quick Walk-in Submission
  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkinError("");

    if (!walkinName.trim()) {
      setWalkinError("Please enter patient name.");
      return;
    }
    if (!walkinPhone.trim() || walkinPhone.replace(/\D/g, "").length < 10) {
      setWalkinError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmittingWalkin(true);
    const srv = clinicConfig.services.find((s) => s.id === walkinServiceId) || clinicConfig.services[0];

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: walkinName.trim(),
          patientAge: walkinAge.trim() || null,
          patientGender: walkinGender,
          patientPhone: walkinPhone.trim(),
          serviceId: srv.id,
          serviceName: srv.name,
          fee: srv.fee,
          appointmentDate: walkinDate,
          shift: walkinShift,
          timeSlot: walkinSlot,
          notes: walkinNotes.trim() ? `[Walk-in] ${walkinNotes.trim()}` : "[Walk-in Consultation]",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book walk-in appointment.");
      }

      // Add to list and close
      setAppointments((prev) => [data.appointment, ...prev]);
      setShowWalkinModal(false);
      setWalkinName("");
      setWalkinAge("");
      setWalkinPhone("");
      setWalkinNotes("");
    } catch (err: any) {
      setWalkinError(err.message || "Failed to book slot.");
    } finally {
      setIsSubmittingWalkin(false);
    }
  };

  // -------------------------------------------------------------
  // Filter & Stats Calculations
  // -------------------------------------------------------------
  const todayStr = getTodayString();
  const tomorrowStr = getTomorrowString();

  // Top Summary Metrics
  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.appointmentDate === todayStr),
    [appointments, todayStr]
  );

  const upcomingAppointments = useMemo(
    () => appointments.filter((a) => a.appointmentDate >= todayStr && a.status === "CONFIRMED"),
    [appointments, todayStr]
  );

  const completedVisits = useMemo(
    () => appointments.filter((a) => a.status === "COMPLETED"),
    [appointments]
  );

  const cancelledCount = useMemo(
    () => appointments.filter((a) => a.status === "CANCELLED"),
    [appointments]
  );

  // Filtered Appointments Table Data (Sorted newest/upcoming first)
  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (a) =>
          (a.bookingId && a.bookingId.toLowerCase().includes(q)) ||
          a.patientName.toLowerCase().includes(q) ||
          a.patientPhone.includes(q) ||
          a.serviceName.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      list = list.filter((a) => a.status === statusFilter);
    }

    // Date filter
    if (dateFilter === "TODAY") {
      list = list.filter((a) => a.appointmentDate === todayStr);
    } else if (dateFilter === "TOMORROW") {
      list = list.filter((a) => a.appointmentDate === tomorrowStr);
    } else if (dateFilter !== "ALL") {
      list = list.filter((a) => a.appointmentDate === dateFilter);
    }

    // Sort newest/upcoming first (by appointmentDate desc, then createdAt desc)
    list.sort((a, b) => {
      if (a.appointmentDate !== b.appointmentDate) {
        return b.appointmentDate.localeCompare(a.appointmentDate);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [appointments, searchTerm, statusFilter, dateFilter, todayStr, tomorrowStr]);

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-teal-100 relative overflow-hidden">
          {/* Top Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 to-emerald-500" />

          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-sm border border-teal-200">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-xs uppercase tracking-widest font-black text-teal-700 block">
              {clinicConfig.clinicName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Staff & Doctor Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Enter the authorized clinic admin password to access patient records, timings, and schedules.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter clinic password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none pr-10"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Configured in <code>clinicConfig.ts</code></span>
                <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  amulya@admin2026
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-teal-700/20 transition-all active:scale-[0.99] disabled:opacity-70"
            >
              {isLoggingIn ? "Authenticating Session..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clinic Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation & Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Return to Public Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {clinicConfig.clinicName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Doctor: {clinicConfig.doctor.name} &bull; SQLite Database Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Walk-in Button */}
            <button
              onClick={() => setShowWalkinModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Walk-in Patient</span>
            </button>

            <button
              onClick={fetchAppointments}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh Appointment List"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow w-full">
        
        {/* ========================================================================= */}
        {/* DASHBOARD OVERVIEW: SUMMARY CARDS                                         */}
        {/* ========================================================================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Clinic Overview
              </h2>
              <p className="text-xs text-slate-500">
                Live consultation counters for today ({todayStr})
              </p>
            </div>

            {/* Mobile walkin shortcut */}
            <button
              onClick={() => setShowWalkinModal(true)}
              className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Walk-in</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Today's Appointments */}
            <div className="bg-white p-5 rounded-2xl border-2 border-teal-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-100/50 rounded-bl-full pointer-events-none" />
              <div>
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                  Today&apos;s Appointments
                </span>
                <span className="text-3xl font-black text-teal-950 mt-1 block">
                  {todayAppointments.length}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-teal-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Scheduled Today</span>
                <button
                  onClick={() => setDateFilter("TODAY")}
                  className="font-bold text-teal-700 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Filter</span> &rarr;
                </button>
              </div>
            </div>

            {/* Card 2: Total Upcoming Appointments */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Upcoming Appointments
                </span>
                <span className="text-3xl font-black text-emerald-950 mt-1 block">
                  {upcomingAppointments.length}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">From Today Onward</span>
                <button
                  onClick={() => {
                    setDateFilter("ALL");
                    setStatusFilter("CONFIRMED");
                  }}
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>View</span> &rarr;
                </button>
              </div>
            </div>

            {/* Card 3: Completed Visits */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Completed Visits
                </span>
                <span className="text-3xl font-black text-slate-800 mt-1 block">
                  {completedVisits.length}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Consulted Patients</span>
                <button
                  onClick={() => setStatusFilter("COMPLETED")}
                  className="font-bold text-slate-700 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Filter</span> &rarr;
                </button>
              </div>
            </div>

            {/* Card 4: Total Bookings / Cancelled */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Registered
                </span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {appointments.length}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-rose-600 font-medium">
                  {cancelledCount.length} Cancelled
                </span>
                <button
                  onClick={() => {
                    setDateFilter("ALL");
                    setStatusFilter("ALL");
                    setSearchTerm("");
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Show All
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* APPOINTMENTS CONTROLS & FILTER BAR                                        */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search patient name, phone, or Booking ID (e.g. APT-2026)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  &times; Clear
                </button>
              )}
            </div>

            {/* Export and Action CTAs */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Export Day's List Button */}
              <button
                onClick={() => exportToCsv(todayAppointments, "Today")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-colors"
                title="Download today's scheduled patient list as CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                <span>Export Today&apos;s CSV</span>
              </button>

              {/* Export Currently Filtered Button */}
              <button
                onClick={() => exportToCsv(filteredAppointments, "Filtered")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors"
                title="Download currently filtered list as CSV"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Export Table CSV ({filteredAppointments.length})</span>
              </button>
            </div>

          </div>

          {/* Secondary Filter Row: Date & Status Filters */}
          <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            
            {/* Date Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Date:
              </span>
              <button
                onClick={() => setDateFilter("ALL")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dateFilter === "ALL"
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter("TODAY")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dateFilter === "TODAY"
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Today ({todayAppointments.length})
              </button>
              <button
                onClick={() => setDateFilter("TOMORROW")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  dateFilter === "TOMORROW"
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tomorrow
              </button>
              
              {/* Specific Custom Date Picker */}
              <input
                type="date"
                value={dateFilter !== "ALL" && dateFilter !== "TODAY" && dateFilter !== "TOMORROW" ? dateFilter : ""}
                onChange={(e) => setDateFilter(e.target.value || "ALL")}
                className="py-1 px-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-xs focus:ring-1 focus:ring-teal-500"
                title="Filter by specific date"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-teal-600" />
                Status:
              </span>
              {["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    statusFilter === st
                      ? "bg-teal-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* APPOINTMENTS TABLE                                                        */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Patient Bookings Registry
              </h3>
              <p className="text-xs text-slate-500">
                Showing {filteredAppointments.length} of {appointments.length} appointments (newest/upcoming first)
              </p>
            </div>

            {(searchTerm || statusFilter !== "ALL" || dateFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setDateFilter("ALL");
                }}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-500">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">
                No matching appointments found
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No bookings match your current search and filter settings. Try clearing the filters or add a walk-in patient.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setDateFilter("ALL");
                }}
                className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="py-3.5 px-4 font-bold">Booking ID</th>
                    <th className="py-3.5 px-4 font-bold">Patient Details</th>
                    <th className="py-3.5 px-4 font-bold">Contact (Call / WA)</th>
                    <th className="py-3.5 px-4 font-bold">Selected Service</th>
                    <th className="py-3.5 px-4 font-bold">Date & Time Slot</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-teal-50/30 transition-colors group"
                    >
                      {/* 1. Booking ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap align-top">
                        <span className="font-mono text-xs font-black text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 block w-fit">
                          {app.bookingId}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Booked: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* 2. Patient Name, Age, Gender */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-extrabold text-slate-900 block leading-tight">
                          {app.patientName}
                        </span>
                        <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                          {app.patientAge ? `${app.patientAge} Yrs` : "Age N/A"} &bull; {app.patientGender || "Gender N/A"}
                        </span>
                        {app.notes && (
                          <span
                            className="text-[11px] text-slate-500 italic block mt-1 max-w-xs truncate"
                            title={app.notes}
                          >
                            &ldquo;{app.notes}&rdquo;
                          </span>
                        )}
                      </td>

                      {/* 3. Phone Number with Call & WhatsApp icons */}
                      <td className="py-3.5 px-4 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${app.patientPhone}`}
                            className="inline-flex items-center gap-1 text-slate-800 hover:text-teal-700 font-bold text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors"
                            title="Call Patient Directly"
                          >
                            <Phone className="w-3.5 h-3.5 text-teal-600" />
                            <span>{app.patientPhone}</span>
                          </a>

                          <a
                            href={`https://wa.me/${app.patientPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(app.patientName)},%20this%20is%20${encodeURIComponent(clinicConfig.clinicName)}%20regarding%20your%20appointment%20(${app.bookingId})%20on%20${app.appointmentDate}%20at%20${app.timeSlot}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            title="Open WhatsApp Chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        {app.patientEmail && (
                          <span className="text-[11px] text-slate-400 block mt-1">
                            {app.patientEmail}
                          </span>
                        )}
                      </td>

                      {/* 4. Selected Service & Fee */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-slate-900 block leading-snug">
                          {app.serviceName}
                        </span>
                        <span className="text-xs font-black text-teal-700 mt-0.5 block">
                          {app.fee}
                        </span>
                      </td>

                      {/* 5. Date & Time Slot */}
                      <td className="py-3.5 px-4 whitespace-nowrap align-top">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.appointmentDate}</span>
                          {app.appointmentDate === todayStr && (
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              Today
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-600 block mt-0.5 font-medium">
                          {app.timeSlot}{" "}
                          <span className="text-[10px] text-slate-400">
                            ({app.shift.replace(" Shift", "")})
                          </span>
                        </span>
                      </td>

                      {/* 6. Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-wide ${
                            app.status === "CONFIRMED"
                              ? "bg-teal-50 text-teal-800 border border-teal-200"
                              : app.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {app.status === "CONFIRMED" && <CheckCircle2 className="w-3 h-3 text-teal-600" />}
                          {app.status === "COMPLETED" && <Check className="w-3 h-3 text-emerald-600" />}
                          {app.status === "CANCELLED" && <XCircle className="w-3 h-3 text-rose-600" />}
                          {app.status}
                        </span>
                      </td>

                      {/* 7. Admin Actions: Status update, PDF Slip, Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap align-top">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Status Toggles */}
                          {app.status !== "CONFIRMED" && (
                            <button
                              onClick={() => updateStatus(app.id, "CONFIRMED")}
                              className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
                              title="Mark Confirmed"
                            >
                              Confirm
                            </button>
                          )}
                          {app.status !== "COMPLETED" && (
                            <button
                              onClick={() => updateStatus(app.id, "COMPLETED")}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                              title="Mark Completed"
                            >
                              Complete
                            </button>
                          )}
                          {app.status !== "CANCELLED" && (
                            <button
                              onClick={() => updateStatus(app.id, "CANCELLED")}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                              title="Cancel Appointment"
                            >
                              Cancel
                            </button>
                          )}

                          {/* Download Patient Slip Button */}
                          <button
                            onClick={() => generateAppointmentPdf(app)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                            title="Download Appointment Slip (PDF)"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Delete Entry */}
                          <button
                            onClick={() => deleteAppointment(app.id, app.patientName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete test/cancelled entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* ========================================================================= */}
      {/* QUICK WALK-IN PATIENT MODAL                                               */}
      {/* ========================================================================= */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-teal-200 text-xs font-bold uppercase tracking-wider block">
                  Quick Registration
                </span>
                <h3 className="text-xl font-black">
                  Add Walk-in Patient
                </h3>
              </div>
              <button
                onClick={() => setShowWalkinModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkinSubmit} className="p-5 sm:p-6 space-y-4">
              {walkinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{walkinError}</span>
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment / Service
                </label>
                <select
                  value={walkinServiceId}
                  onChange={(e) => setWalkinServiceId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {clinicConfig.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.name} ({s.fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name..."
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 32"
                    value={walkinAge}
                    onChange={(e) => setWalkinAge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={walkinGender}
                    onChange={(e) => setWalkinGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number..."
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Date & Shift */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shift
                  </label>
                  <select
                    value={walkinShift}
                    onChange={(e) => {
                      const newShift = e.target.value as any;
                      setWalkinShift(newShift);
                      setWalkinSlot(
                        newShift === "Morning Shift"
                          ? clinicConfig.timings.shifts.morning.slots[0]
                          : clinicConfig.timings.shifts.evening.slots[0]
                      );
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Evening Shift">Evening Shift</option>
                  </select>
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Time Slot
                </label>
                <select
                  value={walkinSlot}
                  onChange={(e) => setWalkinSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {(walkinShift === "Morning Shift"
                    ? clinicConfig.timings.shifts.morning.slots
                    : clinicConfig.timings.shifts.evening.slots
                  ).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Symptoms / Reception Note
                </label>
                <input
                  type="text"
                  placeholder="Optional walk-in reason..."
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWalkin}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-60"
                >
                  {isSubmittingWalkin ? "Registering..." : "Confirm Walk-in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <span>{clinicConfig.clinicName} Administrative System &bull; Secure Local Database</span>
      </footer>
    </div>
  );
}
