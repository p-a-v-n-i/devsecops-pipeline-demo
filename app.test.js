
const { test } = require("node:test");
const assert = require("node:assert");

const checkApplicationStatus = require("./app");

test("Application should return running status", () => {
  const result = checkApplicationStatus();

  assert.strictEqual(result.status, "running");
  assert.strictEqual(
    result.message,
    "Application is running"
  );
});
