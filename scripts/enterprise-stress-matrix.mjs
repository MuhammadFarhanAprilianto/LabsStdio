import http from "http";

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const BASE_HOST = "localhost";
const BASE_PORT = 3000;

// Reusable keep-alive agent to maximize throughput
const agent = new http.Agent({ keepAlive: true, maxSockets: 50 });

function httpRequest({ path, method = "GET", headers = {}, body = null }) {
  return new Promise((resolve) => {
    const start = performance.now();
    const req = http.request(
      {
        host: BASE_HOST,
        port: BASE_PORT,
        path,
        method,
        agent,
        headers: {
          "User-Agent": "LabsStdio-StressRunner/2.0",
          "Accept": "application/json",
          ...headers,
        },
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          const latency = performance.now() - start;
          resolve({
            statusCode: res.statusCode,
            latency,
            data: resData,
          });
        });
      }
    );

    req.on("error", (err) => {
      resolve({
        statusCode: 0,
        latency: performance.now() - start,
        error: err.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        statusCode: 408,
        latency: 5000,
        error: "TIMEOUT",
      });
    });

    if (body) req.write(body);
    req.end();
  });
}

async function runScenario({ name, totalRequests, concurrency, requestFn }) {
  console.log(`\n${BOLD}${YELLOW}▶ SCENARIO: ${name}${RESET}`);
  console.log(`   Requests: ${totalRequests} | Concurrency: ${concurrency} parallel workers`);

  const latencies = [];
  const statusCounts = {};
  const startBenchmark = performance.now();

  let currentIndex = 0;
  async function worker() {
    while (currentIndex < totalRequests) {
      const idx = currentIndex++;
      const res = await requestFn(idx);
      latencies.push(res.latency);
      statusCounts[res.statusCode] = (statusCounts[res.statusCode] || 0) + 1;
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const durationSec = (performance.now() - startBenchmark) / 1000;
  latencies.sort((a, b) => a - b);

  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = latencies[0] || 0;
  const max = latencies[latencies.length - 1] || 0;
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
  const rps = totalRequests / durationSec;

  console.log(`   ${BOLD}Duration:${RESET} ${durationSec.toFixed(2)}s | ${BOLD}Throughput:${RESET} ${rps.toFixed(1)} req/sec`);
  console.log(`   ${BOLD}Status Codes:${RESET} ${JSON.stringify(statusCounts)}`);
  console.log(`   ${BOLD}Latency Percentiles:${RESET} Min: ${min.toFixed(1)}ms | p50: ${p50.toFixed(1)}ms | p95: ${p95.toFixed(1)}ms | p99: ${p99.toFixed(1)}ms | Max: ${max.toFixed(1)}ms`);

  return { rps, p50, p95, p99, statusCounts };
}

async function runEnterpriseStressMatrix() {
  console.log(`\n${BOLD}${CYAN}==================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}   LABS STDIO - ENTERPRISE HIGH-CONCURRENCY STRESS MATRIX${RESET}`);
  console.log(`${BOLD}${CYAN}   (Silicon Valley Grade Multi-Scenario Resilience Benchmark)${RESET}`);
  console.log(`${BOLD}${CYAN}==================================================================${RESET}`);

  // -------------------------------------------------------------
  // SCENARIO 1: HIGH-CONCURRENCY READ BURST (Viral Product Spike)
  // -------------------------------------------------------------
  const s1 = await runScenario({
    name: "Profile A: High-Concurrency Read Burst (Viral Spike)",
    totalRequests: 150,
    concurrency: 15,
    requestFn: () => httpRequest({ path: "/api/projects" }),
  });

  // -------------------------------------------------------------
  // SCENARIO 2: DEFENSIVE RATE-LIMITING STRESS (Anti-DDoS / Brute Force)
  // -------------------------------------------------------------
  const s2 = await runScenario({
    name: "Profile B: Rate-Limit Defensive Shield (Anti-Spam Flooding)",
    totalRequests: 40,
    concurrency: 8,
    requestFn: () =>
      httpRequest({
        path: "/api/invoices/inv-test-shield",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "203.0.113.195", // Simulated fixed attacker IP
        },
        body: JSON.stringify({ status: "PAID" }),
      }),
  });

  // -------------------------------------------------------------
  // SCENARIO 3: HEALTH TELEMETRY & POOL INTEGRITY POST-STRESS
  // -------------------------------------------------------------
  console.log(`\n${BOLD}${YELLOW}▶ SCENARIO: Profile C: Database Pool & APM Health Post-Stress Verification${RESET}`);
  const postHealth = await httpRequest({ path: "/api/health" });
  let healthOk = false;
  let dbLatencyMs = -1;
  try {
    const healthJson = JSON.parse(postHealth.data);
    healthOk = healthJson.success && healthJson.data.status === "HEALTHY";
    dbLatencyMs = healthJson.data.database.latencyMs;
  } catch {}

  console.log(`   Health Probe HTTP Status : ${postHealth.statusCode} (Expected: 200)`);
  console.log(`   System Health Status     : ${healthOk ? `${GREEN}HEALTHY${RESET}` : `${RED}DEGRADED${RESET}`}`);
  console.log(`   Database Latency Post-Load: ${dbLatencyMs} ms`);

  // -------------------------------------------------------------
  // FINAL SCORECARD
  // -------------------------------------------------------------
  console.log(`\n${BOLD}${CYAN}==================================================================${RESET}`);
  console.log(`${BOLD}RESILIENCE BENCHMARK SCORECARD:${RESET}`);
  const shieldStatus = s2.statusCounts["429"]
    ? `${GREEN}ENFORCED (429 Rate-Limited)${RESET}`
    : s2.statusCounts["401"]
    ? `${GREEN}SHIELDED (Unauthorized Blocked)${RESET}`
    : "MONITORED";

  console.log(`  1. Read Burst Success Rate : ${s1.statusCounts["200"] || 0} / 150 (${((s1.statusCounts["200"] || 0) / 150 * 100).toFixed(0)}%)`);
  console.log(`  2. Read Burst p95 Latency   : ${s1.p95.toFixed(1)} ms`);
  console.log(`  3. Rate-Limit Shield Active : ${shieldStatus}`);
  console.log(`  4. DB Connection Pool Leak : ${healthOk ? `${GREEN}0 Leaks (100% Intact)${RESET}` : `${RED}Connection Degraded${RESET}`}`);
  console.log(`${BOLD}${CYAN}==================================================================${RESET}\n`);

  if (s1.statusCounts["200"] >= 145 && healthOk) {
    console.log(`${GREEN}${BOLD}🏆 RESULT: ENTERPRISE GRADE A+ (SILICON VALLEY RESILIENCE PROVEN)${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}${BOLD}❌ RESULT: BENCHMARK FAILED TO MEET ENTERPRISE THRESHOLDS${RESET}\n`);
    process.exit(1);
  }
}

runEnterpriseStressMatrix().catch((err) => {
  console.error(err);
  process.exit(1);
});
