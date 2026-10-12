<div align="center">

# ⚡ LABS STDIO
### High-Performance Digital Product Studio Platform

*Engineered with Silicon Valley Standards: Zero-Trust Security, Real-Time Telemetry, ACID Integrity, and Distributed Architecture.*

[![CI/CD Pipeline](https://github.com/MuhammadFarhanAprilianto/LabsStdio/actions/workflows/ci.yml/badge.svg)](https://github.com/MuhammadFarhanAprilianto/LabsStdio/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Overview

**Labs Stdio** is an enterprise-caliber agency platform built for high-growth tech ventures and startups. Designed with an ultra-minimalist dark aesthetic, pure typography, and rich interactive micro-interactions, the platform combines a public-facing digital showcase with a mission-critical backend engine.

### 🏛️ Core Architectural Pillars
1. **🛡️ Zero-Trust Security Shield**: Comprehensive sanitization against XSS, Prototype Pollution, origin verification guard, and request body size throttling.
2. **⚖️ ACID Atomic Transactions**: All financial settlements and milestone sign-offs execute within isolated interactive transactions (`prisma.$transaction`) with automatic rollback.
3. **⚡ Live Real-Time Event Streaming**: Server-Sent Events (SSE) data bus pushing live status changes (leads, invoices, milestones) to connected clients with sub-50ms latency.
4. **🚀 High-Performance Caching**: On-demand selective cache invalidation (`revalidatePath`) and multi-node Upstash Redis integration with local memory fallback.
5. **🔍 Production Observability & APM**: Centralized telemetry engine with credential masking, health probes (`/api/health`), and global error boundaries.
6. **🤖 GitHub Actions CI/CD Quality Gate**: Strict type-checking, automated unit/integration suites, and production build verification on every push.

---

## 🚀 Key Features

* **Interactive Scope & Budget Estimator**: Dynamic cost & timeline calculator based on client-selected feature suites and velocity multiplier.
* **Client Portal & Project Roadmap**: Dedicated client portal for deliverables QA, project roadmap milestones, asset vault, and scope change requests.
* **Dual Payment Gateway Hub**:
  * **International**: Stripe Webhook integration with HMAC-SHA256 signature verification.
  * **Domestic**: Midtrans Webhook with SHA-512 cryptographic verification (QRIS & Virtual Accounts).
* **Admin CRM Hub**: Real-time leads Kanban board, project deliverables management, client organization directory, and activity audit logging.
* **Automation Dispatcher**: Concurrently dispatches real-time alerts to Telegram bots, Discord webhooks, and transactional emails via Resend.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router with Turbopack)
* **Language**: TypeScript 5 (Strict Mode)
* **Frontend**: React 19, Framer Motion, Tailwind CSS v4, Lucide Icons, Hugeicons
* **Database & ORM**: SQLite / PostgreSQL with Prisma ORM 6
* **Authentication**: HTTP-Only Cookie JWT (Bcrypt 12 rounds) & Google OAuth 2.0
* **Testing**: Native Node.js Test Runner (25+ Enterprise Scenarios)
* **DevOps**: GitHub Actions, Vercel

---

## 🏁 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/MuhammadFarhanAprilianto/LabsStdio.git
cd LabsStdio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` and set your credentials:
```bash
cp .env.example .env
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

### Run Enterprise Automated Test Suite (25 Tests)
```bash
npm test
```

### Run High-Concurrency Stress & Load Benchmark
```bash
npm run test:load
```

### Production Build Verification
```bash
npm run build
```

---

## 📄 License
Released under the [MIT License](LICENSE). Built with ❤️ by Labs Stdio.
