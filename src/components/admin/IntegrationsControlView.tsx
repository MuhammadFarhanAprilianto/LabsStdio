"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Radio,
  CheckCircle2,
  Clock,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  AlertCircle,
} from "lucide-react";

interface ChannelInfo {
  name: string;
  status: string;
  envConfigured: boolean;
  targetChatId?: string;
  sender?: string;
  endpointUrl?: string;
}

interface IntegrationData {
  channels: {
    telegram: ChannelInfo;
    discord: ChannelInfo;
    resend: ChannelInfo;
    stripe: ChannelInfo;
    midtrans: ChannelInfo;
  };
  recentLogs: Array<{
    id: string;
    action: string;
    actorName: string;
    details: string | null;
    createdAt: string;
  }>;
}

export default function IntegrationsControlView() {
  const [data, setData] = useState<IntegrationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testingTarget, setTestingTarget] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ target: string; latency: number } | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [isSimulatingStripe, setIsSimulatingStripe] = useState(false);
  const [isSimulatingMidtrans, setIsSimulatingMidtrans] = useState(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/integrations/status");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load status:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestPing = async (target: string) => {
    try {
      setTestingTarget(target);
      const res = await fetch("/api/integrations/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const json = await res.json();
      if (json.success) {
        setTestResult({ target, latency: json.totalLatencyMs });
        fetchStatus();
      }
    } catch (e) {
      console.error("Ping error:", e);
    } finally {
      setTestingTarget(null);
    }
  };

  const handleSimulateStripePayment = async () => {
    try {
      setIsSimulatingStripe(true);
      const res = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "checkout.session.completed",
          data: {
            object: {
              metadata: { invoiceNumber: "INV-2026-088" },
              customer_details: { name: "Ahmad Fauzi (Enterprise Corp)" },
            },
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSimulationToast("Stripe Webhook sukses! Invoice diselesaikan otomatis.");
        setTimeout(() => setSimulationToast(null), 4000);
        fetchStatus();
      }
    } catch (e) {
      console.error("Stripe simulation error:", e);
    } finally {
      setIsSimulatingStripe(false);
    }
  };

  const handleSimulateMidtransPayment = async () => {
    try {
      setIsSimulatingMidtrans(true);
      const res = await fetch("/api/webhooks/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: "INV-2026-088",
          status_code: "200",
          gross_amount: "14000.00",
          transaction_status: "settlement",
          payment_type: "qris",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSimulationToast("Midtrans QRIS Webhook sukses! Invoice lunas & Telegram notifikasi terpicu.");
        setTimeout(() => setSimulationToast(null), 4000);
        fetchStatus();
      }
    } catch (e) {
      console.error("Midtrans simulation error:", e);
    } finally {
      setIsSimulatingMidtrans(false);
    }
  };

  const copyEndpointUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedEndpoint(key);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a6f30d] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase">
              Pilar 6 • Third-Party Ecosystem Hub
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-neutral-900 mt-1">
            Integrations, Webhooks & Automated Dispatcher
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitoring koneksi bot Telegram, webhook Discord, email Resend, dan payment gateway Stripe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTestPing("all")}
            disabled={testingTarget !== null}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#07080b] hover:bg-neutral-800 text-[#a6f30d] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 ${testingTarget === "all" ? "animate-spin" : ""}`} />
            {testingTarget === "all" ? "Testing All..." : "Ping All Channels"}
          </button>
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {simulationToast && (
        <div className="bg-[#f4fbf1] border border-[#a6f30d] text-neutral-900 p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{simulationToast}</span>
          </div>
          <button onClick={() => setSimulationToast(null)} className="text-neutral-500 hover:text-black">
            ✕
          </button>
        </div>
      )}

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Telegram Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                  TG
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Telegram Alert Bot</h3>
                  <p className="text-[11px] text-neutral-500">Outbound Instant Alerts</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  data?.channels.telegram.envConfigured
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {data?.channels.telegram.envConfigured ? "Active Cloud" : "Simulated / Dev"}
              </span>
            </div>

            <div className="mt-5 space-y-2 bg-neutral-50 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">Chat Target:</span>
                <span className="font-mono font-semibold text-neutral-900">
                  {data?.channels.telegram.targetChatId}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">Retry Logic:</span>
                <span className="font-semibold text-emerald-600">3x Exponential Backoff</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              {testResult?.target === "telegram" && (
                <span className="text-emerald-600 font-bold">Latency: {testResult.latency}ms</span>
              )}
            </span>
            <button
              onClick={() => handleTestPing("telegram")}
              disabled={testingTarget === "telegram"}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3 text-[#a6f30d]" />
              {testingTarget === "telegram" ? "Sending..." : "Test Telegram Ping"}
            </button>
          </div>
        </div>

        {/* 2. Discord Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  DC
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Discord / Slack Webhook</h3>
                  <p className="text-[11px] text-neutral-500">Team Channel Notification</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  data?.channels.discord.envConfigured
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {data?.channels.discord.envConfigured ? "Active Webhook" : "Simulated / Dev"}
              </span>
            </div>

            <div className="mt-5 space-y-2 bg-neutral-50 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">Format:</span>
                <span className="font-semibold text-neutral-900">Rich Embed (#a6f30d)</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">Delivery Pipeline:</span>
                <span className="font-semibold text-emerald-600">Asynchronous Parallel</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              {testResult?.target === "discord" && (
                <span className="text-emerald-600 font-bold">Latency: {testResult.latency}ms</span>
              )}
            </span>
            <button
              onClick={() => handleTestPing("discord")}
              disabled={testingTarget === "discord"}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3 text-[#a6f30d]" />
              {testingTarget === "discord" ? "Sending..." : "Test Discord Ping"}
            </button>
          </div>
        </div>

        {/* 3. Resend Email Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Resend Email Engine</h3>
                  <p className="text-[11px] text-neutral-500">Transactional Proposals & Alerts</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  data?.channels.resend.envConfigured
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {data?.channels.resend.envConfigured ? "Verified API" : "Simulated / Dev"}
              </span>
            </div>

            <div className="mt-5 space-y-2 bg-neutral-50 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">From Address:</span>
                <span className="font-semibold text-neutral-900 truncate max-w-[200px]">
                  {data?.channels.resend.sender}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">HTML Template:</span>
                <span className="font-semibold text-neutral-900">Branded Labs Responsive</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              {testResult?.target === "email" && (
                <span className="text-emerald-600 font-bold">Latency: {testResult.latency}ms</span>
              )}
            </span>
            <button
              onClick={() => handleTestPing("email")}
              disabled={testingTarget === "email"}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3 h-3 text-[#a6f30d]" />
              {testingTarget === "email" ? "Sending..." : "Test Email Ping"}
            </button>
          </div>
        </div>

        {/* 4. Stripe Inbound Webhook Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  ST
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Stripe Webhook (Global / USD)</h3>
                  <p className="text-[11px] text-neutral-500">Credit Card & Global Currencies</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Listening 24/7
              </span>
            </div>

            <div className="mt-5 space-y-2 bg-neutral-50 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span className="text-[11px]">Endpoint URL:</span>
                <button
                  onClick={() => copyEndpointUrl(data?.channels.stripe.endpointUrl || "", "stripe")}
                  className="flex items-center gap-1 font-mono text-[11px] text-neutral-900 hover:text-black cursor-pointer"
                >
                  {copiedEndpoint === "stripe" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedEndpoint === "stripe" ? "Copied!" : "Copy URL"}
                </button>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">Signature Security:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> HMAC-SHA256
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">Auto-settles invoices</span>
            <button
              onClick={handleSimulateStripePayment}
              disabled={isSimulatingStripe}
              className="px-3.5 py-1.5 bg-[#a6f30d] hover:bg-[#8be000] text-neutral-900 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Activity className="w-3 h-3" />
              {isSimulatingStripe ? "Processing..." : "Simulate Stripe Webhook"}
            </button>
          </div>
        </div>

        {/* 5. Midtrans Inbound Webhook Card (Indonesia Domestic / QRIS) */}
        <div className="bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                  MT
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Midtrans Webhook (Indonesia / IDR)</h3>
                  <p className="text-[11px] text-neutral-500">QRIS, BCA/Mandiri/BRI VA, GoPay</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Listening 24/7
              </span>
            </div>

            <div className="mt-5 space-y-2 bg-neutral-50 p-3.5 rounded-xl text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span className="text-[11px]">Endpoint URL:</span>
                <button
                  onClick={() => copyEndpointUrl(data?.channels.midtrans?.endpointUrl || "", "midtrans")}
                  className="flex items-center gap-1 font-mono text-[11px] text-neutral-900 hover:text-black cursor-pointer"
                >
                  {copiedEndpoint === "midtrans" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedEndpoint === "midtrans" ? "Copied!" : "Copy URL"}
                </button>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span className="text-[11px]">Signature Security:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SHA-512 ServerKey
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">Auto-settles invoices</span>
            <button
              onClick={handleSimulateMidtransPayment}
              disabled={isSimulatingMidtrans}
              className="px-3.5 py-1.5 bg-[#a6f30d] hover:bg-[#8be000] text-neutral-900 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Activity className="w-3 h-3" />
              {isSimulatingMidtrans ? "Processing..." : "Simulate QRIS Webhook"}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Logs Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#eaecf0] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h3 className="text-sm font-bold text-neutral-900">Recent Integration Dispatches & Audit Log</h3>
          </div>
          <span className="text-xs text-neutral-400">Realtime Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5">Action Event</th>
                <th className="py-2.5">Actor / Origin</th>
                <th className="py-2.5">Details</th>
                <th className="py-2.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data?.recentLogs && data.recentLogs.length > 0 ? (
                data.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 font-mono font-semibold text-neutral-900">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-600">{log.actorName}</td>
                    <td className="py-3 text-neutral-500 max-w-md truncate">{log.details || "-"}</td>
                    <td className="py-3 text-right text-neutral-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-neutral-400">
                    Belum ada riwayat aktivitas integrasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
