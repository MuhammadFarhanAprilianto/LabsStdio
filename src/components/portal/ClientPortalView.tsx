"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  User,
  Mail,
  Globe,
  Eye,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  AlertCircle,
  FileCheck,
  Layers,
  FolderKanban,
  ChevronRight,
  ChevronLeft,
  Search,
  Info,
  LogOut,
  CheckSquare,
  Square,
  Table as TableIcon,
  ShieldCheck,
  X,
  Code2,
  Laptop,
  Palette,
  FileText,
  Calendar,
  Upload,
  Plus,
  Trash2,
  Download,
  CreditCard,
  MessageSquarePlus,
  Receipt,
  DollarSign,
  FileDown,
  ArrowUpRight,
  QrCode,
  Lock,
  Copy,
  Printer,
} from "lucide-react";
import { AdminCustomDropdown } from "@/components/admin/AdminCustomDropdown";

export interface PortalOrganization {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  contactName: string | null;
  contactEmail: string;
  avatarUrl: string | null;
  projects: PortalProject[];
}

export interface PortalProject {
  id: string;
  title: string;
  clientName: string;
  year: string;
  category: string;
  overview: string;
  heroImage: string | null;
  liveDemoUrl: string | null;
  figmaUrl: string | null;
  deliverables: string;
  milestones: PortalMilestone[];
}

export interface PortalMilestone {
  id: string;
  projectId: string;
  order: number;
  title: string;
  description: string | null;
  deliverables: string | null;
  targetDate: string | null;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  approvalNotes: string | null;
}

export interface ClientAssetItem {
  id: string;
  organizationId: string;
  projectId?: string | null;
  name: string;
  category: string;
  fileUrl: string;
  fileSize?: string | null;
  fileType?: string | null;
  uploadedBy: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  projectId?: string | null;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: string | null;
  paidAt?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
}

export interface ScopeRequestItem {
  id: string;
  title: string;
  description: string;
  status: string;
  leadScore: string;
  estimatedWeeks: number;
  createdAt: string;
  requesterName?: string;
  requesterEmail?: string;
}

interface ClientPortalViewProps {
  isAdmin: boolean;
  adminName: string;
  adminEmail: string;
  currentOrg: PortalOrganization;
  allClients: PortalOrganization[];
  initialProject: PortalProject | null;
  initialAssets?: ClientAssetItem[];
  initialInvoices?: InvoiceItem[];
  initialScopeRequests?: ScopeRequestItem[];
}

