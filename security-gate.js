
const fs = require("node:fs");

function readReport(filename) {
  if (!fs.existsSync(filename)) {
    throw new Error(`Missing scan report: ${filename}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch {
    throw new Error(`Invalid JSON report: ${filename}`);
  }
}

try {
  console.log("================================");
  console.log("       SECURITY GATE REPORT");
  console.log("================================");

  // Read scanner reports
  const npmReport = readReport("npm-audit-report.json");
  const semgrepReport = readReport("semgrep-report.json");

  // Validate npm audit report
  if (
    npmReport.error ||
    !npmReport.metadata ||
    !npmReport.metadata.vulnerabilities
  ) {
    throw new Error("npm audit scan could not be completed");
  }

  // Validate Semgrep report
  if (!Array.isArray(semgrepReport.results)) {
    throw new Error("Invalid Semgrep results");
  }

  if (
    Array.isArray(semgrepReport.errors) &&
    semgrepReport.errors.length > 0
  ) {
    throw new Error("Semgrep scanner encountered errors");
  }

  // Extract npm vulnerability counts
  const vulnerabilities = npmReport.metadata.vulnerabilities;

  const npmLow = vulnerabilities.low || 0;
  const npmModerate = vulnerabilities.moderate || 0;
  const npmHigh = vulnerabilities.high || 0;
  const npmCritical = vulnerabilities.critical || 0;

  // Extract Semgrep findings
  const findings = semgrepReport.results;

  const semgrepErrors = findings.filter(
    finding => finding.extra?.severity === "ERROR"
  );

  const semgrepWarnings = findings.filter(
    finding => finding.extra?.severity === "WARNING"
  );

  const semgrepInfo = findings.filter(
    finding => finding.extra?.severity === "INFO"
  );

  // Display security summary
  console.log("\nDependency Scan Results");
  console.log("-----------------------");
  console.log(`Low: ${npmLow}`);
  console.log(`Moderate: ${npmModerate}`);
  console.log(`High: ${npmHigh}`);
  console.log(`Critical: ${npmCritical}`);

  console.log("\nStatic Code Analysis Results");
  console.log("----------------------------");
  console.log(`ERROR: ${semgrepErrors.length}`);
  console.log(`WARNING: ${semgrepWarnings.length}`);
  console.log(`INFO: ${semgrepInfo.length}`);

  // Apply security policy
  const shouldBlock =
    npmHigh > 0 ||
    npmCritical > 0 ||
    semgrepErrors.length > 0;

  console.log("\n================================");

  if (shouldBlock) {
    console.error("SECURITY GATE: BLOCKED");
    console.error("High-severity security findings detected.");
    console.log("================================");
    process.exitCode = 1;
  } else {
    console.log("SECURITY GATE: PASSED");
    console.log("No blocking findings detected.");
    console.log("================================");
  }

} catch (error) {
  console.error("\nSECURITY GATE: BLOCKED");
  console.error("Reason:", error.message);
  process.exitCode = 1;
}
