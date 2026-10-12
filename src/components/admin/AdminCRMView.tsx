"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  KanbanSquare,
  Table as TableIcon,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  SlidersHorizontal,
  Bell,
  Share2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Building,
  Mail,
  Clock,
  Sparkles,
  ExternalLink,
  Trash2,
  X,
  FileText,
  UserCheck,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  Settings,
  HelpCircle,
  LogOut,
  Flame,
  Globe,
  Star,
  Layers,
  BarChart2,
  Radio,
} from "lucide-react";

import AgencyOverviewView from "./AgencyOverviewView";
import ActiveProjectsView from "./ActiveProjectsView";
import PortfolioCMSView from "./PortfolioCMSView";
import JournalCMSView from "./JournalCMSView";
import ClientDirectoryView from "./ClientDirectoryView";
import IntegrationsControlView from "./IntegrationsControlView";
import { AdminCustomDropdown } from "./AdminCustomDropdown";

export interface MilestoneItem {
  id: string;
  projectId: string;
  title: string;
  order: number;
  description: string | null;
  deliverables: string | null;
  targetDate: string | null;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  approvalNotes: string | null;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  year: string;
  category: string;
  overview: string;
  challenge: string;
  solution: string;
  heroImage: string;
  beforeImg: string | null;
  afterImg: string | null;
  galleryImages: string | null;
  deliverables: string;
  metrics: string;
  techStack: string | null;
  liveDemoUrl: string | null;
  figmaUrl: string | null;
  organizationId: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  organization?: { id: string; name: string; slug: string } | null;
  milestones?: MilestoneItem[];
}

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  image: string;
  categories: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  status: string;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientOrgItem {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  contactName: string | null;
  contactEmail: string;
  avatarUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  projects?: { id: string; title: string; year: string }[];
  inquiries?: {
    id: string;
    productName: string;
    estimatedPriceMin: number;
    estimatedPriceMax: number;
    status: string;
  }[];
}

export interface ActivityLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorName: string;
  details: string | null;
  createdAt: string;
}

