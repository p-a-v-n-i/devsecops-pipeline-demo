
const fs = require("node:fs");

function readReport(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch {
    return null;
  }
}

const npmReport = readReport("npm-audit-report.json");
const semgrepReport = readReport("semgrep-report.json");

const npm = npmReport?.metadata?.vulnerabilities || {};

const findings = Array.isArray(semgrepReport?.results)
  ? semgrepReport.results
  : [];

const semgrepErrors = findings.filter(
  item => item.extra?.severity === "ERROR"
).length;

const semgrepWarnings = findings.filter(
  item => item.extra?.severity === "WARNING"
).length;

const semgrepInfo = findings.filter(
  item => item.extra?.severity === "INFO"
).length;

const gitleaksStatus =
  process.env.GITLEAKS_STATUS === "success" ? "PASSED" : "NOT VERIFIED";

const gateStatus =
  process.env.SECURITY_GATE_STATUS === "success"
    ? "PASSED"
    : "BLOCKED / NOT PASSED";

const esc = value =>
  String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

const stats = [
  ["Low", npm.low || 0],
  ["Moderate", npm.moderate || 0],
  ["High", npm.high || 0],
  ["Critical", npm.critical || 0]
];

const cards = stats.map(([label, value]) => `
  <div class="card">
    <div class="muted">${esc(label)}</div>
    <div class="number">${esc(value)}</div>
  </div>
`).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DevSecOps Security Dashboard</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 30px;
  background: #f3f6fb;
  color: #172033;
  font-family: Arial, sans-serif;
}
.container { max-width: 1050px; margin: auto; }
header {
  background: #172b4d;
  color: white;
  padding: 28px;
  border-radius: 12px;
  margin-bottom: 22px;
}
header p { color: #d5dfef; }
h1 { margin: 0 0 8px; }
h2 { margin-top: 28px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}
.card, .panel {
  background: white;
  padding: 22px;
  border-radius: 10px;
  box-shadow: 0 2px 9px #17203312;
}
.number { font-size: 32px; font-weight: bold; margin-top: 10px; }
.muted { color: #65728a; }
.status { font-weight: bold; margin-top: 10px; }
.pass { color: #16834a; }
.warning { color: #a66b00; }
.panel { margin-top: 15px; }
footer { margin-top: 25px; color: #65728a; font-size: 13px; }
</style>
</head>
<body>
<div class="container">
<header>
  <h1>DevSecOps Security Dashboard</h1>
  <p>Automated CI pipeline security scan summary</p>
</header>

<h2>Dependency Vulnerabilities — npm audit</h2>
<div class="grid">${cards}</div>

<h2>Static Code Analysis — Semgrep</h2>
<div class="grid">
  <div class="card"><div class="muted">ERROR</div>
    <div class="number">${semgrepErrors}</div></div>
  <div class="card"><div class="muted">WARNING</div>
    <div class="number">${semgrepWarnings}</div></div>
  <div class="card"><div class="muted">INFO</div>
    <div class="number">${semgrepInfo}</div></div>
</div>

<h2>Security Pipeline Status</h2>
<div class="panel">
  <p>Gitleaks: <span class="status">${esc(gitleaksStatus)}</span></p>
  <p>Security Gate: <span class="status ${
    gateStatus === "PASSED" ? "pass" : "warning"
  }">${esc(gateStatus)}</span></p>
  <p>npm audit report: ${npmReport ? "Available" : "Unavailable"}</p>
  <p>Semgrep report: ${semgrepReport ? "Available" : "Unavailable"}</p>
</div>

<footer>
  Generated automatically by the DevSecOps CI pipeline.
  Results are based on the latest available scan reports.
</footer>
</div>
</body>
</html>`;

fs.writeFileSync("dashboard.html", html);

console.log("Security dashboard generated: dashboard.html");
