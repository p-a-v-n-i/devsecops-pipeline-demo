
const fs = require("node:fs");

function readReport(filename) {
  if (!fs.existsSync(filename)) {
    throw new Error(`Missing scan report: ${filename}`);
  }

  return JSON.parse(fs.readFileSync(filename, "utf8"));
}

try {
  const npmReport = readReport("npm-audit-report.json");
  const semgrepReport = readReport("semgrep-report.json");

  if (npmReport.error) {
    throw new Error("npm audit scan could not be completed");
  }

  const vulnerabilities = npmReport.metadata?.vulnerabilities || {};

  const npmHigh = vulnerabilities.high || 0;
  const npmCritical = vulnerabilities.critical || 0;

  const findings = semgrepReport.results || [];

  const semgrepErrors = findings.filter(
    finding => finding.extra?.severity === "ERROR"
  );

  console.log("Security Scan Summary");
  console.log("---------------------");
  console.log(`npm High: ${npmHigh}`);
  console.log(`npm Critical: ${npmCritical}`);
  console.log(`Semgrep ERROR findings: ${semgrepErrors.length}`);

  if (npmHigh > 0 || npmCritical > 0 || semgrepErrors.length > 0) {
    console.error("SECURITY GATE: BLOCKED");
    process.exit(1);
  }

  console.log("SECURITY GATE: PASSED");
} catch (error) {
  console.error("Security gate could not complete:", error.message);
  process.exit(1);
}