export interface InquiryItem {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  projectDetails: string | null;
  productType: string;
  productName: string;
  selectedFeatures: string;
  velocity: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  estimatedWeeks: number;
  leadScore: string;
  status: string;
  aiSummary: string | null;
  techStackRecommended: string | null;
  notes: string | null;
  clientOrganizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminCRMViewProps {
  initialInquiries: InquiryItem[];
  initialProjects?: ProjectItem[];
  initialPosts?: PostItem[];
  initialClients?: ClientOrgItem[];
  initialLogs?: ActivityLogItem[];
  userRole: string;
  userName: string;
  userEmail: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  NEW: { label: "New Inquiry", bg: "bg-blue-50 text-blue-700", text: "text-blue-700", dot: "bg-blue-500" },
  CONTACTED: { label: "Intro Sent", bg: "bg-amber-50 text-amber-700", text: "text-amber-700", dot: "bg-amber-500" },
  DISCOVERY_CALL: { label: "Discovery Call", bg: "bg-purple-50 text-purple-700", text: "text-purple-700", dot: "bg-purple-500" },
  PROPOSAL_SENT: { label: "Proposal Sent", bg: "bg-cyan-50 text-cyan-700", text: "text-cyan-700", dot: "bg-cyan-500" },
  WON: { label: "Project Signed", bg: "bg-emerald-50 text-emerald-700", text: "text-emerald-700", dot: "bg-emerald-500" },
  LOST: { label: "Archived", bg: "bg-rose-50 text-rose-700", text: "text-rose-700", dot: "bg-rose-500" },
};

const formatPrice = (val: number): string => {
  if (typeof val !== "number" || isNaN(val)) return "0";
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const FILTER_OPTIONS = [
  { value: "ALL", label: "All Inquiries" },
  { value: "NEW", label: "New Inquiries" },
  { value: "CONTACTED", label: "Intro Sent" },
  { value: "DISCOVERY_CALL", label: "Discovery Call" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  { value: "WON", label: "Signed Projects" },
  { value: "LOST", label: "Archived" },
];

const SERVICE_CATEGORY_OPTIONS = [
  { value: "web-app", label: "Web Application & Digital Platform" },
  { value: "mobile-app", label: "Mobile App (iOS / Android)" },
  { value: "ai-system", label: "AI & Intelligent Systems" },
  { value: "ui-ux-design", label: "Brand Identity & UI/UX Product Design" },
  { value: "enterprise-custom", label: "Enterprise Custom Solution" },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface CustomStatusDropdownProps {
  currentStatus: string;
  onSelect: (newStatus: string) => void;
  align?: "left" | "right";
  variant?: "badge" | "input";
}

function CustomStatusDropdown({
  currentStatus,
  onSelect,
  align = "left",
  variant = "badge",
}: CustomStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCfg = STATUS_CONFIG[currentStatus] || {
    label: currentStatus,
    bg: "bg-neutral-50 text-neutral-700",
    text: "text-neutral-700",
    dot: "bg-neutral-400",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 260);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button Matching Gambar 1 */}
      <button
        type="button"
        onClick={handleToggle}
        className={
          variant === "input"
            ? "flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-2xl border border-[#eaecf0] hover:border-neutral-300 bg-white text-xs font-bold text-gray-900 shadow-2xs transition-all cursor-pointer min-w-[140px]"
            : `inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-2xl border text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${currentCfg.bg} border-current/15 hover:border-current/30 hover:shadow-xs`
        }
      >
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${currentCfg.dot}`} />
          <span>{currentCfg.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Popover Menu Matching Gambar 1 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? -4 : 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? -4 : 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 min-w-[170px] bg-white rounded-2xl border border-[#eaecf0] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-1.5 ${
              openUpward ? "bottom-full mb-1.5" : "mt-1.5"
            } ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="space-y-0.5 max-h-[220px] overflow-y-auto [scrollbar-width:thin] pr-1">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const isSelected = key === currentStatus;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#f5f6fa] text-gray-900 font-bold"
                        : "text-neutral-600 hover:bg-[#fafbfc] hover:text-gray-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      <span>{config.label}</span>
                    </div>

                    {/* Vertical Pill Indicator Matching Gambar 1 */}
                    {isSelected && (
                      <span className="w-1 h-3.5 rounded-full bg-gray-900 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomFilterDropdown({
  currentFilter,
  onSelect,
}: {
  currentFilter: string;
  onSelect: (filter: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOpt =
    FILTER_OPTIONS.find((opt) => opt.value === currentFilter) || FILTER_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#eaecf0] hover:border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:text-gray-900 shadow-2xs transition-colors cursor-pointer"
      >
        <span>{selectedOpt.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 z-50 mt-1.5 min-w-[170px] bg-white rounded-2xl border border-[#eaecf0] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-1.5"
          >
            <div className="space-y-0.5">
              {FILTER_OPTIONS.map((opt) => {
                const isSelected = opt.value === currentFilter;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelect(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#f5f6fa] text-gray-900 font-bold"
                        : "text-neutral-600 hover:bg-[#fafbfc] hover:text-gray-900 font-medium"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="w-1 h-3.5 rounded-full bg-gray-900 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomPageSizeDropdown({
  pageSize,
  onSelect,
}: {
  pageSize: number;
  onSelect: (size: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-[#eaecf0] hover:border-neutral-300 bg-white text-xs font-bold text-gray-900 shadow-2xs transition-colors cursor-pointer"
      >
        <span>{pageSize}</span>
        <ChevronDown
          className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full mb-1.5 left-0 z-50 min-w-[70px] bg-white rounded-2xl border border-[#eaecf0] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-1"
          >
            <div className="space-y-0.5">
              {PAGE_SIZE_OPTIONS.map((size) => {
                const isSelected = size === pageSize;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      onSelect(size);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#f5f6fa] text-gray-900 font-bold"
                        : "text-neutral-600 hover:bg-[#fafbfc] hover:text-gray-900 font-medium"
                    }`}
                  >
                    <span>{size}</span>
                    {isSelected && (
                      <span className="w-1 h-3 rounded-full bg-gray-900 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminCRMView({
  initialInquiries,
  initialProjects = [],
  initialPosts = [],
  initialClients = [],
  initialLogs = [],
  userRole,
  userName,
  userEmail,
}: AdminCRMViewProps) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [clients, setClients] = useState<ClientOrgItem[]>(initialClients);
  const [logs, setLogs] = useState<ActivityLogItem[]>(initialLogs);

  const [activeMenu, setActiveMenu] = useState<
    "leads" | "dashboard" | "projects" | "case_studies" | "articles" | "clients" | "integrations"
  >("leads");

  // View & UI controls matching user screenshot
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [showStatistics, setShowStatistics] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Real-Time EventSource (SSE) Integration
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/realtime/stream");

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "NEW_INQUIRY") {
            const p = data.payload;
            const newLead: InquiryItem = {
              id: p.inquiryId,
              fullName: p.fullName,
              email: p.email,
              company: p.company || null,
              projectDetails: p.projectDetails || null,
              productType: p.productName || "Custom Platform",
              productName: p.productName,
              selectedFeatures: JSON.stringify(p.selectedFeatures || []),
              velocity: p.sprintSpeed || "STANDARD",
              estimatedPriceMin: p.estimatedCost,
              estimatedPriceMax: p.estimatedCost,
              estimatedWeeks: p.estimatedWeeks,
              leadScore: "HOT",
              status: "NEW",
              aiSummary: null,
              techStackRecommended: null,
              notes: null,
              clientOrganizationId: null,
              createdAt: data.timestamp || new Date().toISOString(),
              updatedAt: data.timestamp || new Date().toISOString(),
            };
            setInquiries((prev) => [newLead, ...prev.filter((item) => item.id !== newLead.id)]);
            showToast(`🚨 Real-Time: Lead baru masuk dari ${p.fullName} (${p.productName})!`);
          } else if (data.type === "INVOICE_PAID") {
            const p = data.payload;
            showToast(`💵 Real-Time: Invoice #${p.invoiceNumber} telah lunas ($${p.amount.toLocaleString()})!`);
            router.refresh();
          } else if (data.type === "MILESTONE_APPROVED") {
            const p = data.payload;
            showToast(`✅ Real-Time: Milestone "${p.milestoneTitle}" disetujui klien!`);
            router.refresh();
          }
        } catch {
          // Handshake / heartbeat ping
        }
      };

      eventSource.onerror = () => {
        // Auto-reconnect by browser EventSource
      };
    } catch (err) {
      console.warn("[SSE_ADMIN_WARN]", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [router]);

  // Header Actions States & Handlers
  const [copiedShare, setCopiedShare] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const handleShareDashboard = async () => {
    try {
      if (typeof window !== "undefined" && navigator?.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        showToast("Link CRM dashboard berhasil disalin ke clipboard!");
        setTimeout(() => setCopiedShare(false), 2000);
      } else {
        showToast("Link CRM dashboard disalin!");
      }
    } catch {
      showToast("Gagal menyalin link dashboard.");
    }
  };

  // New Project Scope Modal State & Handler
  const initialScopeForm = {
    fullName: "",
    email: "",
    company: "",
    projectDetails: "",
    productType: "web-app",
    productName: "Web Application",
    velocity: "standard" as "standard" | "express",
    estimatedPriceMin: 3500,
    estimatedPriceMax: 7500,
    estimatedWeeks: 4,
  };
  const [isNewScopeModalOpen, setIsNewScopeModalOpen] = useState(false);
  const [scopeForm, setScopeForm] = useState(initialScopeForm);
  const [isSubmittingScope, setIsSubmittingScope] = useState(false);
  const [scopeError, setScopeError] = useState<string | null>(null);

  const handleScopeProductChange = (val: string) => {
    const productPresets: Record<string, { name: string; min: number; max: number; weeks: number }> = {
      "web-app": { name: "Web Application", min: 3500, max: 7500, weeks: 4 },
      "mobile-app": { name: "Mobile App (iOS/Android)", min: 5000, max: 12000, weeks: 6 },
      "ai-system": { name: "AI & Intelligent Systems", min: 6000, max: 15000, weeks: 6 },
      "ui-ux-design": { name: "Brand & UI/UX Design", min: 2000, max: 4500, weeks: 3 },
      "enterprise-custom": { name: "Enterprise Architecture", min: 10000, max: 25000, weeks: 8 },
    };
    const preset = productPresets[val] || { name: "Custom Project", min: 3000, max: 6000, weeks: 4 };
    setScopeForm((prev) => ({
      ...prev,
      productType: val,
      productName: preset.name,
      estimatedPriceMin: preset.min,
      estimatedPriceMax: preset.max,
      estimatedWeeks: preset.weeks,
    }));
  };

  const handleCreateScope = async (e: React.FormEvent) => {
    e.preventDefault();
    setScopeError(null);

    if (!scopeForm.fullName.trim() || !scopeForm.email.trim()) {
      setScopeError("Nama lengkap dan alamat email wajib diisi.");
      return;
    }

    setIsSubmittingScope(true);
    try {
      const payload = {
        fullName: scopeForm.fullName.trim(),
        email: scopeForm.email.trim().toLowerCase(),
        company: scopeForm.company.trim() || undefined,
        projectDetails: scopeForm.projectDetails.trim() || undefined,
        productType: scopeForm.productType,
        productName: scopeForm.productName,
        selectedFeatures: [
          "Custom UI/UX Flow",
          "Scalable Architecture",
          "Production Deployment",
        ],
        velocity: scopeForm.velocity,
        estimatedPriceMin: Number(scopeForm.estimatedPriceMin),
        estimatedPriceMax: Number(scopeForm.estimatedPriceMax),
        estimatedWeeks: Number(scopeForm.estimatedWeeks),
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setScopeError(data.error || "Gagal membuat project scope baru.");
        setIsSubmittingScope(false);
        return;
      }

      const createdItem: InquiryItem = {
        id: data.data?.id || `temp-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        company: payload.company || null,
        projectDetails: payload.projectDetails || null,
        productType: payload.productType,
        productName: payload.productName,
        selectedFeatures: JSON.stringify(payload.selectedFeatures),
        velocity: payload.velocity,
        estimatedPriceMin: payload.estimatedPriceMin,
        estimatedPriceMax: payload.estimatedPriceMax,
        estimatedWeeks: payload.estimatedWeeks,
        leadScore: "HOT",
        status: "NEW",
        aiSummary: null,
        techStackRecommended: null,
        notes: null,
        clientOrganizationId: null,
        createdAt: data.data?.createdAt ? new Date(data.data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setInquiries((prev) => [createdItem, ...prev]);
      setScopeForm(initialScopeForm);
      setIsNewScopeModalOpen(false);
      showToast("Project Scope baru berhasil ditambahkan ke Pipeline!");
    } catch (err) {
      console.error("Failed to create scope:", err);
      setScopeError("Terjadi kendala jaringan saat menghubungi server.");
    } finally {
      setIsSubmittingScope(false);
    }
  };

  // Metrics Calculation
  const totalLeads = inquiries.length;
  const activePipelineValue = useMemo(() => {
    return inquiries
      .filter((i) => i.status !== "LOST" && i.status !== "WON")
      .reduce((acc, curr) => acc + curr.estimatedPriceMin, 0);
  }, [inquiries]);

  const closedWonValue = useMemo(() => {
    return inquiries
      .filter((i) => i.status === "WON")
      .reduce((acc, curr) => acc + curr.estimatedPriceMax, 0);
  }, [inquiries]);

  const avgVelocity = useMemo(() => {
    if (inquiries.length === 0) return 0;
    const total = inquiries.reduce((acc, curr) => acc + curr.estimatedWeeks, 0);
    return (total / inquiries.length).toFixed(1);
  }, [inquiries]);

  // Filtered Leads
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        inq.fullName.toLowerCase().includes(q) ||
        (inq.company && inq.company.toLowerCase().includes(q)) ||
        inq.email.toLowerCase().includes(q) ||
        inq.productName.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || inq.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  // Paginated leads
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInquiries.slice(start, start + pageSize);
  }, [filteredInquiries, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / pageSize));

  // Toggle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedInquiries.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status Change API
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
    );
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      showToast(`Status updated to ${newStatus}`);
    } catch {
      showToast("Error updating status. Please try again.");
    }
  };

  // Convert Lead to Active Client Project
  const handleConvertLead = async (inquiryId: string) => {
    setIsConverting(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/convert`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to convert lead.");

      setInquiries((prev) =>
        prev.map((item) => (item.id === inquiryId ? { ...item, status: "WON" } : item))
      );
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: "WON" } : null));
      }
      showToast("🎉 Converted to Active Client Project!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error converting lead.";
      showToast(msg);
    } finally {
      setIsConverting(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete.");
      setInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
      setSelectedIds((prev) => prev.filter((id) => id !== inquiryId));
      if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null);
      showToast("Lead deleted.");
    } catch {
      showToast("Failed to delete lead.");
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: internalNoteInput }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id ? { ...item, notes: internalNoteInput } : item
        )
      );
      setSelectedInquiry((prev) => (prev ? { ...prev, notes: internalNoteInput } : null));
      showToast("Internal notes saved successfully.");
    } catch {
      showToast("Failed to save notes.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Full Name", "Email", "Company", "Product", "Budget Min", "Budget Max", "Weeks", "Status", "Date"];
    const rows = inquiries.map((i) => [
      `"${i.fullName}"`,
      `"${i.email}"`,
      `"${i.company || ""}"`,
      `"${i.productName}"`,
      i.estimatedPriceMin,
      i.estimatedPriceMax,
      i.estimatedWeeks,
      i.status,
      `"${new Date(i.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `labs_stdio_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported leads to CSV.");
  };

  const parseFeatures = (featuresJson: string): string[] => {
    try {
      return JSON.parse(featuresJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f8] font-['Agrandir',sans-serif] text-gray-900 overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-6 z-50 bg-[#121316] text-[#d4f938] border border-[#a6f30d]/40 px-5 py-3 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.18)] text-xs font-bold flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#a6f30d]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          1. LEFT SIDEBAR (EXACT LAYOUT FROM REFERENCE IMAGE)
         ───────────────────────────────────────────────────────────── */}
      <aside
        className={`shrink-0 bg-white border-r border-[#eaecf0] flex flex-col justify-between overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarCollapsed
            ? "w-0 p-0 border-r-0 opacity-0 overflow-hidden pointer-events-none"
            : "w-64 p-4.5 opacity-100"
        }`}
      >
        <div className="space-y-5">
          {/* Top Organization Header */}
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center p-1.5 shadow-sm shrink-0">
                <Image
                  src="/images/P-LOGO.webp"
                  alt="Labs Stdio Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 leading-tight">Labs Stdio Inc.</h3>
                <span className="text-[10px] text-neutral-400 font-medium">Creative & Digital Studio OS</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-gray-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#eaecf0] rounded-xl pl-9 pr-10 py-2 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-gray-900 transition-colors"
            />
            <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded-md bg-white border border-[#eaecf0] text-[10px] font-mono font-medium text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 leading-none shadow-2xs pointer-events-none select-none">
              ⌘K
            </kbd>
          </div>

          {/* MAIN MENU */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase px-2 block mb-1">
              Main Menu
            </span>

            <button
              type="button"
              onClick={() => setActiveMenu("leads")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "leads"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeMenu === "leads" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
                <Flame className="w-4 h-4 text-gray-900" />
                <span>Project Inquiries</span>
              </div>
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-black text-[#a6f30d] text-[10px] font-bold leading-none shrink-0">
                {totalLeads}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "dashboard"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              {activeMenu === "dashboard" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
              <LayoutDashboard className="w-4 h-4 text-neutral-400" />
              <span>Agency Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("projects")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "projects"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeMenu === "projects" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
                <FolderKanban className="w-4 h-4 text-neutral-400" />
                <span>Active Projects</span>
              </div>
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0">
                {projects.length}
              </span>
            </button>
          </div>

          {/* CMS & TOOLS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase px-2 block mb-1">
              Studio & Portfolio
            </span>

            <button
              type="button"
              onClick={() => setActiveMenu("case_studies")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "case_studies"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeMenu === "case_studies" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
                <Layers className="w-4 h-4 text-neutral-400" />
                <span>Portfolio & Work</span>
              </div>
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0">
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("articles")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "articles"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeMenu === "articles" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Journal & Insights</span>
              </div>
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0">
                {posts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("clients")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "clients"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeMenu === "clients" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
                <UserCheck className="w-4 h-4 text-neutral-400" />
                <span>Client Directory</span>
              </div>
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0">
                {clients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("integrations")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeMenu === "integrations"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold shadow-2xs"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeMenu === "integrations" && <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />}
                <Radio className="w-4 h-4 text-neutral-400" />
                <span>Integrations & Webhooks</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#a6f30d] animate-pulse" />
            </button>
          </div>
        </div>

        {/* Sidebar Footer Navigation */}
        <div className="pt-4 border-t border-[#eaecf0] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-gray-900 hover:bg-neutral-50 transition-colors"
          >
            <Globe className="w-4 h-4 text-neutral-400" />
            <span>Public Website</span>
            <ExternalLink className="w-3 h-3 text-neutral-400 ml-auto" />
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>

          {/* User Profile Card */}
          <div className="p-2.5 rounded-2xl bg-[#f8f9fa] border border-[#eaecf0] flex items-center gap-2.5 mt-2">
            <div className="w-7 h-7 rounded-full bg-black text-[#a6f30d] font-bold text-xs inline-flex items-center justify-center shrink-0 leading-none">
              {userName.charAt(0)}
            </div>
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-gray-900 block truncate">{userName}</span>
              <span className="text-[10px] text-neutral-400 block truncate">{userEmail}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA (CLEAN WHITE CARD + EXACT HEADER)
         ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 flex flex-col min-w-0 bg-[#f4f5f8] p-4 lg:p-6 overflow-hidden">
        <div className="flex-1 min-h-0 bg-white rounded-3xl border border-[#eaecf0] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          {/* Header Row */}
          <header className="px-6 py-5 border-b border-[#eaecf0] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="p-2 rounded-xl border border-[#eaecf0] bg-white hover:bg-neutral-50 text-neutral-600 hover:text-gray-900 shadow-2xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-['Questrial',sans-serif]">
                  {activeMenu === "leads" && "Project Inquiries"}
                  {activeMenu === "dashboard" && "Agency Overview"}
                  {activeMenu === "projects" && "Active Projects"}
                  {activeMenu === "case_studies" && "Portfolio & Work"}
                  {activeMenu === "articles" && "Journal & Insights"}
                  {activeMenu === "clients" && "Client Directory"}
                </h1>
                <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] mt-0.5">
                  Manage incoming client briefs, project proposals, and engagement pipeline
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            {/* Action Bar (Share, Notifications, New Project Scope) */}
            <div className="flex items-center gap-2.5">
              {/* Share Dashboard Button */}
              <button
                type="button"
                onClick={handleShareDashboard}
                className="p-2 rounded-xl border border-[#eaecf0] hover:bg-neutral-50 text-neutral-500 hover:text-gray-900 transition-colors cursor-pointer relative"
                title="Copy dashboard link"
              >
                {copiedShare ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              {/* Notifications Popover */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen((prev) => !prev)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer relative ${
                    isNotificationsOpen
                      ? "border-black bg-neutral-100 text-gray-900"
                      : "border-[#eaecf0] hover:bg-neutral-50 text-neutral-500 hover:text-gray-900"
                  }`}
                  title="Agency Inquiries"
                >
                  <Bell className="w-4 h-4" />
                  {inquiries.some((i) => i.status === "NEW") && (
                    <span className="w-2 h-2 rounded-full bg-[#a6f30d] absolute top-1.5 right-1.5 ring-2 ring-white" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#eaecf0] shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[#eaecf0] bg-[#fafbfc] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#a6f30d]" />
                          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-['Agrandir']">
                            Agency Inquiries
                          </h4>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                          {inquiries.filter((i) => i.status === "NEW").length} New Inquiries
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-[#eaecf0]">
                        {inquiries.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedInquiry(item);
                              setIsNotificationsOpen(false);
                            }}
                            className="p-3.5 hover:bg-neutral-50 transition-colors cursor-pointer flex items-start gap-3 text-left"
                          >
                            <div className="w-8 h-8 rounded-xl bg-black text-[#a6f30d] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {item.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                  {item.fullName}
                                </p>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                    item.status === "NEW"
                                      ? "bg-amber-100 text-amber-800"
                                      : item.status === "QUALIFIED"
                                      ? "bg-blue-100 text-blue-800"
                                      : item.status === "WON"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-neutral-100 text-neutral-700"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                                {item.productName || item.productType}
                                {item.company ? ` • ${item.company}` : ""}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-400">
                                <span>${item.estimatedPriceMin.toLocaleString()} - ${item.estimatedPriceMax.toLocaleString()}</span>
                                <span>•</span>
                                <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {inquiries.length === 0 && (
                          <div className="p-6 text-center text-xs text-neutral-500">
                            Belum ada inquiry baru yang masuk.
                          </div>
                        )}
                      </div>

                      <div className="p-2 border-t border-[#eaecf0] bg-[#fafbfc] text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter("NEW");
                            setIsNotificationsOpen(false);
                          }}
                          className="text-[11px] font-semibold text-black hover:text-neutral-600 transition-colors cursor-pointer py-1 block w-full"
                        >
                          Lihat Semua Inquiry Baru →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Primary Action Button (1000ms Sliding Hover Signature) */}
              <button
                type="button"
                onClick={() => setIsNewScopeModalOpen(true)}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-neutral-900 bg-[#121316] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-xs transition-all duration-1000 hover:border-[#a6f30d] hover:shadow-[0_4px_16px_rgba(166,243,13,0.25)] cursor-pointer"
              >
                <span className="absolute inset-0 z-0 bg-[#a6f30d] -translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />
                <Plus className="relative z-10 w-3.5 h-3.5 text-white transition-colors duration-1000 group-hover:text-black" />
                <span className="relative z-10 text-white transition-colors duration-1000 group-hover:text-black">
                  New Project Scope
                </span>
              </button>
            </div>
          </header>

          {/* View Switcher: Agency Overview */}
          {activeMenu === "dashboard" && (
            <AgencyOverviewView
              inquiries={inquiries}
              projects={projects}
              posts={posts}
              clients={clients}
              logs={logs}
              onNavigateMenu={(menu) => setActiveMenu(menu)}
              onOpenNewInquiry={() => setIsNewScopeModalOpen(true)}
            />
          )}

          {/* View Switcher: Active Projects */}
          {activeMenu === "projects" && (
            <ActiveProjectsView
              projects={projects}
              clients={clients}
              onUpdateProjects={setProjects}
              showToast={showToast}
            />
          )}

          {/* View Switcher: Portfolio & Work (CMS) */}
          {activeMenu === "case_studies" && (
            <PortfolioCMSView
              projects={projects}
              onUpdateProjects={setProjects}
              showToast={showToast}
            />
          )}

          {/* View Switcher: Journal & Insights (CMS) */}
          {activeMenu === "articles" && (
            <JournalCMSView
              posts={posts}
              onUpdatePosts={setPosts}
              showToast={showToast}
            />
          )}

          {/* View Switcher: Client Directory (CRM) */}
          {activeMenu === "clients" && (
            <ClientDirectoryView
              clients={clients}
              onUpdateClients={setClients}
              showToast={showToast}
            />
          )}

          {/* View Switcher: Integrations & Webhooks (Pilar 6 Hub) */}
          {activeMenu === "integrations" && (
            <div className="flex-1 overflow-y-auto p-8">
              <IntegrationsControlView />
            </div>
          )}

          {/* View Switcher: Project Inquiries (CRM Table & Kanban) */}
          {activeMenu === "leads" && (
            <>
              {/* Control Toolbar (Table View, Filter, Sort, Statistics Toggle, Export) */}
              <div className="px-6 py-3.5 border-b border-[#eaecf0] bg-[#fafbfc] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {/* View Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "table" ? "kanban" : "table")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs font-bold text-gray-900 hover:bg-neutral-50 shadow-2xs transition-colors cursor-pointer"
                >
                  {viewMode === "table" ? (
                    <TableIcon className="w-3.5 h-3.5 text-neutral-500" />
                  ) : (
                    <KanbanSquare className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                  <span>{viewMode === "table" ? "Table View" : "Kanban Board"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>

              {/* Status Filter Dropdown */}
              <CustomFilterDropdown
                currentFilter={statusFilter}
                onSelect={(newFilter) => setStatusFilter(newFilter)}
              />

              {/* Show Statistics Toggle Switch (Matching Reference Image) */}
              <div className="flex items-center gap-2 pl-2">
                <span className="text-xs font-semibold text-neutral-500">Show Statistics</span>
                <button
                  type="button"
                  onClick={() => setShowStatistics(!showStatistics)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                    showStatistics ? "bg-black" : "bg-neutral-300"
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full transition-all shadow-sm ${
                      showStatistics ? "bg-[#a6f30d] translate-x-4" : "bg-white translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right Tools: Customize & Export */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Statistics Grid (Collapsible via toggle, exactly like screenshot) */}
          <AnimatePresence>
            {showStatistics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 border-b border-[#eaecf0] grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0 bg-white"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-neutral-400">Total Inquiries</span>
                  <div className="text-2xl font-bold font-['Questrial',sans-serif] text-gray-900">
                    {totalLeads}
                  </div>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-600 bg-emerald-50 leading-none">
                    +100% vs last month
                  </span>
                </div>

                <div className="space-y-1 border-l border-[#eaecf0] pl-4">
                  <span className="text-[11px] font-semibold text-neutral-400">Pipeline Value</span>
                  <div suppressHydrationWarning className="text-2xl font-bold font-['Questrial',sans-serif] text-gray-900">
                    ${formatPrice(activePipelineValue)}
                  </div>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-600 bg-emerald-50 leading-none">
                    +9% vs target
                  </span>
                </div>

                <div className="space-y-1 border-l border-[#eaecf0] pl-4">
                  <span className="text-[11px] font-semibold text-neutral-400">Signed Projects</span>
                  <div suppressHydrationWarning className="text-2xl font-bold font-['Questrial',sans-serif] text-gray-900">
                    ${formatPrice(closedWonValue)}
                  </div>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-600 bg-emerald-50 leading-none">
                    +7% closed
                  </span>
                </div>

                <div className="space-y-1 border-l border-[#eaecf0] pl-4">
                  <span className="text-[11px] font-semibold text-neutral-400">Avg. Turnaround</span>
                  <div className="text-2xl font-bold font-['Questrial',sans-serif] text-gray-900">
                    ~{avgVelocity} Wks
                  </div>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-600 bg-emerald-50 leading-none">
                    +5% efficiency
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─────────────────────────────────────────────────────────────
              3. DATA TABLE / KANBAN VIEW CONTAINER
             ───────────────────────────────────────────────────────────── */}
          <div className="flex-1 min-h-0 p-4 lg:p-6 flex flex-col relative overflow-hidden">
            {viewMode === "table" ? (
              /* TABLE VIEW (HORIZONTAL SCROLL + LEGA) */
              <div className="flex-1 min-h-0 rounded-2xl border border-[#eaecf0] bg-white shadow-2xs overflow-auto [scrollbar-width:thin]">
                <table className="w-full text-left text-xs min-w-[1050px]">
                  <thead className="sticky top-0 z-10 bg-[#f8f9fa] border-b border-[#eaecf0] text-neutral-400 uppercase tracking-wider text-[10px] shadow-2xs">
                    <tr>
                      <th className="py-3 px-4 w-10 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={
                              paginatedInquiries.length > 0 &&
                              selectedIds.length === paginatedInquiries.length
                            }
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-[#eaecf0] text-black focus:ring-0 cursor-pointer"
                          />
                        </div>
                      </th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 min-w-[200px]">Client / Brand</th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 min-w-[150px]">Service & Scope</th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 min-w-[160px]">Est. Budget</th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 min-w-[130px]">Est. Timeline</th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 min-w-[90px]">Priority</th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 min-w-[130px]">Status</th>
                      <th className="py-3 px-4 font-semibold text-neutral-500 text-right min-w-[80px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaecf0] text-gray-700">
                    {paginatedInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-neutral-400">
                          No client inquiries matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedInquiries.map((inq) => {
                        const isSelected = selectedIds.includes(inq.id);

                        return (
                          <tr
                            key={inq.id}
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setInternalNoteInput(inq.notes || "");
                            }}
                            className={`transition-colors cursor-pointer group ${
                              isSelected
                                ? "bg-[#fffdeb]"
                                : "hover:bg-[#fcfdfd]"
                            }`}
                          >
                            {/* Checkbox */}
                            <td
                              className="py-3.5 px-4 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelect(inq.id)}
                                  className="rounded border-neutral-300 text-black focus:ring-0 cursor-pointer"
                                />
                              </div>
                            </td>

                            {/* Client & Company */}
                            <td className="py-3.5 px-4 min-w-[200px]">
                              <div className="font-bold text-gray-900 group-hover:text-black transition-colors">
                                {inq.fullName}
                              </div>
                              <div className="text-[11px] text-neutral-400">
                                {inq.company || inq.email}
                              </div>
                            </td>

                            {/* Product Name */}
                            <td className="py-3.5 px-4 font-medium text-gray-800">
                              {inq.productName}
                            </td>

                            {/* Budget Range */}
                            <td suppressHydrationWarning className="py-3.5 px-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                              ${formatPrice(inq.estimatedPriceMin)} - $
                              {formatPrice(inq.estimatedPriceMax)}
                            </td>

                            {/* Velocity */}
                            <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                              ~{inq.estimatedWeeks} wks ({inq.velocity === "express" ? "Express Track" : "Standard"})
                            </td>

                            {/* Lead Priority */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                                  inq.leadScore === "ENTERPRISE_WHALE"
                                    ? "bg-purple-100 text-purple-800"
                                    : inq.leadScore === "HIGH_PRIORITY"
                                    ? "bg-[#d4f938] text-black"
                                    : "bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                {inq.leadScore === "ENTERPRISE_WHALE"
                                  ? "KEY ACCOUNT"
                                  : inq.leadScore === "HIGH_PRIORITY"
                                  ? "HIGH"
                                  : "STANDARD"}
                              </span>
                            </td>

                            {/* Status Pill Badge */}
                            <td
                              className="py-3.5 px-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <CustomStatusDropdown
                                currentStatus={inq.status}
                                onSelect={(newStatus) => handleStatusChange(inq.id, newStatus)}
                                align="right"
                              />
                            </td>

                            {/* Action Button */}
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedInquiry(inq);
                                  setInternalNoteInput(inq.notes || "");
                                }}
                                className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg border border-[#eaecf0] hover:bg-neutral-100 text-[11px] font-semibold text-neutral-600 transition-colors cursor-pointer whitespace-nowrap leading-none"
                              >
                                View Info
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* KANBAN BOARD VIEW (SCROLL MURNI KE BAWAH / VERTIKAL) */
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-4 [scrollbar-width:thin]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start w-full">
                  {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => {
                    const colLeads = filteredInquiries.filter((i) => i.status === statusKey);
                    return (
                      <div
                        key={statusKey}
                        className="p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#eaecf0] space-y-3 w-full"
                      >
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-gray-800">{cfg.label}</span>
                          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-white border border-[#eaecf0] text-neutral-600 text-[10px] font-bold leading-none shrink-0">
                            {colLeads.length}
                          </span>
                        </div>

                        <div className="space-y-2 min-h-[140px]">
                          {colLeads.length === 0 ? (
                            <div className="h-24 border border-dashed border-neutral-200 rounded-xl flex items-center justify-center text-[10px] text-neutral-400">
                              Empty
                            </div>
                          ) : (
                            colLeads.map((inq) => (
                              <div
                                key={inq.id}
                                onClick={() => {
                                  setSelectedInquiry(inq);
                                  setInternalNoteInput(inq.notes || "");
                                }}
                                className="p-3 rounded-xl bg-white border border-[#eaecf0] shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-2 group"
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-black leading-tight">
                                    {inq.fullName}
                                  </h4>
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                                </div>

                                {inq.company && (
                                  <p className="text-[10px] text-neutral-400 truncate">
                                    {inq.company}
                                  </p>
                                )}

                                <div className="text-[11px] font-medium text-neutral-600">
                                  {inq.productName}
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-[#f4f5f8] text-[10px]">
                                  <span suppressHydrationWarning className="font-mono font-bold text-gray-900">
                                    ${formatPrice(inq.estimatedPriceMin)}
                                  </span>
                                  <span className="text-neutral-400">~{inq.estimatedWeeks}w</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. FLOATING BOTTOM ACTION BAR (MATCHING REFERENCE IMAGE)
             ───────────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white border border-[#eaecf0] shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-full px-5 py-2.5 flex items-center gap-3"
              >
                <span className="text-xs font-bold text-gray-900 px-2 py-0.5 bg-neutral-100 rounded-full">
                  {selectedIds.length} Selected
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const firstId = selectedIds[0];
                    if (firstId) handleConvertLead(firstId);
                  }}
                  className="px-3 py-1.5 rounded-full bg-black text-[#a6f30d] font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Start Client Project</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Archive ${selectedIds.length} selected client inquiries?`)) {
                      selectedIds.forEach((id) => handleDeleteLead(id));
                    }
                  }}
                  className="px-3 py-1.5 rounded-full hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="p-1 rounded-full text-neutral-400 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─────────────────────────────────────────────────────────────
              5. PAGINATION FOOTER (MATCHING REFERENCE IMAGE)
             ───────────────────────────────────────────────────────────── */}
          <footer className="px-6 py-3.5 border-t border-[#eaecf0] bg-white flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs text-neutral-500">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span>Showing per page</span>
              <CustomPageSizeDropdown
                pageSize={pageSize}
                onSelect={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#eaecf0] hover:bg-neutral-50 disabled:opacity-40 cursor-pointer text-xs leading-none"
                >
                  «
                </button>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#eaecf0] hover:bg-neutral-50 disabled:opacity-40 cursor-pointer text-xs leading-none"
                >
                  ‹
                </button>

                <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-black text-[#a6f30d] font-bold text-xs leading-none">
                  {currentPage}
                </span>

                <span className="text-neutral-400 px-1 inline-flex items-center justify-center leading-none text-xs">of {totalPages}</span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#eaecf0] hover:bg-neutral-50 disabled:opacity-40 cursor-pointer text-xs leading-none"
                >
                  ›
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#eaecf0] hover:bg-neutral-50 disabled:opacity-40 cursor-pointer text-xs leading-none"
                >
                  »
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </main>

      {/* ─────────────────────────────────────────────────────────────
          6. SLIDE-OVER LEAD DOSSIER DRAWER
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="w-full max-w-lg h-full bg-white border-l border-[#eaecf0] p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#eaecf0] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Lead Dossier
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 font-['Questrial',sans-serif]">
                      {selectedInquiry.fullName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Switcher & Convert Action */}
                <div className="p-4 rounded-2xl bg-[#fafbfc] border border-[#eaecf0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Pipeline Status</span>
                    <CustomStatusDropdown
                      currentStatus={selectedInquiry.status}
                      onSelect={(newStatus) => handleStatusChange(selectedInquiry.id, newStatus)}
                      align="right"
                      variant="input"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isConverting}
                    onClick={() => handleConvertLead(selectedInquiry.id)}
                    className="w-full py-2.5 rounded-xl bg-black text-[#a6f30d] font-bold text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isConverting ? (
                      <span>Converting to Project...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#a6f30d]" />
                        <span>Convert to Active Client Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Client Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Client Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#eaecf0]">
                      <span className="text-neutral-400 block text-[10px]">Email Address</span>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-gray-900 hover:underline font-semibold flex items-center gap-1 mt-0.5 truncate"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                        <span className="truncate">{selectedInquiry.email}</span>
                      </a>
                    </div>
                    <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#eaecf0]">
                      <span className="text-neutral-400 block text-[10px]">Company / Brand</span>
                      <span className="text-gray-900 font-semibold block mt-0.5 truncate">
                        {selectedInquiry.company || "Individual Client"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scope & Valuation */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Scope & Commercials
                  </h4>
                  <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#eaecf0] space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#eaecf0]">
                      <span className="text-xs text-neutral-500">Service & Scope</span>
                      <span className="text-xs font-bold text-gray-900">{selectedInquiry.productName}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#eaecf0]">
                      <span className="text-xs text-neutral-500">Estimated Project Value</span>
                      <span suppressHydrationWarning className="text-xs font-mono font-bold text-gray-900">
                        ${formatPrice(selectedInquiry.estimatedPriceMin)} - $
                        {formatPrice(selectedInquiry.estimatedPriceMax)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">Estimated Delivery</span>
                      <span className="text-xs font-bold text-gray-900">
                        ~{selectedInquiry.estimatedWeeks} Weeks ({selectedInquiry.velocity === "express" ? "Express Sprint" : "Standard"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Selected Deliverables
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {parseFeatures(selectedInquiry.selectedFeatures).map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-medium"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Brief */}
                {selectedInquiry.projectDetails && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Client Brief & Scope Overview
                    </h4>
                    <p className="p-3.5 rounded-xl bg-[#fafbfc] text-xs text-gray-700 leading-relaxed border border-[#eaecf0]">
                      {selectedInquiry.projectDetails}
                    </p>
                  </div>
                )}

                {/* Internal Agency Notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Agency Strategy & Meeting Notes</span>
                    {selectedInquiry.notes && <span className="text-emerald-600 text-[10px]">Saved</span>}
                  </h4>
                  <textarea
                    rows={3}
                    placeholder="Tulis catatan meeting klien, strategi proposal, atau timeline follow-up di sini..."
                    value={internalNoteInput}
                    onChange={(e) => setInternalNoteInput(e.target.value)}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleSaveNotes}
                    className="px-4 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isUpdating ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-between">
                {userRole === "SUPER_ADMIN" ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteLead(selectedInquiry.id)}
                    className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Archive Inquiry</span>
                  </button>
                ) : (
                  <div />
                )}

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Labs%20Stdio%20-%20Project%20Scope`}
                  className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#a6f30d]" />
                  <span>Send Client Email</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Project Scope Modal Dialog */}
      <AnimatePresence>
        {isNewScopeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewScopeModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#eaecf0] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#eaecf0] bg-[#fafbfc] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a6f30d]" />
                    <h3 className="text-base font-bold text-gray-900 font-['Agrandir']">
                      Add New Client Inquiry
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Tambahkan brief atau inquiry proyek baru langsung ke pipeline agensi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewScopeModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleCreateScope} className="flex-1 overflow-y-auto p-6 space-y-4">
                {scopeError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {scopeError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={scopeForm.fullName}
                      onChange={(e) => setScopeForm({ ...scopeForm, fullName: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@company.com"
                      value={scopeForm.email}
                      onChange={(e) => setScopeForm({ ...scopeForm, email: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Brand / Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={scopeForm.company}
                      onChange={(e) => setScopeForm({ ...scopeForm, company: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Service Category *
                    </label>
                    <AdminCustomDropdown
                      options={SERVICE_CATEGORY_OPTIONS}
                      value={scopeForm.productType}
                      onChange={(val) => handleScopeProductChange(val)}
                      variant="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Est. Budget Min (USD)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={scopeForm.estimatedPriceMin}
                      onChange={(e) => setScopeForm({ ...scopeForm, estimatedPriceMin: Number(e.target.value) })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Est. Budget Max (USD)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={scopeForm.estimatedPriceMax}
                      onChange={(e) => setScopeForm({ ...scopeForm, estimatedPriceMax: Number(e.target.value) })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Est. Turnaround (Weeks)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={scopeForm.estimatedWeeks}
                      onChange={(e) => setScopeForm({ ...scopeForm, estimatedWeeks: Number(e.target.value) })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Delivery Track
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setScopeForm({ ...scopeForm, velocity: "standard" })}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        scopeForm.velocity === "standard"
                          ? "border-black bg-neutral-50 ring-1 ring-black"
                          : "border-[#eaecf0] hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">Standard Agile</span>
                        {scopeForm.velocity === "standard" && (
                          <Check className="w-3.5 h-3.5 text-black" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Iterative sprints & collaborative milestones</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScopeForm({ ...scopeForm, velocity: "express" })}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        scopeForm.velocity === "express"
                          ? "border-black bg-neutral-50 ring-1 ring-black"
                          : "border-[#eaecf0] hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          Fast-Track Delivery <Sparkles className="w-3 h-3 text-[#a6f30d]" />
                        </span>
                        {scopeForm.velocity === "express" && (
                          <Check className="w-3.5 h-3.5 text-black" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Priority dedicated team & accelerated launch</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Project Brief & Scope Overview
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi tujuan proyek, deliverable utama, atau catatan brief dari klien..."
                    value={scopeForm.projectDetails}
                    onChange={(e) => setScopeForm({ ...scopeForm, projectDetails: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewScopeModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingScope}
                    className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingScope ? (
                      <span>Adding Inquiry...</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#a6f30d]" />
                        <span>Add to Client Pipeline</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
