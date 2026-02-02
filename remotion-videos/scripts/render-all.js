/**
 * Render all 15 project videos
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const COMPOSITIONS = [
  "sdk-solana",
  "choom-chat",
  "shadowpay",
  "billpayx-com",
  "zk-claims",
  "bytes-zip",
  "silver-sh",
  "privacy-sdk",
  "matrix-privacy",
  "cli-gitnpm",
  "thevirus-zip",
  "priv-pass-xyz",
  "deidentify-ai",
  "lnk-zip",
  "dasr-marketplace",
];

const OUT_DIR = path.join(__dirname, "..", "out");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n$ ${cmd} ${args.join(" ")}`);
    const proc = spawn(cmd, args, { stdio: "inherit", cwd: __dirname });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
    proc.on("error", reject);
  });
}

async function renderAll() {
  console.log("=".repeat(60));
  console.log("RENDERING ALL 15 PROJECT VIDEOS");
  console.log("=".repeat(60));

  let success = 0;
  let failed = [];

  for (const id of COMPOSITIONS) {
    const outputPath = path.join(OUT_DIR, `${id}.mp4`);
    try {
      await runCommand("npx", [
        "remotion", "render", "src/entry.tsx", id, outputPath,
        "--concurrency", "6"
      ]);
      const stats = fs.statSync(outputPath);
      console.log(`\n✓ ${id}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      success++;
    } catch (err) {
      console.error(`\n✗ ${id}: ${err.message}`);
      failed.push(id);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`RESULTS: ${success}/${COMPOSITIONS.length} succeeded`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.join(", ")}`);
  }
  console.log("=".repeat(60));
}

renderAll().catch(console.error);
