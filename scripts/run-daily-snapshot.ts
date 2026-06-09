import { runDailySnapshot } from "@/lib/analytics/daily-snapshot";

async function main() {
  console.log("=== Analytics Daily Snapshot ===\n");

  const result = await runDailySnapshot();

  if (result.error) {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }

  console.log(`Snapshot saved: ${result.snapshotSaved}`);
  console.log(`Anomalies detected: ${result.anomaliesDetected}`);
  console.log(`Anomaly count: ${result.anomalyCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
