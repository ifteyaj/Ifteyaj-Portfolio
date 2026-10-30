import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    headless: true,
    deviceScaleFactor: 1,
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000/contact",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