export default function ClientPortalView({
  isAdmin,
  adminName,
  adminEmail,
  currentOrg,
  allClients,
  initialProject,
  initialAssets = [],
  initialInvoices = [],
  initialScopeRequests = [],
}: ClientPortalViewProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProject?.id || currentOrg.projects[0]?.id || ""
  );
  const [milestones, setMilestones] = useState<PortalMilestone[]>(
    initialProject?.milestones || currentOrg.projects[0]?.milestones || []
  );
  const [approvingMilestoneId, setApprovingMilestoneId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showStatistics, setShowStatistics] = useState<boolean>(true);
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "roadmap" | "deliverables" | "assets" | "requests" | "invoices" | "info"
  >("roadmap");

  // CRM & CMS Hybrid States
  const [assets, setAssets] = useState<ClientAssetItem[]>(initialAssets);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [scopeRequests, setScopeRequests] = useState<ScopeRequestItem[]>(initialScopeRequests);

  // Filters for tabs
  const [deliverableFilter, setDeliverableFilter] = useState<string>("ALL");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<string>("ALL");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>("ALL");
  const [scopeRequestFilter, setScopeRequestFilter] = useState<string>("ALL");

  // Modals
  const [isUploadAssetModalOpen, setIsUploadAssetModalOpen] = useState<boolean>(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);

  // International Dual Gateway Checkout & Receipt Modals
  const [selectedPayInvoice, setSelectedPayInvoice] = useState<InvoiceItem | null>(null);
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<InvoiceItem | null>(null);
  const [checkoutGateway, setCheckoutGateway] = useState<"STRIPE" | "MIDTRANS">("STRIPE");
  const [midtransSubMethod, setMidtransSubMethod] = useState<"QRIS" | "VA">("QRIS");
  const [selectedBankVA, setSelectedBankVA] = useState<"BCA" | "MANDIRI" | "BRI">("BCA");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  // Form states: Upload Asset
  const [newAssetName, setNewAssetName] = useState<string>("");
  const [newAssetCategory, setNewAssetCategory] = useState<string>("BRAND_LOGO");
  const [newAssetFile, setNewAssetFile] = useState<File | null>(null);
  const [isUploadingAsset, setIsUploadingAsset] = useState<boolean>(false);

  // Form states: Scope Request
  const [newReqTitle, setNewReqTitle] = useState<string>("");
  const [newReqDescription, setNewReqDescription] = useState<string>("");
  const [newReqPriority, setNewReqPriority] = useState<string>("STANDARD");
  const [newReqWeeks, setNewReqWeeks] = useState<number>(2);
  const [isSubmittingReq, setIsSubmittingReq] = useState<boolean>(false);

  const activeProject =
    currentOrg.projects.find((p) => p.id === selectedProjectId) ||
    currentOrg.projects[0] ||
    null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Live Real-Time EventSource (SSE) Integration
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource("/api/realtime/stream");

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "INVOICE_PAID") {
            const payload = data.payload;
            setInvoices((prev) =>
              prev.map((inv) =>
                inv.id === payload.invoiceId || inv.invoiceNumber === payload.invoiceNumber
                  ? { ...inv, status: "PAID", paidAt: payload.paidAt || new Date().toISOString() }
                  : inv
              )
            );
            showToast(`⚡ Live Update: Invoice #${payload.invoiceNumber} telah lunas!`);
          } else if (data.type === "MILESTONE_APPROVED") {
            const payload = data.payload;
            setMilestones((prev) =>
              prev.map((m) =>
                m.id === payload.milestoneId
                  ? {
                      ...m,
                      status: "APPROVED",
                      approvedBy: payload.approvedBy || "Client",
                      approvedAt: new Date().toISOString(),
                    }
                  : m
              )
            );
            showToast(`⚡ Live Update: Milestone "${payload.milestoneTitle}" telah disetujui!`);
          } else if (data.type === "SCOPE_REQUEST_CREATED") {
            if (!data.organizationId || data.organizationId === currentOrg.id) {
              router.refresh();
              showToast("⚡ Live Update: Permohonan Scope baru telah disinkronkan.");
            }
          }
        } catch {
          // Handshake or ping message
        }
      };

      eventSource.onerror = () => {
        // Browser automatically attempts reconnect with exponential backoff
      };
    } catch (err) {
      console.warn("[SSE_INIT_WARN]", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [currentOrg.id, router]);

  // Switch project within the organization
  const handleSelectProject = (proj: PortalProject) => {
    setSelectedProjectId(proj.id);
    setMilestones(proj.milestones || []);
    setSelectedMilestoneIds([]);
  };

  // 1. Client Sign-Off action
  const handleApproveMilestone = async (milestoneId: string) => {
    const approverName = currentOrg.contactName || currentOrg.name;
    setApprovingMilestoneId(milestoneId);

    try {
      const res = await fetch(`/api/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "APPROVED",
          approvedBy: approverName,
          approvedAt: new Date().toISOString(),
          approvalNotes: `Disetujui secara resmi oleh ${approverName}`,
        }),
      });

      if (!res.ok) {
        showToast("Gagal melakukan sign-off sprint.");
        return;
      }

      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                status: "APPROVED",
                approvedBy: approverName,
                approvedAt: new Date().toISOString(),
                approvalNotes: `Disetujui secara resmi oleh ${approverName}`,
              }
            : m
        )
      );

      showToast(`Sprint berhasil di-approve resmi oleh ${approverName}!`);
    } catch {
      showToast("Terjadi kendala jaringan saat sign-off.");
    } finally {
      setApprovingMilestoneId(null);
    }
  };

  // Selection toggle
  const toggleSelectMilestone = (id: string) => {
    setSelectedMilestoneIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMilestoneIds.length === filteredMilestones.length) {
      setSelectedMilestoneIds([]);
    } else {
      setSelectedMilestoneIds(filteredMilestones.map((m) => m.id));
    }
  };

  // 2. Logic: Upload Client Asset (Client CMS)
  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName) {
      showToast("Nama aset harus diisi.");
      return;
    }

    setIsUploadingAsset(true);
    try {
      let finalFileUrl = "/uploads/sample-asset.pdf";
      let fileSizeStr = "1.5 MB";
      let fileTypeStr = "application/octet-stream";

      if (newAssetFile) {
        const formData = new FormData();
        formData.append("file", newAssetFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalFileUrl = uploadData.url;
          fileSizeStr = `${(newAssetFile.size / (1024 * 1024)).toFixed(1)} MB`;
          fileTypeStr = newAssetFile.type;
        }
      }

      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: currentOrg.id,
          projectId: activeProject?.id || null,
          name: newAssetName,
          category: newAssetCategory,
          fileUrl: finalFileUrl,
          fileSize: fileSizeStr,
          fileType: fileTypeStr,
          uploadedBy: currentOrg.contactName || adminName || "Client",
        }),
      });

      if (!res.ok) {
        showToast("Gagal menyimpan aset ke vault.");
        return;
      }

      const data = await res.json();
      setAssets((prev) => [data.data, ...prev]);
      setIsUploadAssetModalOpen(false);
      setNewAssetName("");
      setNewAssetFile(null);
      showToast(`Aset "${newAssetName}" berhasil diunggah ke Vault!`);
    } catch {
      showToast("Terjadi kendala jaringan saat mengunggah aset.");
    } finally {
      setIsUploadingAsset(false);
    }
  };

  // Logic: Delete Client Asset
  const handleDeleteAsset = async (assetId: string, assetName: string) => {
    try {
      const res = await fetch(`/api/assets?id=${assetId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Gagal menghapus aset.");
        return;
      }
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      showToast(`Aset "${assetName}" berhasil dihapus.`);
    } catch {
      showToast("Kendala jaringan saat menghapus aset.");
    }
  };

  // 3. Logic: Submit New Scope Request (Client CRM)
  const handleSubmitScopeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle || !newReqDescription) {
      showToast("Judul dan deskripsi request harus diisi.");
      return;
    }

    setIsSubmittingReq(true);
    try {
      const res = await fetch("/api/scope-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: currentOrg.id,
          title: newReqTitle,
          description: newReqDescription,
          priority: newReqPriority,
          estimatedWeeks: newReqWeeks,
          requesterName: currentOrg.contactName || adminName,
          requesterEmail: currentOrg.contactEmail || adminEmail,
        }),
      });

      if (!res.ok) {
        showToast("Gagal mengirimkan permintaan scope.");
        return;
      }

      const data = await res.json();
      const formattedItem: ScopeRequestItem = {
        id: data.data.id,
        title: data.data.productName,
        description: data.data.projectDetails,
        status: data.data.status,
        leadScore: data.data.leadScore,
        estimatedWeeks: data.data.estimatedWeeks,
        createdAt: new Date().toISOString(),
        requesterName: data.data.fullName,
        requesterEmail: data.data.email,
      };

      setScopeRequests((prev) => [formattedItem, ...prev]);
      setIsNewRequestModalOpen(false);
      setNewReqTitle("");
      setNewReqDescription("");
      showToast(`Permintaan "${newReqTitle}" berhasil dikirim ke tim agency!`);
    } catch {
      showToast("Terjadi kendala jaringan saat submit request.");
    } finally {
      setIsSubmittingReq(false);
    }
  };

  // 4. Logic: Pay / Confirm Invoice (Client CRM Billing & Dual Gateway Settlement)
  const handleExecutePayment = async (
    invoice: InvoiceItem,
    gateway: "STRIPE" | "MIDTRANS",
    methodName: string
  ) => {
    setIsProcessingPayment(true);
    try {
      const gatewayLabel =
        gateway === "STRIPE"
          ? `Stripe Global USD (${methodName})`
          : `Midtrans Indonesia IDR (${methodName})`;

      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PAID",
          paymentGateway: gateway,
          paymentMethod: gatewayLabel,
        }),
      });

      if (!res.ok) {
        showToast("Gagal memproses otorisasi pembayaran ke gateway.");
        return;
      }

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoice.id
            ? { ...inv, status: "PAID", paidAt: new Date().toISOString() }
            : inv
        )
      );

      setSelectedPayInvoice(null);
      showToast(
        `Pembayaran ${invoice.invoiceNumber} senilai $${invoice.amount.toLocaleString()} berhasil diselesaikan via ${gatewayLabel}!`
      );
    } catch {
      showToast("Kendala jaringan saat proses otorisasi gateway.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string, _invoiceNumber: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (inv) {
      setSelectedPayInvoice(inv);
    }
  };

  // Extract all deliverables across milestones
  const allDeliverables = (() => {
    const list: {
      id: string;
      name: string;
      sprintNumber?: number;
      sprintTitle?: string;
      milestoneId?: string;
      milestoneStatus: string;
      targetDate?: string | null;
      approvedBy?: string | null;
      description?: string | null;
    }[] = [];

    milestones.forEach((m, mIdx) => {
      let items: string[] = [];
      try {
        items = JSON.parse(m.deliverables || "[]");
        if (!Array.isArray(items)) items = [];
      } catch {
        items = m.deliverables
          ? m.deliverables.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
      }

      if (items.length > 0) {
        items.forEach((item, itemIdx) => {
          list.push({
            id: `${m.id}-${itemIdx}`,
            name: item,
            sprintNumber: mIdx + 1,
            sprintTitle: m.title,
            milestoneId: m.id,
            milestoneStatus: m.status,
            targetDate: m.targetDate,
            approvedBy: m.approvedBy,
            description: m.description,
          });
        });
      } else {
        list.push({
          id: `${m.id}-pkg`,
          name: `${m.title} Deliverables`,
          sprintNumber: mIdx + 1,
          sprintTitle: m.title,
          milestoneId: m.id,
          milestoneStatus: m.status,
          targetDate: m.targetDate,
          approvedBy: m.approvedBy,
          description: m.description,
        });
      }
    });

    return list;
  })();

  // Filtered Deliverables
  const filteredDeliverables = allDeliverables.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.sprintTitle && d.sprintTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (deliverableFilter === "ALL") return true;
    return d.milestoneStatus === deliverableFilter;
  });

  // Filtered Assets
  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (assetCategoryFilter === "ALL") return true;
    return a.category === assetCategoryFilter;
  });

  // Filtered Scope Requests
  const filteredScopeRequests = scopeRequests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (scopeRequestFilter === "ALL") return true;
    return r.status === scopeRequestFilter;
  });

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (invoiceStatusFilter === "ALL") return true;
    return inv.status === invoiceStatusFilter;
  });

  // Filtering for milestones
  const filteredMilestones = milestones.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.deliverables && m.deliverables.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return m.status === statusFilter;
  });

  const completedMilestones = milestones.filter((m) => m.status === "APPROVED").length;
  const underReviewMilestones = milestones.filter((m) => m.status === "UNDER_REVIEW").length;
  const progressPercent =
    milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  // Financial calculations
  const totalContractAmount = invoices.reduce((acc, curr) => acc + curr.amount, 0) || 28000;
  const paidContractAmount = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingContractAmount = totalContractAmount - paidContractAmount;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f4f5f8] font-['Agrandir',sans-serif] text-gray-900 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-black text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-neutral-700"
          >
            <CheckCircle2 className="w-4 h-4 text-[#a6f30d]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          1. LEFT SIDEBAR (6 FULL POINTS WITH LOGIC FUNCTIONS)
         ───────────────────────────────────────────────────────────── */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-72"
        } bg-white border-r border-[#eaecf0] p-4 flex flex-col justify-between shrink-0 transition-all duration-300 relative z-20`}
      >
        <div className="space-y-4">
          {/* Company Branding & Collapse Trigger */}
          <div className="flex items-center justify-between gap-2.5 pb-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-black text-[#a6f30d] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                {currentOrg.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <span className="text-xs font-bold text-gray-900 block truncate font-['Questrial',sans-serif]">
                    {currentOrg.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate font-medium">
                    Verified Client Partner
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg border border-[#eaecf0] hover:bg-neutral-50 text-neutral-400 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Quick Search */}
          {!isSidebarCollapsed && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search portal, scope, assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#eaecf0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-400 transition-colors"
              />
            </div>
          )}

          {/* MAIN MENU (POINTS 1 S.D. 6 HYBRID CRM & CMS) */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 block mb-1">
                Collaboration Hub
              </span>
            )}

            {/* POINT 1: Sprint Roadmap */}
            <button
              type="button"
              onClick={() => setActiveTab("roadmap")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === "roadmap"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeTab === "roadmap" && (
                  <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />
                )}
                <FolderKanban
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "roadmap" ? "text-gray-900" : "text-neutral-400"
                  }`}
                />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Sprint Roadmap</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0 ml-auto">
                  {milestones.length}
                </span>
              )}
            </button>

            {/* POINT 2: Deliverables & QA */}
            <button
              type="button"
              onClick={() => setActiveTab("deliverables")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === "deliverables"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeTab === "deliverables" && (
                  <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />
                )}
                <FileCheck
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "deliverables" ? "text-gray-900" : "text-neutral-400"
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">Deliverables & QA</span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0 ml-auto">
                  {allDeliverables.length}
                </span>
              )}
            </button>

            {/* POINT 3: Asset Vault (Client CMS) */}
            <button
              type="button"
              onClick={() => setActiveTab("assets")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === "assets"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeTab === "assets" && (
                  <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />
                )}
                <Layers
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "assets" ? "text-gray-900" : "text-neutral-400"
                  }`}
                />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Asset Vault</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0 ml-auto">
                  {assets.length}
                </span>
              )}
            </button>

            {/* POINT 4: Scope Requests (Client CRM) */}
            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === "requests"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeTab === "requests" && (
                  <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />
                )}
                <MessageSquarePlus
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "requests" ? "text-gray-900" : "text-neutral-400"
                  }`}
                />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Scope Requests</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0 ml-auto">
                  {scopeRequests.length}
                </span>
              )}
            </button>

            {/* POINT 5: Billing & Invoices (Client CRM) */}
            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === "invoices"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeTab === "invoices" && (
                  <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />
                )}
                <Receipt
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "invoices" ? "text-gray-900" : "text-neutral-400"
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="whitespace-nowrap">Billing & Invoices</span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold leading-none shrink-0 ml-auto">
                  {invoices.length}
                </span>
              )}
            </button>

            {/* POINT 6: Project Specs */}
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === "info"
                  ? "bg-[#f8f9fa] text-gray-900 font-bold"
                  : "text-neutral-500 hover:text-gray-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeTab === "info" && (
                  <span className="w-1.5 h-4 rounded-full bg-[#a6f30d] absolute left-0" />
                )}
                <Building
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === "info" ? "text-gray-900" : "text-neutral-400"
                  }`}
                />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Project Specs</span>}
              </div>
            </button>
          </div>

          {/* ADMIN GHOST MODE CONTROL */}
          {isAdmin && !isSidebarCollapsed && (
            <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#eaecf0] space-y-2.5 mt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Eye className="w-3.5 h-3.5 text-neutral-800" />
                <span>Admin Ghost Mode</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                Melihat portal sebagai <strong className="text-gray-900">{currentOrg.name}</strong>
              </p>

              {/* Exact Custom Dropdown matching Website */}
              <AdminCustomDropdown
                variant="input"
                value={currentOrg.id}
                options={allClients.map((c) => ({
                  value: c.id,
                  label: c.name,
                  dot: "bg-[#a6f30d]",
                }))}
                onChange={(newOrgId) => router.push(`/portal?orgId=${newOrgId}`)}
                className="bg-white border-[#eaecf0] text-xs font-semibold"
              />

              <Link
                href="/admin"
                className="w-full py-1.5 px-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Kembali ke Admin</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#eaecf0] space-y-2">
          {activeProject?.liveDemoUrl && !isSidebarCollapsed && (
            <a
              href={activeProject.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-gray-900 hover:bg-neutral-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              <span>Live Staging Demo</span>
            </a>
          )}

          {!isSidebarCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-gray-900 hover:bg-neutral-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>Public Website</span>
            </Link>
          )}

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </form>

          {/* Client Profile Card */}
          {!isSidebarCollapsed && (
            <div className="p-2.5 rounded-2xl bg-[#f8f9fa] border border-[#eaecf0] flex items-center gap-2.5 mt-2">
              <div className="w-7 h-7 rounded-full bg-black text-white font-bold text-xs inline-flex items-center justify-center shrink-0 leading-none">
                {(currentOrg.contactName || currentOrg.name).charAt(0)}
              </div>
              <div className="truncate flex-1">
                <span className="text-xs font-bold text-gray-900 block truncate">
                  {currentOrg.contactName || currentOrg.name}
                </span>
                <span className="text-[10px] text-neutral-400 block truncate">
                  {currentOrg.contactEmail}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA (DYNAMIC VIEW ACCORDING TO ACTIVE TAB)
         ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 flex flex-col min-w-0 bg-[#f4f5f8] p-3 sm:p-4 lg:p-6 overflow-hidden">
        <div className="flex-1 min-h-0 bg-white rounded-3xl border border-[#eaecf0] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          {/* Top Header Row (Vertically Centered Items) */}
          <header className="px-6 sm:px-8 py-5 border-b border-[#eaecf0] flex items-center justify-between gap-4 shrink-0">
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
                  {activeTab === "roadmap" && (activeProject ? activeProject.title : "Sprint Roadmap")}
                  {activeTab === "deliverables" && "Deliverables & QA Verification"}
                  {activeTab === "assets" && "Client Asset Vault (CMS)"}
                  {activeTab === "requests" && "Scope & Change Requests (CRM)"}
                  {activeTab === "invoices" && "Billing, Invoices & Financials"}
                  {activeTab === "info" && "Project Specifications & Architecture"}
                </h1>
                <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] mt-0.5">
                  {activeTab === "roadmap" && `Client Portal & Sprint Sign-Off • ${currentOrg.name}`}
                  {activeTab === "deliverables" && `Daftar seluruh artefak dan deliverable sprint • ${activeProject?.title || currentOrg.name}`}
                  {activeTab === "assets" && `Penyimpanan materi logo, brandbook, dan copy proyek • ${currentOrg.name}`}
                  {activeTab === "requests" && `Pengajuan penambahan fitur & scope sprint baru • ${currentOrg.name}`}
                  {activeTab === "invoices" && `Ringkasan termin pembayaran, invoice, dan status kontrak • ${currentOrg.name}`}
                  {activeTab === "info" && `Spesifikasi teknis, repositori pengerjaan, dan profil organisasi ${currentOrg.name}`}
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons (Vertically Centered) */}
            <div className="flex items-center gap-2.5">
              {isAdmin && (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700">
                  <Eye className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Ghost Mode ({currentOrg.name})</span>
                </div>
              )}

              {activeTab === "assets" && (
                <button
                  type="button"
                  onClick={() => setIsUploadAssetModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload Asset</span>
                </button>
              )}

              {activeTab === "requests" && (
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Request Scope</span>
                </button>
              )}

              {activeProject?.liveDemoUrl && (
                <a
                  href={activeProject.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Live Staging</span>
                </a>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-xs transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Admin</span>
                </Link>
              )}
            </div>
          </header>

          {/* ═════════════════════════════════════════════════════════════
              TAB 1: SPRINT ROADMAP & CLIENT SIGN-OFF
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "roadmap" && (
            <>
              {/* Subheader Controls */}
              <div className="px-6 sm:px-8 py-3.5 border-b border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#eaecf0] bg-white text-xs font-semibold text-neutral-700 shadow-2xs">
                    <TableIcon className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Table View</span>
                  </div>

                  <AdminCustomDropdown
                    variant="filter"
                    value={statusFilter}
                    className="min-w-[130px] whitespace-nowrap"
                    options={[
                      { value: "ALL", label: "All Status", dot: "bg-neutral-400" },
                      { value: "UNDER_REVIEW", label: "Ready to Review", dot: "bg-amber-400" },
                      { value: "APPROVED", label: "Approved Sprints", dot: "bg-[#a6f30d]" },
                      { value: "IN_PROGRESS", label: "In Progress", dot: "bg-blue-400" },
                    ]}
                    onChange={(newFilter) => setStatusFilter(newFilter)}
                  />

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

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">
                    Total Sprints: <strong>{milestones.length}</strong>
                  </span>
                </div>
              </div>

              {/* 4 Statistics Cards Grid */}
              <AnimatePresence>
                {showStatistics && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 sm:px-8 py-4 border-b border-[#eaecf0] grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0 bg-[#fafbfc]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold text-neutral-400">
                          Sprint Completion
                        </span>
                        <Info className="w-3 h-3 text-neutral-400" />
                      </div>
                      <div className="text-2xl font-bold font-['Questrial',sans-serif] text-gray-900">
                        {progressPercent}%
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                        <span>
                          {completedMilestones} of {milestones.length} approved
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold text-neutral-400">
                          Action Required
                        </span>
                        <Info className="w-3 h-3 text-neutral-400" />
                      </div>
                      <div className="text-2xl font-bold font-['Questrial',sans-serif] text-gray-900">
                        {underReviewMilestones}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 font-semibold">
                        <span>Sprints ready for review</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold text-neutral-400">
                          Project Category
                        </span>
                        <Info className="w-3 h-3 text-neutral-400" />
                      </div>
                      <div className="text-xl font-bold font-['Questrial',sans-serif] text-gray-900 truncate">
                        {activeProject?.category || "Enterprise"}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Kickoff: {activeProject?.year || "Current"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold text-neutral-400">
                          Security & Specs
                        </span>
                        <Info className="w-3 h-3 text-neutral-400" />
                      </div>
                      <div className="text-sm font-bold text-gray-900 pt-1 flex items-center gap-1 text-emerald-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Mutual NDA Active</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {activeProject?.liveDemoUrl ? "Staging Deployed" : "Staging in QA"}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sprint Roadmap Data Table */}
              <div className="flex-1 min-h-0 overflow-auto relative">
                {filteredMilestones.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-2 text-neutral-400">
                    <FolderKanban className="w-10 h-10 stroke-1 text-neutral-300" />
                    <p className="text-sm font-semibold text-neutral-600">
                      Tidak ada sprint yang cocok dengan filter.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#fafafa] border-b border-[#eaecf0] sticky top-0 z-10 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-6 w-12 text-center">
                          <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="cursor-pointer text-neutral-400 hover:text-gray-900"
                            title="Select All"
                          >
                            {selectedMilestoneIds.length === filteredMilestones.length &&
                            filteredMilestones.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-black fill-[#a6f30d]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="py-3.5 px-6">Sprint & Scope</th>
                        <th className="py-3.5 px-6">Deliverables</th>
                        <th className="py-3.5 px-6">Target Date</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Client Sign-Off</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#eaecf0] text-xs text-gray-700">
                      {filteredMilestones.map((m, idx) => {
                        let deliverablesArr: string[] = [];
                        try {
                          deliverablesArr = JSON.parse(m.deliverables || "[]");
                          if (!Array.isArray(deliverablesArr)) deliverablesArr = [];
                        } catch {
                          deliverablesArr = m.deliverables ? [m.deliverables] : [];
                        }

                        const isSelected = selectedMilestoneIds.includes(m.id);
                        const isUnderReview = m.status === "UNDER_REVIEW";
                        const isApproved = m.status === "APPROVED";

                        return (
                          <tr
                            key={m.id}
                            className={`transition-colors ${
                              isSelected
                                ? "bg-[#f7fae8] border-l-2 border-l-[#a6f30d]"
                                : isUnderReview
                                ? "bg-[#fbfdf2]/80 hover:bg-[#f7fae8]"
                                : "hover:bg-[#fafafa]"
                            }`}
                          >
                            <td className="py-4 px-6 text-center align-middle">
                              <button
                                type="button"
                                onClick={() => toggleSelectMilestone(m.id)}
                                className="cursor-pointer text-neutral-400 hover:text-gray-900"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-black fill-[#a6f30d]" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            <td className="py-4 px-6 max-w-sm align-middle">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                    Sprint #{idx + 1}
                                  </span>
                                  <span className="font-bold text-gray-900 font-['Questrial',sans-serif]">
                                    {m.title}
                                  </span>
                                </div>
                                {m.description && (
                                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                                    {m.description}
                                  </p>
                                )}
                                {m.approvedBy && (
                                  <p className="text-[10px] text-emerald-600 font-semibold pt-0.5 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>
                                      Disetujui oleh {m.approvedBy}
                                      {m.approvalNotes ? ` — "${m.approvalNotes}"` : ""}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-6 align-middle">
                              {deliverablesArr.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-1">
                                  {deliverablesArr.map((d, dIdx) => (
                                    <span
                                      key={dIdx}
                                      className="px-2 py-0.5 rounded-md bg-[#f4f5f8] border border-[#eaecf0] text-neutral-700 text-[10px] font-medium"
                                    >
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-neutral-400 text-[11px]">—</span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-neutral-500 font-mono text-[11px] align-middle">
                              {m.targetDate
                                ? new Date(m.targetDate).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Scheduled"}
                            </td>

                            <td className="py-4 px-6 align-middle">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]">
                                  <Check className="w-3 h-3" />
                                  <span>Approved</span>
                                </span>
                              ) : isUnderReview ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  <span>Ready to Review</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                                  <span>In Progress</span>
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-right align-middle">
                              {isApproved ? (
                                <span className="text-xs text-neutral-400 font-medium italic">
                                  Signed Off ✓
                                </span>
                              ) : isUnderReview ? (
                                <button
                                  type="button"
                                  disabled={approvingMilestoneId === m.id}
                                  onClick={() => handleApproveMilestone(m.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span>
                                    {approvingMilestoneId === m.id
                                      ? "Memproses..."
                                      : "Approve & Sign-Off"}
                                  </span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-neutral-400">Menunggu QA</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {/* Floating Selection Bar */}
                <AnimatePresence>
                  {selectedMilestoneIds.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl bg-white border border-[#eaecf0] shadow-2xl flex items-center gap-3 z-30"
                    >
                      <span className="text-xs font-bold text-gray-900">
                        {selectedMilestoneIds.length} Selected
                      </span>
                      <div className="w-px h-4 bg-[#eaecf0]" />
                      <button
                        type="button"
                        onClick={() => {
                          const toApprove = milestones.filter(
                            (m) => selectedMilestoneIds.includes(m.id) && m.status === "UNDER_REVIEW"
                          );
                          if (toApprove.length === 0) {
                            showToast("Tidak ada sprint 'Ready to Review' pada item terpilih.");
                            return;
                          }
                          toApprove.forEach((m) => handleApproveMilestone(m.id));
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-900 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        Sign-Off Selected
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMilestoneIds([])}
                        className="p-1 text-neutral-400 hover:text-gray-900 cursor-pointer"
                        title="Clear selection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Pagination Bar */}
              <footer className="px-6 sm:px-8 py-3.5 border-t border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <span>Showing {filteredMilestones.length} of {milestones.length} sprints</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="w-7 h-7 rounded-lg border border-[#eaecf0] flex items-center justify-center text-neutral-300 cursor-not-allowed"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-[#a6f30d] text-black font-bold flex items-center justify-center shadow-xs"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    disabled
                    className="w-7 h-7 rounded-lg border border-[#eaecf0] flex items-center justify-center text-neutral-300 cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              </footer>
            </>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 2: DELIVERABLES & QA VERIFICATION
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "deliverables" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-auto bg-white">
              <div className="px-6 sm:px-8 py-3.5 border-b border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <AdminCustomDropdown
                    variant="filter"
                    value={deliverableFilter}
                    className="min-w-[140px] whitespace-nowrap"
                    options={[
                      { value: "ALL", label: "All Deliverables", dot: "bg-neutral-400" },
                      { value: "APPROVED", label: "Approved Artifacts", dot: "bg-[#a6f30d]" },
                      { value: "UNDER_REVIEW", label: "Pending QA / Review", dot: "bg-amber-400" },
                      { value: "IN_PROGRESS", label: "In Engineering", dot: "bg-blue-400" },
                    ]}
                    onChange={(newFilter) => setDeliverableFilter(newFilter)}
                  />
                  <div className="text-xs text-neutral-500">
                    Menampilkan <strong>{filteredDeliverables.length}</strong> hasil kerja sprint
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeProject?.figmaUrl && (
                    <a
                      href={activeProject.figmaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-[#eaecf0] hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 shadow-2xs"
                    >
                      <Palette className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Figma Components</span>
                    </a>
                  )}
                  {activeProject?.liveDemoUrl && (
                    <a
                      href={activeProject.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Live Staging QA</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto p-6 lg:p-8 flex flex-col justify-start">
                <div className="max-w-5xl mx-auto w-full space-y-6 my-auto">
                  {filteredDeliverables.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center p-8 text-center space-y-2 text-neutral-400 my-auto">
                      <FileCheck className="w-10 h-10 stroke-1 text-neutral-300" />
                      <p className="text-sm font-semibold text-neutral-600">
                        Tidak ada deliverable yang sesuai dengan filter.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {filteredDeliverables.map((deliv) => {
                        const isApproved = deliv.milestoneStatus === "APPROVED";
                        const isUnderReview = deliv.milestoneStatus === "UNDER_REVIEW";

                        return (
                          <div
                            key={deliv.id}
                            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                              isApproved
                                ? "bg-[#fafbfc] border-[#eaecf0] hover:border-neutral-300 shadow-2xs"
                                : isUnderReview
                                ? "bg-[#fbfdf2] border-[#a6f30d]/50 shadow-xs hover:border-[#a6f30d]"
                                : "bg-white border-[#eaecf0] hover:border-neutral-300 shadow-2xs"
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                  {deliv.sprintNumber ? `Sprint #${deliv.sprintNumber}` : "Scope"}
                                </span>

                                {isApproved ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]">
                                    <Check className="w-3 h-3" />
                                    <span>Approved</span>
                                  </span>
                                ) : isUnderReview ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    <span>Ready for QA</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                                    <span>In Engineering</span>
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1.5">
                                <div className="w-9 h-9 rounded-2xl bg-neutral-100 flex items-center justify-center text-gray-800 mb-2">
                                  <Code2 className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 font-['Questrial',sans-serif] leading-tight">
                                  {deliv.name}
                                </h3>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                  {deliv.sprintTitle}
                                </p>
                              </div>

                              {deliv.approvedBy && (
                                <p className="text-[10px] text-emerald-600 font-semibold pt-1 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Disetujui oleh {deliv.approvedBy}</span>
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between gap-2 text-xs">
                              <span className="text-neutral-400 font-mono text-[11px] flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {deliv.targetDate
                                    ? new Date(deliv.targetDate).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Scheduled"}
                                </span>
                              </span>

                              {isUnderReview && deliv.milestoneId && (
                                <button
                                  type="button"
                                  disabled={approvingMilestoneId === deliv.milestoneId}
                                  onClick={() => handleApproveMilestone(deliv.milestoneId!)}
                                  className="px-3 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                                >
                                  {approvingMilestoneId === deliv.milestoneId
                                    ? "Menyimpan..."
                                    : "Sign-Off QA"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 3: ASSET VAULT (CLIENT CMS - UPLOAD & MANAGE BRAND ASSETS)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "assets" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-auto bg-white">
              <div className="px-6 sm:px-8 py-3.5 border-b border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <AdminCustomDropdown
                    variant="filter"
                    value={assetCategoryFilter}
                    className="min-w-[140px] whitespace-nowrap"
                    options={[
                      { value: "ALL", label: "All Categories", dot: "bg-neutral-400" },
                      { value: "BRAND_LOGO", label: "Brand Logos", dot: "bg-[#a6f30d]" },
                      { value: "GUIDELINES", label: "Guidelines & Docs", dot: "bg-blue-400" },
                      { value: "COPYWRITING", label: "Copywriting", dot: "bg-purple-400" },
                      { value: "MEDIA", label: "Media & Imagery", dot: "bg-amber-400" },
                    ]}
                    onChange={(newCat) => setAssetCategoryFilter(newCat)}
                  />
                  <div className="text-xs text-neutral-500">
                    Menampilkan <strong>{filteredAssets.length}</strong> aset materi
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadAssetModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Aset Baru</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto p-6 lg:p-8 flex flex-col justify-start">
                <div className="max-w-5xl mx-auto w-full space-y-6 my-auto">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#fafafa] border border-[#eaecf0]">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Total Aset</span>
                      <p className="text-xl font-bold font-['Questrial',sans-serif] text-gray-900">{assets.length}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Brand Identity</span>
                      <p className="text-xl font-bold font-['Questrial',sans-serif] text-gray-900">
                        {assets.filter((a) => a.category === "BRAND_LOGO").length} Berkas
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Dokumen Panduan</span>
                      <p className="text-xl font-bold font-['Questrial',sans-serif] text-gray-900">
                        {assets.filter((a) => a.category === "GUIDELINES").length} Dokumen
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Status Vault</span>
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cloud Storage Active</span>
                      </p>
                    </div>
                  </div>

                  {filteredAssets.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center p-8 text-center space-y-2 text-neutral-400">
                      <Layers className="w-10 h-10 stroke-1 text-neutral-300" />
                      <p className="text-sm font-semibold text-neutral-600">Belum ada aset pada kategori ini.</p>
                      <button
                        type="button"
                        onClick={() => setIsUploadAssetModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] text-xs font-bold"
                      >
                        + Upload Aset Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {filteredAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="p-5 rounded-3xl border border-[#eaecf0] bg-white hover:border-[#a6f30d] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f5f8] border border-[#eaecf0] text-neutral-700 uppercase">
                                {asset.category.replace("_", " ")}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">{asset.fileSize || "1.0 MB"}</span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-gray-900 font-['Questrial',sans-serif] truncate">
                                {asset.name}
                              </h4>
                              <p className="text-[11px] text-neutral-500">
                                Diunggah oleh: <strong>{asset.uploadedBy}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between gap-2 text-xs">
                            <a
                              href={asset.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-gray-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteAsset(asset.id, asset.name)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus Aset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 4: SCOPE & CHANGE REQUESTS (CLIENT CRM)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "requests" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-auto bg-white">
              <div className="px-6 sm:px-8 py-3.5 border-b border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <AdminCustomDropdown
                    variant="filter"
                    value={scopeRequestFilter}
                    className="min-w-[140px] whitespace-nowrap"
                    options={[
                      { value: "ALL", label: "All Requests", dot: "bg-neutral-400" },
                      { value: "NEW", label: "Under Review", dot: "bg-blue-400" },
                      { value: "DISCOVERY_CALL", label: "In Scoping Session", dot: "bg-amber-400" },
                      { value: "WON", label: "Approved for Sprint", dot: "bg-[#a6f30d]" },
                    ]}
                    onChange={(newFilter) => setScopeRequestFilter(newFilter)}
                  />
                  <div className="text-xs text-neutral-500">
                    Menampilkan <strong>{filteredScopeRequests.length}</strong> permohonan scope
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewRequestModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajukan Scope Baru</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto p-6 lg:p-8 flex flex-col justify-start">
                <div className="max-w-5xl mx-auto w-full space-y-6 my-auto">
                  {/* Scope Requests KPI Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#fafafa] border border-[#eaecf0]">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Total Request</span>
                      <p className="text-xl font-bold font-['Questrial',sans-serif] text-gray-900">{scopeRequests.length}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Under Review</span>
                      <p className="text-xl font-bold font-['Questrial',sans-serif] text-blue-600">
                        {scopeRequests.filter((r) => r.status === "NEW").length} Permintaan
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Approved / In Sprint</span>
                      <p className="text-xl font-bold font-['Questrial',sans-serif] text-emerald-600">
                        {scopeRequests.filter((r) => r.status === "WON" || r.status === "PROPOSAL_SENT").length} Disetujui
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Integrasi Agency</span>
                      <p className="text-xs font-bold text-gray-900 flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#a6f30d]" />
                        <span>Realtime CRM Synced</span>
                      </p>
                    </div>
                  </div>

                  {filteredScopeRequests.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center p-8 text-center space-y-2 text-neutral-400">
                      <MessageSquarePlus className="w-10 h-10 stroke-1 text-neutral-300" />
                      <p className="text-sm font-semibold text-neutral-600">Belum ada pengajuan fitur atau change request.</p>
                      <button
                        type="button"
                        onClick={() => setIsNewRequestModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] text-xs font-bold"
                      >
                        + Ajukan Scope Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredScopeRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-6 rounded-3xl border border-[#eaecf0] bg-white hover:border-[#a6f30d] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                Estimasi: {req.estimatedWeeks || 2} Minggu
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  req.status === "WON"
                                    ? "bg-[#ede9fe] text-[#6d28d9]"
                                    : req.status === "DISCOVERY_CALL"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {req.status === "WON"
                                  ? "Approved for Sprint"
                                  : req.status === "DISCOVERY_CALL"
                                  ? "In Scoping Session"
                                  : "Under PM Review"}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="text-base font-bold text-gray-900 font-['Questrial',sans-serif]">
                                {req.title}
                              </h4>
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                {req.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between gap-2 text-xs text-neutral-500">
                            <span className="text-[11px]">
                              Diajukan: {new Date(req.createdAt).toLocaleDateString("id-ID")}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#fafafa] border border-[#eaecf0] text-[10px] font-bold">
                              Prioritas: {req.leadScore || "STANDARD"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 5: BILLING & INVOICES (CLIENT CRM FINANCIALS)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "invoices" && (
            <div className="flex-1 min-h-0 flex flex-col overflow-auto bg-white">
              <div className="px-6 sm:px-8 py-3.5 border-b border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <AdminCustomDropdown
                    variant="filter"
                    value={invoiceStatusFilter}
                    className="min-w-[140px] whitespace-nowrap"
                    options={[
                      { value: "ALL", label: "All Invoices", dot: "bg-neutral-400" },
                      { value: "PAID", label: "Paid Invoices", dot: "bg-[#a6f30d]" },
                      { value: "PENDING", label: "Pending Payment", dot: "bg-amber-400" },
                    ]}
                    onChange={(newFilter) => setInvoiceStatusFilter(newFilter)}
                  />
                  <div className="text-xs text-neutral-500">
                    Menampilkan <strong>{filteredInvoices.length}</strong> tagihan termin
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast("Laporan tagihan seluruh termin proyek berhasil di-ekspor.")}
                    className="px-3.5 py-1.5 rounded-xl border border-[#eaecf0] hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Download Summary Slip</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto p-6 lg:p-8 flex flex-col justify-start">
                <div className="max-w-5xl mx-auto w-full space-y-6 my-auto">
                  {/* Financial KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-6 rounded-3xl bg-[#fafafa] border border-[#eaecf0] space-y-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Total Kontrak Pengerjaan
                      </span>
                      <div className="text-2xl font-black font-['Questrial',sans-serif] text-gray-900">
                        ${totalContractAmount.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-neutral-500">Nilai resmi scope sprint pengerjaan</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#fafafa] border border-[#eaecf0] space-y-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Total Termin Terbayar
                      </span>
                      <div className="text-2xl font-black font-['Questrial',sans-serif] text-emerald-600">
                        ${paidContractAmount.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {totalContractAmount > 0
                            ? Math.round((paidContractAmount / totalContractAmount) * 100)
                            : 0}
                          % Pelunasan Kontrak
                        </span>
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#fafafa] border border-[#eaecf0] space-y-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Sisa Tagihan Pending
                      </span>
                      <div className="text-2xl font-black font-['Questrial',sans-serif] text-amber-600">
                        ${Math.max(0, pendingContractAmount).toLocaleString()}
                      </div>
                      <p className="text-[11px] text-neutral-500">Dapat dibayar sesuai termin milestone</p>
                    </div>
                  </div>

                  {/* Invoices List */}
                  <div className="rounded-3xl border border-[#eaecf0] bg-white overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#fafafa] border-b border-[#eaecf0] text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-4 px-6">No. Invoice</th>
                          <th className="py-4 px-6">Termin & Scope</th>
                          <th className="py-4 px-6">Nominal ($)</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaecf0] text-xs text-gray-700">
                        {filteredInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-[#fafafa] transition-colors">
                            <td className="py-4 px-6 font-mono font-bold text-gray-900">{inv.invoiceNumber}</td>
                            <td className="py-4 px-6 font-semibold text-gray-900">{inv.title}</td>
                            <td className="py-4 px-6 font-mono font-bold">${inv.amount.toLocaleString()}</td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  inv.status === "PAID"
                                    ? "bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {inv.status === "PAID" ? "Terbayar ✓" : "Pending Payment"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              {inv.status === "PENDING" ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedPayInvoice(inv)}
                                  className="px-3.5 py-1.5 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold shadow-2xs cursor-pointer inline-flex items-center gap-1.5 transition-transform active:scale-95"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  <span>Bayar Tagihan</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSelectedReceiptInvoice(inv)}
                                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-gray-800 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                                >
                                  <Receipt className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>Lihat Tax Invoice</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 6: PROJECT SPECS & ARCHITECTURE (POINT 6)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === "info" && (
            <div className="flex-1 min-h-0 overflow-auto p-6 lg:p-8 flex flex-col justify-start bg-white">
              <div className="max-w-5xl mx-auto w-full space-y-6 my-auto">
                {/* 1. Project Hero Overview Card */}
                <div className="p-7 sm:p-8 rounded-3xl bg-[#fafafa] border border-[#eaecf0] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#a6f30d] text-black">
                          {activeProject?.category || "Enterprise Project"}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          Batch Kickoff: {activeProject?.year || "Current"}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-['Questrial',sans-serif] text-gray-900">
                        {activeProject?.title || currentOrg.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeProject?.liveDemoUrl && (
                        <a
                          href={activeProject.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          <span>Buka Live Staging</span>
                        </a>
                      )}
                      {activeProject?.figmaUrl && (
                        <a
                          href={activeProject.figmaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl border border-[#eaecf0] hover:bg-neutral-100 text-xs font-semibold text-gray-800 flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <Palette className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Buka Figma Specs</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
                    {activeProject?.overview ||
                      "Proyek pengerjaan solusi digital berstandar tinggi yang mencakup token architecture, arsitektur UI/UX kustom, serta sistem engineering enterprise oleh Studio LabsStdio."}
                  </p>
                </div>

                {/* 2. Technical Specifications & Environments (3 Balanced Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-6 rounded-3xl border border-[#eaecf0] bg-white space-y-4 flex flex-col justify-between shadow-2xs">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-neutral-100 text-gray-800 flex items-center justify-center shrink-0">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">Staging Server</h3>
                          <p className="text-[10px] text-neutral-400">Environment Deployment</p>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-700 bg-[#f8f9fa] p-3 rounded-2xl border border-[#eaecf0] font-mono truncate">
                        {activeProject?.liveDemoUrl || "Internal Sandbox QA"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SSL Active & Protected</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl border border-[#eaecf0] bg-white space-y-4 flex flex-col justify-between shadow-2xs">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-neutral-100 text-gray-800 flex items-center justify-center shrink-0">
                          <Palette className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">Design System</h3>
                          <p className="text-[10px] text-neutral-400">Figma Tokens & UI Kit</p>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-700 bg-[#f8f9fa] p-3 rounded-2xl border border-[#eaecf0] font-mono truncate">
                        {activeProject?.figmaUrl || "Private Workspace Synced"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Typography & Colors Linked</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl border border-[#eaecf0] bg-white space-y-4 flex flex-col justify-between shadow-2xs">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-neutral-100 text-gray-800 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">Enterprise NDA</h3>
                          <p className="text-[10px] text-neutral-400">Legal Compliance</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed bg-[#f8f9fa] p-3 rounded-2xl border border-[#eaecf0]">
                        Dilindungi penuh oleh Perjanjian Kerahasiaan (NDA) Mutual Enterprise LabsStdio.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Perjanjian Terverifikasi</span>
                    </div>
                  </div>
                </div>

                {/* 3. Organization & Stakeholder Directory */}
                <div className="p-7 sm:p-8 rounded-3xl border border-[#eaecf0] bg-white space-y-4 shadow-2xs">
                  <h3 className="text-sm font-bold text-gray-900 font-['Questrial',sans-serif] flex items-center gap-2">
                    <Building className="w-4 h-4 text-neutral-700" />
                    <span>Informasi Organisasi & Stakeholder Klien</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#eaecf0] space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Nama Entitas Klien</span>
                      <p className="font-bold text-gray-900 text-sm">{currentOrg.name}</p>
                      <p className="text-neutral-500 text-[11px]">{currentOrg.industry || "Enterprise Partner"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#eaecf0] space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Perwakilan Resmi</span>
                      <p className="font-bold text-gray-900 text-sm">{currentOrg.contactName || currentOrg.name}</p>
                      <p className="text-neutral-500 text-[11px] font-mono">{currentOrg.contactEmail}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#eaecf0] space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Domain / Website Resmi</span>
                      {currentOrg.website ? (
                        <a
                          href={currentOrg.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-gray-900 text-sm hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3 text-[#a6f30d]" />
                          <span>{currentOrg.website.replace(/^https?:\/\//, "")}</span>
                        </a>
                      ) : (
                        <p className="text-neutral-400">Belum ditautkan</p>
                      )}
                      <p className="text-neutral-500 text-[11px]">Primary Production Domain</p>
                    </div>
                  </div>
                </div>

                {/* 4. Admin Ghost Mode Controller Inspector (When Admin) */}
                {isAdmin && (
                  <div className="p-6 sm:p-7 rounded-3xl border border-[#a6f30d]/40 bg-[#fbfdf2] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-gray-900">
                        <Eye className="w-4 h-4 text-neutral-900" />
                        <span>Admin Ghost Mode Active Session</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                        Melihat portal atas nama <strong className="text-gray-900">{currentOrg.name}</strong>. Operator Admin: <strong className="text-gray-900">{adminName}</strong> ({adminEmail}).
                      </p>
                    </div>

                    <Link
                      href="/admin"
                      className="px-4 py-2 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Admin CRM</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: UPLOAD CLIENT ASSET (CLIENT CMS)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isUploadAssetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#eaecf0] space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-black text-[#a6f30d] flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Upload Aset ke Vault</h3>
                    <p className="text-[11px] text-neutral-400">Logo, dokumen brand, atau copy</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadAssetModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadAsset} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Nama Aset / Berkas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Brand Guidelines 2026.pdf"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-900 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Kategori Aset</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-900 font-medium focus:outline-hidden"
                  >
                    <option value="BRAND_LOGO">Brand Logo (SVG/PNG)</option>
                    <option value="GUIDELINES">Guidelines & Brandbook</option>
                    <option value="COPYWRITING">Copywriting & Teks</option>
                    <option value="MEDIA">Media & Fotografi</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Pilih File (Gambar/Dokumen/PDF)</label>
                  <input
                    type="file"
                    onChange={(e) => setNewAssetFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-black file:text-white cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadAssetModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#eaecf0] text-gray-700 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingAsset}
                    className="px-4 py-2 rounded-xl bg-black text-[#a6f30d] font-bold shadow-xs cursor-pointer"
                  >
                    {isUploadingAsset ? "Mengunggah..." : "Simpan Aset"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: REQUEST NEW SCOPE (CLIENT CRM)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isNewRequestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#eaecf0] space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#eaecf0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-black text-[#a6f30d] flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Ajukan Fitur / Scope Baru</h3>
                    <p className="text-[11px] text-neutral-400">Kirim brief ke tim PM LabsStdio</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitScopeRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Judul Fitur / Scope</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Modul AI Analytics Dashboard"
                    value={newReqTitle}
                    onChange={(e) => setNewReqTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-900 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Rincian Deskripsi & Harapan Output</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Deskripsikan fitur yang diinginkan secara detail..."
                    value={newReqDescription}
                    onChange={(e) => setNewReqDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-900 focus:outline-hidden focus:border-black font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Prioritas Pengerjaan</label>
                    <select
                      value={newReqPriority}
                      onChange={(e) => setNewReqPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-900 font-medium focus:outline-hidden"
                    >
                      <option value="STANDARD">Standard Velocity</option>
                      <option value="HIGH_PRIORITY">High Priority</option>
                      <option value="URGENT">Urgent / Express Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Target Durasi (Minggu)</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={newReqWeeks}
                      onChange={(e) => setNewReqWeeks(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#eaecf0] bg-[#fafafa] text-gray-900 font-medium focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewRequestModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#eaecf0] text-gray-700 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReq}
                    className="px-4 py-2 rounded-xl bg-black text-[#a6f30d] font-bold shadow-xs cursor-pointer"
                  >
                    {isSubmittingReq ? "Mengirim..." : "Kirim Brief Scope"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: INTERNATIONAL DUAL GATEWAY CHECKOUT (STRIPE & MIDTRANS)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPayInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#eaecf0] space-y-5 my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#eaecf0] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-black text-[#a6f30d] flex items-center justify-center shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">Labs Stdio Secure Checkout</h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        256-Bit SSL • PCI-DSS
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Settle invoice termin {selectedPayInvoice.invoiceNumber}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPayInvoice(null)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Invoice Summary Box */}
              <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#eaecf0] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {selectedPayInvoice.invoiceNumber}
                  </span>
                  <div className="text-xs font-bold text-gray-900">{selectedPayInvoice.title}</div>
                  <div className="text-[11px] text-neutral-500">{currentOrg.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-['Questrial',sans-serif] text-gray-900">
                    ${selectedPayInvoice.amount.toLocaleString()} <span className="text-xs font-sans text-neutral-400">USD</span>
                  </div>
                  <div className="text-[11px] font-mono font-medium text-emerald-600">
                    ≈ Rp {(selectedPayInvoice.amount * 16000).toLocaleString("id-ID")} IDR
                  </div>
                </div>
              </div>

              {/* Gateway Channel Selector (Tabs) */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Pilih Saluran Pembayaran Internasional / Domestik:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCheckoutGateway("STRIPE")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      checkoutGateway === "STRIPE"
                        ? "border-black bg-black text-white shadow-md ring-2 ring-black/10"
                        : "border-[#eaecf0] bg-white text-gray-700 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Globe className={`w-3.5 h-3.5 ${checkoutGateway === "STRIPE" ? "text-[#a6f30d]" : "text-neutral-500"}`} />
                        <span className="text-xs font-bold">Stripe Global</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        checkoutGateway === "STRIPE" ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                      }`}>
                        USD / Global
                      </span>
                    </div>
                    <p className={`text-[10px] line-clamp-1 ${checkoutGateway === "STRIPE" ? "text-neutral-300" : "text-neutral-500"}`}>
                      Credit Card, Apple Pay, Google Pay
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutGateway("MIDTRANS")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      checkoutGateway === "MIDTRANS"
                        ? "border-black bg-black text-white shadow-md ring-2 ring-black/10"
                        : "border-[#eaecf0] bg-white text-gray-700 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Building className={`w-3.5 h-3.5 ${checkoutGateway === "MIDTRANS" ? "text-[#a6f30d]" : "text-neutral-500"}`} />
                        <span className="text-xs font-bold">Midtrans Indonesia</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        checkoutGateway === "MIDTRANS" ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                      }`}>
                        IDR / Lokal
                      </span>
                    </div>
                    <p className={`text-[10px] line-clamp-1 ${checkoutGateway === "MIDTRANS" ? "text-neutral-300" : "text-neutral-500"}`}>
                      QRIS Instant & Virtual Account (BCA/Mandiri)
                    </p>
                  </button>
                </div>
              </div>

              {/* Gateway Channel View: STRIPE GLOBAL */}
              {checkoutGateway === "STRIPE" && (
                <div className="space-y-4 pt-1">
                  {/* Virtual Card Preview */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b] text-white shadow-lg space-y-4 relative overflow-hidden border border-neutral-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#a6f30d]/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="text-xs font-mono font-bold tracking-widest text-[#a6f30d]">
                        LABS STDIO GLOBAL SECURE
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-md">VISA</span>
                        <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-md">MC</span>
                        <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-md">AMEX</span>
                      </div>
                    </div>

                    <div className="pt-2 relative z-10">
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">Card Number</div>
                      <div className="font-mono text-base tracking-widest text-neutral-200">
                        •••• •••• •••• 4242
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs relative z-10">
                      <div>
                        <div className="text-[9px] text-neutral-400 uppercase tracking-wider">Cardholder</div>
                        <div className="font-semibold text-white">{currentOrg.contactName || currentOrg.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-neutral-400 uppercase tracking-wider">Expires</div>
                        <div className="font-mono text-white">12/28</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#eaecf0] space-y-1 text-[11px] text-neutral-600">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>3D Secure 2.0 & Cross-Border Optimized</span>
                    </div>
                    <p className="text-neutral-500 text-[10px] pl-5">
                      Tagihan diproses dalam USD ($) dan otomatis terkonversi pada tagihan corporate credit card Anda dengan 0% biaya admin.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={() =>
                      handleExecutePayment(
                        selectedPayInvoice,
                        "STRIPE",
                        "Corporate Visa •••• 4242"
                      )
                    }
                    className="w-full py-3.5 rounded-2xl bg-black text-[#a6f30d] hover:bg-neutral-800 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.99] disabled:opacity-60"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#a6f30d] border-t-transparent rounded-full animate-spin" />
                        <span>Mengotorisasi Stripe Global Network...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Bayar ${selectedPayInvoice.amount.toLocaleString()} USD via Stripe Global</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Gateway Channel View: MIDTRANS INDONESIA */}
              {checkoutGateway === "MIDTRANS" && (
                <div className="space-y-4 pt-1">
                  {/* Midtrans Sub-method Toggle */}
                  <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMidtransSubMethod("QRIS")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        midtransSubMethod === "QRIS"
                          ? "bg-white text-gray-900 shadow-2xs"
                          : "text-neutral-500 hover:text-gray-900"
                      }`}
                    >
                      QRIS Instant (GoPay / BCA / Livin)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMidtransSubMethod("VA")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        midtransSubMethod === "VA"
                          ? "bg-white text-gray-900 shadow-2xs"
                          : "text-neutral-500 hover:text-gray-900"
                      }`}
                    >
                      Virtual Account (BCA / Mandiri / BRI)
                    </button>
                  </div>

                  {/* QRIS View */}
                  {midtransSubMethod === "QRIS" && (
                    <div className="p-4 rounded-2xl border border-[#eaecf0] bg-white flex flex-col items-center justify-center text-center space-y-3">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold">
                        <span>QRIS Standar Pembayaran Nasional</span>
                      </div>

                      {/* Simulated QR Code with Scan Line Animation */}
                      <div className="relative p-3 bg-white border-2 border-neutral-900 rounded-2xl shadow-sm overflow-hidden">
                        <div className="w-44 h-44 flex items-center justify-center bg-neutral-50 rounded-xl relative">
                          <QrCode className="w-36 h-36 text-gray-900" />
                          <div className="absolute inset-x-2 h-0.5 bg-[#a6f30d] shadow-[0_0_8px_#a6f30d] animate-pulse top-1/2" />
                        </div>
                        <div className="mt-2 text-[10px] font-mono font-bold text-gray-700">
                          NMID: ID102948201948 • LABS STDIO
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left max-w-sm space-y-1">
                        <div className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                          <span>💡 Mode Sandbox / Development:</span>
                        </div>
                        <p className="text-[10px] text-amber-700 leading-relaxed">
                          Di lingkungan pengujian lokal, barcode ini adalah representasi simulasi agar saldo GoPay asli Anda tidak terpotong Rp 104.000.000. Untuk menyelesaikan pengujian pembayaran, klik tombol hitam di bawah.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() =>
                          handleExecutePayment(
                            selectedPayInvoice,
                            "MIDTRANS",
                            "QRIS Instant"
                          )
                        }
                        className="w-full py-3 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-transform active:scale-[0.99] disabled:opacity-60"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#a6f30d] border-t-transparent rounded-full animate-spin" />
                            <span>Memverifikasi Notifikasi Midtrans QRIS...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Simulasi Scan QRIS Selesai (Rp {(selectedPayInvoice.amount * 16000).toLocaleString("id-ID")})</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Virtual Account View */}
                  {midtransSubMethod === "VA" && (
                    <div className="p-4 rounded-2xl border border-[#eaecf0] bg-white space-y-4">
                      {/* Bank Selector */}
                      <div className="grid grid-cols-3 gap-2">
                        {(["BCA", "MANDIRI", "BRI"] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBankVA(b)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              selectedBankVA === b
                                ? "bg-black text-[#a6f30d] border-black"
                                : "bg-neutral-50 text-gray-700 border-[#eaecf0] hover:bg-neutral-100"
                            }`}
                          >
                            Bank {b}
                          </button>
                        ))}
                      </div>

                      {/* VA Number Display Box */}
                      <div className="p-3.5 rounded-xl bg-[#fafafa] border border-[#eaecf0] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Nomor Virtual Account {selectedBankVA}
                          </div>
                          <div className="font-mono text-base font-bold text-gray-900 tracking-wider">
                            {selectedBankVA === "BCA" && "8801 2948 1029 4821"}
                            {selectedBankVA === "MANDIRI" && "8902 3847 1928 3847"}
                            {selectedBankVA === "BRI" && "8703 4920 1839 4029"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCopiedVA(true);
                            navigator.clipboard.writeText(
                              selectedBankVA === "BCA"
                                ? "8801294810294821"
                                : selectedBankVA === "MANDIRI"
                                ? "8902384719283847"
                                : "8703492018394029"
                            );
                            setTimeout(() => setCopiedVA(false), 2000);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-[#eaecf0] bg-white text-[11px] font-semibold text-gray-700 hover:bg-neutral-50 flex items-center gap-1 shadow-2xs"
                        >
                          <Copy className="w-3 h-3 text-neutral-500" />
                          <span>{copiedVA ? "Disalin ✓" : "Salin VA"}</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 space-y-1">
                        <div className="font-bold text-gray-800">Petunjuk Pembayaran:</div>
                        <div>1. Masuk ke M-Banking / ATM {selectedBankVA}.</div>
                        <div>2. Pilih menu Transfer &gt; Virtual Account Billing.</div>
                        <div>3. Masukkan nomor VA di atas dan konfirmasi nama &quot;LABS STDIO - {currentOrg.name}&quot;.</div>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() =>
                          handleExecutePayment(
                            selectedPayInvoice,
                            "MIDTRANS",
                            `${selectedBankVA} Virtual Account`
                          )
                        }
                        className="w-full py-3 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-transform active:scale-[0.99] disabled:opacity-60"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#a6f30d] border-t-transparent rounded-full animate-spin" />
                            <span>Mengecek Settlement Midtrans VA...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Konfirmasi Transfer VA Berhasil (Rp {(selectedPayInvoice.amount * 16000).toLocaleString("id-ID")})</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: OFFICIAL INTERNATIONAL TAX INVOICE & RECEIPT SLIP
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedReceiptInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#eaecf0] space-y-6 my-8 text-gray-900"
            >
              {/* Slip Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eaecf0] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Questrial',sans-serif] text-2xl font-black tracking-tight text-gray-900">
                      LABS STDIO
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#a6f30d] text-black uppercase">
                      Official Tax Invoice
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Design &amp; Engineering Studio • Singapore &amp; Jakarta
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Tax ID: SG-2026-9948201 • Reg: ENT-8891024
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PAID IN FULL / LUNAS</span>
                  </span>
                  <div className="text-xs font-mono font-bold text-gray-900 mt-2">
                    {selectedReceiptInvoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Paid: {selectedReceiptInvoice.paidAt ? new Date(selectedReceiptInvoice.paidAt).toLocaleDateString() : "Confirmed"}
                  </div>
                </div>
              </div>

              {/* Billed To & Studio Details */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Billed To / Ditagihkan Kepada:
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{currentOrg.name}</div>
                  <div className="text-neutral-600">{currentOrg.contactName || "Corporate Representative"}</div>
                  <div className="text-neutral-500 font-mono text-[11px]">{currentOrg.contactEmail}</div>
                  <div className="text-neutral-400 text-[10px] mt-1">{currentOrg.website || "https://client-partner.com"}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Settlement Details:
                  </div>
                  <div className="text-neutral-700 font-medium">Sprint Scope Sign-off Verified</div>
                  <div className="text-neutral-500 text-[11px]">Payment Gateway: Stripe / Midtrans Hybrid</div>
                  <div className="text-emerald-700 font-mono font-bold text-[11px] mt-1">
                    Auth Reference: REF-{selectedReceiptInvoice.id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="rounded-2xl border border-[#eaecf0] overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#fafafa] border-b border-[#eaecf0] text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item Scope</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaecf0]">
                    <tr>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{selectedReceiptInvoice.title}</div>
                        <div className="text-[11px] text-neutral-400">Termin deliverable milestone resmi pengerjaan</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">1</td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold">
                        ${selectedReceiptInvoice.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                        ${selectedReceiptInvoice.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">${selectedReceiptInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Cross-Border Tax / PPN (0%):</span>
                    <span className="font-mono">$0.00</span>
                  </div>
                  <div className="border-t border-[#eaecf0] pt-2 flex justify-between font-bold text-gray-900 text-sm">
                    <span>Total Paid (USD):</span>
                    <span className="font-mono text-base font-black text-black">
                      ${selectedReceiptInvoice.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right text-[11px] font-mono text-emerald-600 font-semibold">
                    ≈ Rp {(selectedReceiptInvoice.amount * 16000).toLocaleString("id-ID")} IDR
                  </div>
                </div>
              </div>

              {/* Footer Stamp & Actions */}
              <div className="border-t border-[#eaecf0] pt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digitally Signed &amp; Verified by Labs Stdio Treasury</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-black text-[#a6f30d] hover:bg-neutral-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak / Simpan PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptInvoice(null)}
                    className="px-4 py-2 rounded-xl border border-[#eaecf0] hover:bg-neutral-50 text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
