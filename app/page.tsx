"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { initialRawProjects, RawProject } from "./initialProjects";
import { supabase } from "@/lib/supabaseClient";

type Project = {
  group: string;
  originalGroup?: string;
  title: string;
  students: string[];
  feasibility?: string;
  architecture?: string;
  report?: string;
  virtualLab?: string;
};

// Helper function to map raw API/sheet rows to projects
function mapRawProjects(data: RawProject[]): Project[] {
  return data.map((item, index) => {
    const fallbackTitle = item.title || `Group ${index + 1} Project`;
    const itemAny = item as Record<string, any>;
    const dynamicTitle =
      (typeof itemAny["title"] === "string" && itemAny["title"].trim()) ||
      (typeof itemAny["Title"] === "string" && itemAny["Title"].trim()) ||
      (typeof itemAny["projectTitle"] === "string" && itemAny["projectTitle"].trim()) ||
      (typeof itemAny["Project Title"] === "string" && itemAny["Project Title"].trim()) ||
      (typeof itemAny["project_title"] === "string" && itemAny["project_title"].trim()) ||
      (typeof itemAny["topic"] === "string" && itemAny["topic"].trim()) ||
      "";

    const resolvedTitle = dynamicTitle || fallbackTitle;
    const cleanGroup = String(index + 1);

    return {
      group: cleanGroup,
      originalGroup: item.group ? String(item.group) : cleanGroup,
      title: resolvedTitle,
      students: [item.student1, item.student2].filter(
        (student): student is string => Boolean(student && student.trim())
      ),
      virtualLab: item.virtualLab || "",
      feasibility: item.feasibility || "",
      architecture: item.architecture || "",
      report: item.report || "",
    };
  });
}

// High-Quality Erlenmeyer Chemistry Laboratory Flask Icon (Matching Image 2)
function LabFlaskIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.45))" }}
    >
      <defs>
        <linearGradient id="flaskLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="flaskGlassGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Liquid inside flask */}
      <path
        d="M9.5 9.5L4.4 17.8C3.8 18.8 4.5 20.1 5.7 20.1H18.3C19.5 20.1 20.2 18.8 19.6 17.8L14.5 9.5H9.5Z"
        fill="url(#flaskLiquidGrad)"
      />
      {/* Liquid surface wave */}
      <path
        d="M6.6 15C8.5 14.3 11 15.6 13.5 15.1C15 14.8 16.5 15.2 17.4 15.6"
        stroke="#FEF08A"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Internal bubbles */}
      <circle cx="10" cy="17.2" r="1.1" fill="#FEF9C3" opacity="0.9" />
      <circle cx="14" cy="18" r="0.9" fill="#FEF9C3" opacity="0.8" />
      <circle cx="12" cy="16.2" r="0.7" fill="#FEF9C3" opacity="0.9" />
      {/* Flask outline & neck */}
      <path
        d="M9 2.5H15M10 2.5V8.5L3.8 18.2C3 19.5 3.9 21.2 5.5 21.2H18.5C20.1 21.2 21 19.5 20.2 18.2L14 8.5V2.5"
        stroke="url(#flaskGlassGlow)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Specular glass reflection */}
      <path
        d="M10 5.5V8.2L6 14.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

