import { ref, set, Database } from "firebase/database";

let intervalId: NodeJS.Timeout | null = null;
let timeoutId: NodeJS.Timeout | null = null;
let isRunning = false;

export function startAutoPump(database: Database) {
  if (isRunning) return; // Prevent repeated starts
  isRunning = true;

  const pumpRef = ref(database, "pump/status");

  // Immediate ON
  set(pumpRef, "on");
  timeoutId = setTimeout(() => {
    set(pumpRef, "off");
  }, 5 * 1000); // 5 seconds

  // Repeat every 10 seconds
  intervalId = setInterval(() => {
    set(pumpRef, "on");
    timeoutId = setTimeout(() => {
      set(pumpRef, "off");
    }, 2* 60 * 1000); // 2 minutes
  }, 1 * 60 * 1000); // 1 minutes
}

export function stopAutoPump() {
  if (intervalId) clearInterval(intervalId);
  if (timeoutId) clearTimeout(timeoutId);
  intervalId = null;
  timeoutId = null;
  isRunning = false;
}
