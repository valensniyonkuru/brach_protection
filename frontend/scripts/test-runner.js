import test from "node:test";
import assert from "node:assert/strict";
import { createAppModel } from "../src/app.js";

test("createAppModel exposes CI-ready status", () => {
  const model = createAppModel();

  assert.equal(model.status, "ready");
  assert.deepEqual(model.checks, ["build", "test", "security scan"]);
});