// 3D Flippable Instagram-style Avatar (Default Image on front, Monogram Logo on back)
function FlippableProfileAvatar({
  imageSrc,
  name,
  monogram,
  gradientClass,
  sizeClass = "w-16 h-16 sm:w-18 sm:h-18",
  ringClass = "ring-rose-100",
  shadowClass = "shadow-[#8B1E2D]/35",
  imgPosition = "object-center",
  textClass = "text-xl",
}: {
  imageSrc: string;
  name: string;
  monogram: string;
  gradientClass: string;
  sizeClass?: string;
  ringClass?: string;
  shadowClass?: string;
  imgPosition?: string;
  textClass?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      title="Click to flip (Photo ↔ Monogram)"
      aria-label={`Flip profile avatar for ${name}`}
      onClick={(e) => {
        e.stopPropagation();
        setFlipped((f) => !f);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          setFlipped((f) => !f);
        }
      }}
      className={`relative ${sizeClass} cursor-pointer select-none shrink-0 group/avatar rounded-2xl transition-transform duration-300 hover:scale-105 active:scale-95`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Face: Real Photo (Default Visible) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-lg ${shadowClass} ring-4 ${ringClass} bg-gray-100`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Image
            src={imageSrc}
            alt={name}
            width={160}
            height={160}
            className={`w-full h-full object-cover ${imgPosition}`}
            priority
          />
          {/* Subtle Instagram-style flip badge icon */}
          <div
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] flex items-center justify-center font-bold shadow-xs border border-white/20 transition-transform duration-300 group-hover/avatar:scale-110"
            title="Flip to logo"
          >
            ↻
          </div>
        </div>

        {/* Back Face: Monogram Logo (Visible on Flip) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br ${gradientClass} text-white font-black ${textClass} flex items-center justify-center shadow-lg ${shadowClass} ring-4 ${ringClass}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="tracking-wider">{monogram}</span>
          {/* Subtle Instagram-style flip badge icon */}
          <div
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/25 backdrop-blur-xs text-white text-[10px] flex items-center justify-center font-bold shadow-xs border border-white/30 transition-transform duration-300 group-hover/avatar:scale-110"
            title="Flip to photo"
          >
            ↺
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // Pre-seed state with initialRawProjects so page is NEVER empty on initial render
  const [projects, setProjects] = useState<Project[]>(() =>
    mapRawProjects(initialRawProjects)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Synced");
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [documentFilter, setDocumentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check Supabase session & local demo session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        const local = typeof window !== "undefined" ? localStorage.getItem("vl_connect_user") || localStorage.getItem("designsphere_user") || localStorage.getItem("projectsphere_user") : null;
        if (local) {
          try {
            setCurrentUser(JSON.parse(local));
          } catch {}
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        const local = typeof window !== "undefined" ? localStorage.getItem("vl_connect_user") || localStorage.getItem("designsphere_user") || localStorage.getItem("projectsphere_user") : null;
        if (local) {
          try {
            setCurrentUser(JSON.parse(local));
          } catch {}
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to dynamically sync latest rows from Supabase / Google Sheet
  const syncWithSheet = async (forceFresh = false) => {
    try {
      setIsRefreshing(true);
      const url = forceFresh
        ? `/api/projects?fresh=true&_t=${Date.now()}`
        : `/api/projects?_t=${Date.now()}`;
      const response = await fetch(url, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!response.ok) {
        throw new Error("Unable to sync latest projects.");
      }

      const data: RawProject[] = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setProjects(mapRawProjects(data));
        setLoadError("");
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (error) {
      console.error("Sheet sync note:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync on initial mount, and auto-poll every 45s
  useEffect(() => {
    syncWithSheet(false);

    const intervalId = setInterval(() => {
      syncWithSheet(false);
    }, 45000);

    return () => clearInterval(intervalId);
  }, []);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const list = projects;
    const withLab = list.filter((p) => p.virtualLab && p.virtualLab.trim()).length;
    const withArch = list.filter((p) => p.architecture && p.architecture.trim()).length;
    const withFeas = list.filter((p) => p.feasibility && p.feasibility.trim()).length;
    const withReport = list.filter((p) => p.report && p.report.trim()).length;
    const fullyComplete = list.filter(
      (p) =>
        p.virtualLab &&
        p.virtualLab.trim() &&
        p.architecture &&
        p.architecture.trim() &&
        p.feasibility &&
        p.feasibility.trim() &&
        p.report &&
        p.report.trim()
    ).length;

    const totalStudents = list.reduce(
      (acc, p) => acc + (p.students ? p.students.length : 0),
      0
    );

    return {
      total: list.length,
      withLab,
      withArch,
      withFeas,
      withReport,
      fullyComplete,
      totalStudents,
    };
  }, [projects]);

  // Search & Document Filters applied over all projects
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const displayGroup = project.group;
      const paddedGroup = displayGroup.padStart(2, "0");

      const matchesSearch =
        !query ||
        displayGroup === query ||
        paddedGroup === query ||
        project.title.toLowerCase().includes(query) ||
        project.group.toLowerCase().includes(query) ||
        Boolean(
          project.originalGroup &&
            project.originalGroup.toLowerCase().includes(query)
        ) ||
        project.students.some((student) =>
          student.toLowerCase().includes(query)
        );

      if (!matchesSearch) return false;

      if (documentFilter === "lab") {
        return Boolean(project.virtualLab && project.virtualLab.trim());
      }
      if (documentFilter === "architecture") {
        return Boolean(project.architecture && project.architecture.trim());
      }
      if (documentFilter === "feasibility") {
        return Boolean(project.feasibility && project.feasibility.trim());
      }
      if (documentFilter === "report") {
        return Boolean(project.report && project.report.trim());
      }
      if (documentFilter === "complete") {
        return Boolean(
          project.virtualLab &&
            project.virtualLab.trim() &&
            project.architecture &&
            project.architecture.trim() &&
            project.feasibility &&
            project.feasibility.trim() &&
            project.report &&
            project.report.trim()
        );
      }

      return true;
    });
  }, [projects, search, documentFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1E2024]">
      {/* 1. Official VESIT Autonomous Top Header Bar */}
      <div className="bg-[#6E121E] text-white text-xs py-2 px-4 border-b border-[#540D17]">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="font-bold">
              VIVEKANAND EDUCATION SOCIETY&apos;S INSTITUTE OF TECHNOLOGY (AUTONOMOUS)
            </span>
            <span className="hidden md:inline text-white/50">|</span>
            <span className="hidden md:inline text-amber-200 font-semibold">
              Department of Computer Engineering
            </span>
            <span className="hidden lg:inline text-white/50">|</span>
            <span className="hidden lg:inline text-white/80">
              Affiliated to University of Mumbai • Approved by AICTE • NAAC &apos;A&apos; Grade
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Autonomous Institute
            </span>
            <a
              href="https://vesit.ves.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-200 transition underline underline-offset-2"
            >
              vesit.ves.ac.in ↗
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header: DesignSphere Brand */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Official VESIT Crest & DesignSphere Brand */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative h-12 w-36 sm:h-14 sm:w-48">
                <Image
                  src="/vesit-logo.png"
                  alt="VESIT Institutional Logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 144px, 192px"
                  className="object-contain"
                />
              </div>

              <div className="hidden sm:block h-10 w-px bg-gray-200 mx-1" />

              {/* DesignSphere Logo */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative h-11 w-44">
                  <Image
                    src="/designsphere-logo.png"
                    alt="DesignSphere - Connecting Ideas, Projects, People"
                    fill
                    priority
                    sizes="176px"
                    className="object-contain object-left"
                  />
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8B1E2D]/10 text-[#8B1E2D] uppercase tracking-wider">
                      STUDENT LABS
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">
                    Department of Computer Engineering
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Navigation Links, Auth Badge & Action Button */}
            <div className="flex items-center gap-4">
              <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-700">
                <a
                  href="#projects"
                  className="hover:text-[#8B1E2D] transition py-1 border-b-2 border-transparent hover:border-[#8B1E2D]"
                >
                  Projects ({projects.length})
                </a>
                <a
                  href="#guidance"
                  className="hover:text-[#8B1E2D] transition py-1 border-b-2 border-transparent hover:border-[#8B1E2D]"
                >
                  Faculty Mentors
                </a>
                <a
                  href="#about"
                  className="hover:text-[#8B1E2D] transition py-1 border-b-2 border-transparent hover:border-[#8B1E2D]"
                >
                  About VESIT
                </a>
              </nav>

              <div className="h-6 w-px bg-gray-200 hidden lg:block" />

              {/* User Auth or Sign in pill */}
              <div className="flex items-center gap-2">
                {currentUser ? (
                  <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/90 py-1.5 px-3 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-[#8B1E2D] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      {currentUser.user_metadata?.first_name
                        ? currentUser.user_metadata.first_name[0].toUpperCase()
                        : currentUser.email
                        ? currentUser.email[0].toUpperCase()
                        : "U"}
                    </div>
                    <span className="text-xs font-medium text-gray-700 hidden sm:inline max-w-[150px] truncate">
                      {currentUser.user_metadata?.first_name
                        ? `${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name || ""}`.trim()
                        : currentUser.email}
                    </span>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("vl_connect_user");
                          localStorage.removeItem("designsphere_user");
                          localStorage.removeItem("projectsphere_user");
                        }
                        setCurrentUser(null);
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold pl-1"
                      title="Sign out"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#8B1E2D]/30 text-[#8B1E2D] hover:bg-[#8B1E2D]/5 font-semibold text-xs transition"
                  >
                    <span>Sign In</span>
                    <span className="text-[10px]">→</span>
                  </Link>
                )}

                <a
                  href="#projects"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8B1E2D] hover:bg-[#A32335] text-white text-xs font-semibold shadow-xs transition"
                >
                  <span>Explore Labs</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Hero Section: Rich VESIT Collegiate Theme */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#101D2C] via-[#142A3E] to-[#1A344D] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B1E2D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-amber-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>VESIT Department of Computer Engineering</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">Batch 2026–2027</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Virtual Laboratories &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100">
                System Design Registry
              </span>
            </h1>

            {/* Swami Vivekananda Motto quote */}
            <div className="mt-4 pl-4 border-l-2 border-amber-400/60 text-sm italic text-amber-100/90 font-serif">
              &ldquo;Arise, awake, and stop not till the goal is reached.&rdquo;
              <span className="block text-xs not-italic font-sans text-white/50 mt-0.5">
                — Swami Vivekananda, Inspiration of VES Institutions
              </span>
            </div>

            <p className="mt-6 text-base sm:text-lg text-white/80 leading-relaxed">
              An open-access academic portal built and maintained by VESIT student engineers.
              Explore interactive distributed systems simulators, technical feasibility analyses,
              high-level architectural blueprints, and comprehensive research documentation.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#8B1E2D] hover:bg-[#A32335] text-white font-semibold text-sm transition shadow-lg shadow-[#8B1E2D]/30"
              >
                <span>Explore Projects ({projects.length})</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>

              <a
                href="#guidance"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition"
              >
                <span>Faculty Mentors</span>
                <span className="text-amber-200">↓</span>
              </a>

              {isRefreshing && (
                <div className="inline-flex items-center gap-2 text-xs text-amber-200/80 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin"></span>
                  <span>Syncing with Live Registry...</span>
                </div>
              )}
            </div>
          </div>

          {/* Metric KPI cards */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6 border-t border-white/15 pt-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                {String(projects.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                Student Projects
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">Department of Computer Engineering</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-300">
                {String(stats.withLab).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                Live Virtual Labs
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">100% Interactive simulators</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition">
              <p className="text-3xl sm:text-4xl font-extrabold text-sky-300">
                {stats.totalStudents}+
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                VESIT Students
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">Authors &amp; Contributors</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-200">
                100%
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                Verified Readiness
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">Architecture &amp; Reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Projects Directory Section (All 21 Curated Projects Directly Rendered) */}
      <section id="projects" className="scroll-mt-24 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B1E2D]">
                <span className="w-2 h-2 rounded-full bg-[#8B1E2D]"></span>
                <span>Academic Directory</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#101D2C]">
                Student Project &amp; Simulation Archives
              </h2>
              <p className="mt-1.5 text-sm text-gray-600">
                Showing {filteredProjects.length} of {projects.length} project records from the Department of Computer Engineering.
                Directly access online virtual labs, feasibility docs, architecture, and reports.
              </p>
            </div>

            {/* View Mode Switcher & Live Sheet Sync */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <button
                type="button"
                onClick={() => syncWithSheet(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition cursor-pointer disabled:opacity-60"
                title="Click to refresh database records immediately"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRefreshing ? "bg-amber-400 animate-spin" : "bg-emerald-500 animate-pulse"
                  }`}
                ></span>
                <span>{isRefreshing ? "Refreshing..." : "Live Registry Synced"}</span>
                <span className="text-[10px] text-gray-400 font-normal hidden sm:inline">
                  ({lastSyncTime})
                </span>
              </button>

              <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#8B1E2D] shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Card Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-[#8B1E2D] shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Compact Table
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar & Document Filter Chips */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by topic, group number (e.g. 01, 14), or student name..."
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1E2D]/20 focus:border-[#8B1E2D] shadow-xs transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-medium text-gray-500 mr-1">Filter by resource:</span>
              <button
                type="button"
                onClick={() => setDocumentFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  documentFilter === "all"
                    ? "bg-[#8B1E2D] text-white shadow-xs font-bold"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                All Resources ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setDocumentFilter("lab")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  documentFilter === "lab"
                    ? "bg-[#8B1E2D] text-white shadow-xs font-bold ring-2 ring-[#8B1E2D]/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Virtual Lab Only ({stats.withLab})
              </button>
              <button
                type="button"
                onClick={() => setDocumentFilter("architecture")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  documentFilter === "architecture"
                    ? "bg-[#8B1E2D] text-white shadow-xs font-bold ring-2 ring-[#8B1E2D]/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Architecture Only ({stats.withArch})
              </button>
              <button
                type="button"
                onClick={() => setDocumentFilter("feasibility")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  documentFilter === "feasibility"
                    ? "bg-[#8B1E2D] text-white shadow-xs font-bold ring-2 ring-[#8B1E2D]/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Feasibility Only ({stats.withFeas})
              </button>
              <button
                type="button"
                onClick={() => setDocumentFilter("report")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  documentFilter === "report"
                    ? "bg-[#8B1E2D] text-white shadow-xs font-bold ring-2 ring-[#8B1E2D]/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Report Only ({stats.withReport})
              </button>
              <button
                type="button"
                onClick={() => setDocumentFilter("complete")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  documentFilter === "complete"
                    ? "bg-emerald-700 text-white shadow-xs font-bold"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                100% Ready ({stats.fullyComplete})
              </button>
            </div>

            {/* Active Resource Filter Banner */}
            {documentFilter !== "all" && documentFilter !== "complete" && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                  <span>
                    Currently filtering by{" "}
                    <strong className="font-bold underline text-[#8B1E2D]">
                      {documentFilter === "lab"
                        ? "Virtual Lab (Simulator)"
                        : documentFilter === "architecture"
                        ? "Architecture Blueprint"
                        : documentFilter === "feasibility"
                        ? "Feasibility Analysis"
                        : "Research Report"}
                    </strong>
                    . The other 3 resource deliverables are removed from view.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDocumentFilter("all")}
                  className="font-bold text-[#8B1E2D] hover:underline shrink-0 bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-2xs cursor-pointer text-[11px]"
                >
                  Show All 4 Resources
                </button>
              </div>
            )}
          </div>

          {/* 5. Rendered Project List / Cards */}
          <div className="mt-8">
            {viewMode === "grid" ? (
              /* CARD GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => {
                  const resourceCount = [
                    project.virtualLab && project.virtualLab.trim(),
                    project.feasibility && project.feasibility.trim(),
                    project.architecture && project.architecture.trim(),
                    project.report && project.report.trim(),
                  ].filter(Boolean).length;

                  const displayGroup = project.group;

                  return (
                    <div
                      key={`card-${displayGroup}-${index}`}
                      className="group bg-white rounded-2xl border border-gray-200/90 hover:border-[#8B1E2D]/50 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Top Corner Ribbon / Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white font-extrabold text-xs shadow-xs bg-[#8B1E2D]">
                            {displayGroup}
                          </span>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E2D]">
                              GROUP {displayGroup.padStart(2, "0")}
                            </span>
                            <span className="block text-[10px] text-gray-500 font-medium">
                              Dept. of Computer Engineering
                            </span>
                          </div>
                        </div>

                        {/* Readiness status pill (0/4, 1/4, 2/4, 3/4, 4/4) */}
                        <div className="flex items-center gap-1">
                          {resourceCount === 4 ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              4/4 Ready
                            </span>
                          ) : resourceCount === 3 ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              3/4 Ready
                            </span>
                          ) : resourceCount === 2 ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              2/4 In Progress
                            </span>
                          ) : resourceCount === 1 ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              1/4 In Progress
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                              Pending Upload
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Project Title & Author Students */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#8B1E2D] transition-colors leading-snug">
                          {project.title}
                        </h3>

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-gray-400">👥</span>
                          <span className="font-medium">
                            {project.students.length > 0
                              ? project.students.join(" • ")
                              : "Student Authors Unassigned"}
                          </span>
                        </div>
                      </div>

                      {/* Deliverables Action Stack (Image 2 Layout: Top Launch Virtual Lab + Bottom 3 Pills) */}
                      <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                            {documentFilter === "all" || documentFilter === "complete"
                              ? "Project Deliverables & Virtual Lab"
                              : documentFilter === "lab"
                              ? "Filtered Deliverable • Virtual Lab Only"
                              : documentFilter === "architecture"
                              ? "Filtered Deliverable • Architecture Only"
                              : documentFilter === "feasibility"
                              ? "Filtered Deliverable • Feasibility Only"
                              : "Filtered Deliverable • Report Only"}
                          </p>
                          {documentFilter !== "all" && documentFilter !== "complete" && (
                            <button
                              type="button"
                              onClick={() => setDocumentFilter("all")}
                              className="text-[10px] font-bold text-[#8B1E2D] hover:underline cursor-pointer"
                            >
                              Show All Resources
                            </button>
                          )}
                        </div>

                        {/* 1. Top Primary Action Button: Launch Virtual Lab (Matching Image 2) */}
                        {(documentFilter === "all" ||
                          documentFilter === "complete" ||
                          documentFilter === "lab") && (
                          project.virtualLab ? (
                            <a
                              href={project.virtualLab}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-[#8B1E2D] via-[#9E1E31] to-[#BA253B] hover:from-[#751624] hover:to-[#8B1E2D] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#8B1E2D]/25 hover:shadow-lg hover:shadow-[#8B1E2D]/40 transition-all duration-200 group/btn"
                            >
                              <span className="flex items-center gap-2.5">
                                <LabFlaskIcon className="w-5 h-5 shrink-0" />
                                <span className="tracking-wide font-extrabold">Launch Virtual Lab</span>
                              </span>
                              <span className="text-white/80 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-sm font-bold">
                                ↗
                              </span>
                            </a>
                          ) : (
                            <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gray-50 text-gray-400 text-xs border border-dashed border-gray-200">
                              <span className="flex items-center gap-2">
                                <LabFlaskIcon className="w-5 h-5 opacity-40 shrink-0" />
                                <span>Launch Virtual Lab — Simulator Pending</span>
                              </span>
                            </div>
                          )
                        )}

                        {/* 2. Bottom Row: 3 Pill Buttons Side-by-Side (Feasibility | Architecture | Report Matching Image 2) */}
                        {(documentFilter === "all" || documentFilter === "complete") && (
                          <div className="grid grid-cols-3 gap-2 pt-0.5">
                            {/* Feasibility */}
                            {project.feasibility ? (
                              <a
                                href={project.feasibility}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white hover:bg-amber-50 text-gray-700 hover:text-amber-800 border border-gray-200 hover:border-amber-300 text-xs font-semibold shadow-2xs hover:shadow-xs transition group/sub"
                                title="Open Feasibility Study Doc"
                              >
                                <span>Feasibility</span>
                                <span className="text-gray-400 group-hover/sub:text-amber-600 text-[10px]">↗</span>
                              </a>
                            ) : (
                              <div className="flex items-center justify-center py-2 px-2 rounded-xl bg-gray-50 text-gray-300 text-xs border border-dashed border-gray-200">
                                Feasibility
                              </div>
                            )}

                            {/* Architecture */}
                            {project.architecture ? (
                              <a
                                href={project.architecture}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white hover:bg-teal-50 text-gray-700 hover:text-teal-800 border border-gray-200 hover:border-teal-300 text-xs font-semibold shadow-2xs hover:shadow-xs transition group/sub"
                                title="Open Architecture Diagram"
                              >
                                <span>Architecture</span>
                                <span className="text-gray-400 group-hover/sub:text-teal-600 text-[10px]">↗</span>
                              </a>
                            ) : (
                              <div className="flex items-center justify-center py-2 px-2 rounded-xl bg-gray-50 text-gray-300 text-xs border border-dashed border-gray-200">
                                Architecture
                              </div>
                            )}

                            {/* Report */}
                            {project.report ? (
                              <a
                                href={project.report}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-800 border border-gray-200 hover:border-purple-300 text-xs font-semibold shadow-2xs hover:shadow-xs transition group/sub"
                                title="Open Research Report"
                              >
                                <span>Report</span>
                                <span className="text-gray-400 group-hover/sub:text-purple-600 text-[10px]">↗</span>
                              </a>
                            ) : (
                              <div className="flex items-center justify-center py-2 px-2 rounded-xl bg-gray-50 text-gray-300 text-xs border border-dashed border-gray-200">
                                Report
                              </div>
                            )}
                          </div>
                        )}

                        {/* Filtered Single View for Feasibility */}
                        {documentFilter === "feasibility" && (
                          project.feasibility ? (
                            <a
                              href={project.feasibility}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/25 transition group/btn"
                            >
                              <span className="flex items-center gap-2">
                                <span>📊</span>
                                <span>Open Feasibility Study Doc</span>
                              </span>
                              <span>↗</span>
                            </a>
                          ) : (
                            <div className="w-full py-2.5 px-4 rounded-2xl bg-gray-50 text-gray-400 text-xs border border-dashed border-gray-200 text-center">
                              Feasibility Analysis Pending
                            </div>
                          )
                        )}

                        {/* Filtered Single View for Architecture */}
                        {documentFilter === "architecture" && (
                          project.architecture ? (
                            <a
                              href={project.architecture}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/25 transition group/btn"
                            >
                              <span className="flex items-center gap-2">
                                <span>📐</span>
                                <span>Open Architecture Blueprint</span>
                              </span>
                              <span>↗</span>
                            </a>
                          ) : (
                            <div className="w-full py-2.5 px-4 rounded-2xl bg-gray-50 text-gray-400 text-xs border border-dashed border-gray-200 text-center">
                              Architecture Diagram Pending
                            </div>
                          )
                        )}

                        {/* Filtered Single View for Report */}
                        {documentFilter === "report" && (
                          project.report ? (
                            <a
                              href={project.report}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition group/btn"
                            >
                              <span className="flex items-center gap-2">
                                <span>📄</span>
                                <span>Open Research Report (Thesis)</span>
                              </span>
                              <span>↗</span>
                            </a>
                          ) : (
                            <div className="w-full py-2.5 px-4 rounded-2xl bg-gray-50 text-gray-400 text-xs border border-dashed border-gray-200 text-center">
                              Research Report Pending
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* COMPACT TABLE REGISTRY VIEW */
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#101D2C] text-white text-xs uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Group</th>
                        <th className="py-3.5 px-4">Project &amp; Team</th>
                        {(documentFilter === "all" ||
                          documentFilter === "complete" ||
                          documentFilter === "lab") && (
                          <th className="py-3.5 px-4">Virtual Lab</th>
                        )}
                        {(documentFilter === "all" ||
                          documentFilter === "complete" ||
                          documentFilter === "feasibility") && (
                          <th className="py-3.5 px-4">Feasibility</th>
                        )}
                        {(documentFilter === "all" ||
                          documentFilter === "complete" ||
                          documentFilter === "architecture") && (
                          <th className="py-3.5 px-4">Architecture</th>
                        )}
                        {(documentFilter === "all" ||
                          documentFilter === "complete" ||
                          documentFilter === "report") && (
                          <th className="py-3.5 px-4">Report</th>
                        )}
                        <th className="py-3.5 px-4 text-center">Readiness</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProjects.map((project, index) => {
                        const resourceCount = [
                          project.virtualLab && project.virtualLab.trim(),
                          project.feasibility && project.feasibility.trim(),
                          project.architecture && project.architecture.trim(),
                          project.report && project.report.trim(),
                        ].filter(Boolean).length;

                        const displayGroup = project.group;

                        return (
                          <tr
                            key={`table-${displayGroup}-${index}`}
                            className="hover:bg-amber-50/30 transition-colors"
                          >
                            <td className="py-4 px-4 font-bold text-[#8B1E2D] tabular-nums">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md font-extrabold text-xs text-white bg-[#8B1E2D]">
                                {displayGroup}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-gray-900">
                                {project.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {project.students.length > 0
                                  ? project.students.join(" • ")
                                  : "Students unassigned"}
                              </div>
                            </td>
                            {(documentFilter === "all" ||
                              documentFilter === "complete" ||
                              documentFilter === "lab") && (
                              <td className="py-4 px-4">
                                {project.virtualLab ? (
                                  <a
                                    href={project.virtualLab}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline text-xs bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200"
                                  >
                                    <span>Open Lab</span>
                                    <span>↗</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                            )}
                            {(documentFilter === "all" ||
                              documentFilter === "complete" ||
                              documentFilter === "feasibility") && (
                              <td className="py-4 px-4">
                                {project.feasibility ? (
                                  <a
                                    href={project.feasibility}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-amber-700 hover:underline text-xs bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
                                  >
                                    <span>View Doc</span>
                                    <span>↗</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                            )}
                            {(documentFilter === "all" ||
                              documentFilter === "complete" ||
                              documentFilter === "architecture") && (
                              <td className="py-4 px-4">
                                {project.architecture ? (
                                  <a
                                    href={project.architecture}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-teal-700 hover:underline text-xs bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200"
                                  >
                                    <span>Diagram</span>
                                    <span>↗</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                            )}
                            {(documentFilter === "all" ||
                              documentFilter === "complete" ||
                              documentFilter === "report") && (
                              <td className="py-4 px-4">
                                {project.report ? (
                                  <a
                                    href={project.report}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-purple-700 hover:underline text-xs bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200"
                                  >
                                    <span>Report</span>
                                    <span>↗</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-300 text-xs">—</span>
                                )}
                              </td>
                            )}
                            <td className="py-4 px-4 text-center">
                              {resourceCount === 4 ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                                  4/4
                                </span>
                              ) : resourceCount === 3 ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                                  3/4
                                </span>
                              ) : resourceCount === 2 ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-800">
                                  2/4
                                </span>
                              ) : resourceCount === 1 ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                                  1/4
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-500">
                                  0/4
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Faculty Mentors & Academic Guidance Credits Section (Vibrant Modern Colors) */}
      <section id="guidance" className="scroll-mt-24 py-16 bg-gradient-to-b from-white via-[#FAF9F6] to-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  Faculty Mentors &amp; Guidance
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-[#8B1E2D] border border-rose-200">
                  Academic Oversight
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Curriculum Design, Technical Review and Software System Design Project Mentorship.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {/* Dr. Priya R. L. Card (Rich Vibrant Crimson / Rose / Gold) */}
            <div className="p-6 rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-white via-rose-50/50 to-amber-50/30 hover:border-[#8B1E2D] shadow-sm hover:shadow-xl hover:shadow-rose-900/10 transition-all duration-300 flex items-center justify-between gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/10 to-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-5 min-w-0 relative z-10">
                <FlippableProfileAvatar
                  imageSrc="/team/priya.png"
                  name="Dr. Priya R. L."
                  monogram="PL"
                  gradientClass="from-[#8B1E2D] via-[#A82035] to-[#D92B45]"
                  sizeClass="w-16 h-16 sm:w-18 sm:h-18"
                  ringClass="ring-rose-100"
                  shadowClass="shadow-[#8B1E2D]/35"
                  imgPosition="object-center"
                />
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Lead Faculty Mentor</span>
                  </div>
                  <h4 className="text-lg font-black text-gray-900 leading-snug group-hover:text-[#8B1E2D] transition-colors">
                    Dr. Priya R. L.
                  </h4>
                  <p className="text-xs font-semibold text-gray-700 leading-tight mt-0.5">
                    Assistant Professor, Dept. of Computer Engineering
                  </p>
                  <p className="text-[11px] text-gray-500">
                    VESIT (Autonomous), Mumbai
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-md border border-rose-200">
                      <span>⚡</span>
                      <span>Distributed Consensus</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                      <span>📚</span>
                      <span>Storage Engines</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mr. Richard Joseph Card (Rich Vibrant Deep Cobalt / Sapphire / Cyan) */}
            <div className="p-6 rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/30 hover:border-[#1E3A8A] shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 flex items-center justify-between gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-5 min-w-0 relative z-10">
                <FlippableProfileAvatar
                  imageSrc="/team/richard.png"
                  name="Mr. Richard Joseph"
                  monogram="RJ"
                  gradientClass="from-[#101D2C] via-[#1E3A8A] to-[#2563EB]"
                  sizeClass="w-16 h-16 sm:w-18 sm:h-18"
                  ringClass="ring-blue-100"
                  shadowClass="shadow-blue-900/35"
                  imgPosition="object-top"
                />
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>Lead Faculty Mentor</span>
                  </div>
                  <h4 className="text-lg font-black text-gray-900 leading-snug group-hover:text-[#1E3A8A] transition-colors">
                    Mr. Richard Joseph
                  </h4>
                  <p className="text-xs font-semibold text-gray-700 leading-tight mt-0.5">
                    Assistant Professor, Dept. of Computer Engineering
                  </p>
                  <p className="text-[11px] text-gray-500">
                    VESIT (Autonomous), Mumbai
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-md border border-blue-200">
                      <span>☁️</span>
                      <span>Cloud Service Mesh</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-md border border-indigo-200">
                      <span>⚗️</span>
                      <span>Breakscale Virtual Labs</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student UI Integration Team (Vibrant Popping Cards with Gradient Glowing Avatars) */}
          <div className="mt-14 pt-10 border-t border-gray-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] text-white flex items-center justify-center font-mono font-bold text-xs shadow-md shadow-indigo-500/25">
                  &lt;/&gt;
                </span>
                <div>
                  <h4 className="text-lg font-black text-[#101D2C] tracking-tight">
                    Student UI Integration Team
                  </h4>
                  <p className="text-xs text-gray-500">
                    Frontend architecture, API registry integration, and system design simulators.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                  <span>↺</span>
                  <span>Tap avatar to flip</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border border-indigo-200 shadow-2xs">
                  <span>⚡</span>
                  <span>Core Engineering Authors</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Krishna Lohana (Vibrant Coral / Sunset Glow) */}
              <div className="bg-gradient-to-br from-white via-orange-50/50 to-rose-50/30 rounded-2xl border-2 border-orange-200/90 hover:border-orange-500 p-5 flex items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 group relative overflow-hidden">
                <FlippableProfileAvatar
                  imageSrc="/team/krishna.jpg"
                  name="Krishna Lohana"
                  monogram="KL"
                  gradientClass="from-[#FF5E62] via-[#FF758C] to-[#FF9966]"
                  sizeClass="w-14 h-14 sm:w-16 sm:h-16"
                  ringClass="ring-orange-100"
                  shadowClass="shadow-orange-500/35"
                  imgPosition="object-top"
                  textClass="text-lg"
                />
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-orange-900 bg-orange-100/90 border border-orange-200 px-2 py-0.5 rounded-full mb-1">
                    Student Lead
                  </span>
                  <h5 className="text-base font-extrabold text-gray-900 group-hover:text-orange-700 transition-colors leading-snug">
                    Krishna Lohana
                  </h5>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Dept. of Computer Engineering
                  </p>
                  <p className="text-[11px] text-gray-400">
                    VESIT, Mumbai
                  </p>
                </div>
              </div>

              {/* 2. James Lijo (Vibrant Purple / Electric Violet Glow) */}
              <div className="bg-gradient-to-br from-white via-purple-50/50 to-violet-50/30 rounded-2xl border-2 border-purple-200/90 hover:border-purple-500 p-5 flex items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group relative overflow-hidden">
                <FlippableProfileAvatar
                  imageSrc="/team/james.png"
                  name="James Lijo"
                  monogram="JL"
                  gradientClass="from-[#7F00FF] via-[#8A2BE2] to-[#E100FF]"
                  sizeClass="w-14 h-14 sm:w-16 sm:h-16"
                  ringClass="ring-purple-100"
                  shadowClass="shadow-purple-500/35"
                  imgPosition="object-top"
                  textClass="text-lg"
                />
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100/90 border border-purple-200 px-2 py-0.5 rounded-full mb-1">
                    Student Lead
                  </span>
                  <h5 className="text-base font-extrabold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug">
                    James Lijo
                  </h5>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Dept. of Computer Engineering
                  </p>
                  <p className="text-[11px] text-gray-400">
                    VESIT, Mumbai
                  </p>
                </div>
              </div>

              {/* 3. Piyush Kandhari (Vibrant Magenta / Deep Crimson Glow) */}
              <div className="bg-gradient-to-br from-white via-pink-50/50 to-rose-50/30 rounded-2xl border-2 border-pink-200/90 hover:border-pink-500 p-5 flex items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 group relative overflow-hidden">
                <FlippableProfileAvatar
                  imageSrc="/team/piyush.png"
                  name="Piyush Kandhari"
                  monogram="PK"
                  gradientClass="from-[#D9138A] via-[#E91E63] to-[#800080]"
                  sizeClass="w-14 h-14 sm:w-16 sm:h-16"
                  ringClass="ring-pink-100"
                  shadowClass="shadow-pink-500/35"
                  imgPosition="object-top"
                  textClass="text-lg"
                />
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-pink-900 bg-pink-100/90 border border-pink-200 px-2 py-0.5 rounded-full mb-1">
                    Student Lead
                  </span>
                  <h5 className="text-base font-extrabold text-gray-900 group-hover:text-pink-700 transition-colors leading-snug">
                    Piyush Kandhari
                  </h5>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Dept. of Computer Engineering
                  </p>
                  <p className="text-[11px] text-gray-400">
                    VESIT, Mumbai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VESIT Institutional Footer */}
      <footer id="about" className="bg-[#101D2C] text-white border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            {/* Col 1: Institute Brand & Motto */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative h-12 w-44 bg-white p-1 rounded-lg">
                  <Image
                    src="/vesit-logo.png"
                    alt="VESIT"
                    fill
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
                <div className="relative h-12 w-44 bg-white p-1.5 rounded-lg">
                  <Image
                    src="/designsphere-logo.png"
                    alt="DesignSphere"
                    fill
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-xs text-white/70 max-w-md leading-relaxed">
                <strong className="text-white">Vivekanand Education Society&apos;s Institute of Technology (VESIT)</strong> was established in 1984.
                An Autonomous Institute affiliated to the University of Mumbai, approved by AICTE,
                and accredited with &apos;A&apos; Grade by NAAC.
              </p>
              <div className="text-xs text-amber-200/90 font-serif italic">
                &ldquo;Education is the manifestation of the perfection already in man.&rdquo; — Swami Vivekananda
              </div>
            </div>

            {/* Col 2: Campus Location */}
            <div className="space-y-2 text-xs text-white/70">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-amber-300">
                Campus Location
              </h4>
              <p className="leading-relaxed">
                Hashu Advani Memorial Complex,<br />
                Collector&apos;s Colony, Chembur,<br />
                Mumbai, Maharashtra - 400074.<br />
                India.
              </p>
              <p className="pt-2">
                <strong className="text-white">Email:</strong> vesit@ves.ac.in<br />
                <strong className="text-white">Phone:</strong> +91-22-61532510 / 25227411
              </p>
            </div>

            {/* Col 3: Academic Portals */}
            <div className="space-y-2 text-xs text-white/70">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-amber-300">
                Institutional Portals
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://vesit.ves.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-200 transition"
                  >
                    VESIT Official Website ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://ves.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-200 transition"
                  >
                    VES Society Portal ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://vesit.ves.ac.in/research/research-and-development/research-forum/research-facilities/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-200 transition"
                  >
                    VESIT Research Facilities ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://vesit.ves.ac.in/academics/departments/computer-engineering"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-200 transition"
                  >
                    Department of Computer Engineering ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
            <p>
              © 2026 VESIT DesignSphere • Department of Computer Engineering • Vivekanand Education Society&apos;s Institute of Technology
            </p>
            <p className="text-[11px] text-white/40">
              NAAC &apos;A&apos; Accredited Autonomous Engineering Institute
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
