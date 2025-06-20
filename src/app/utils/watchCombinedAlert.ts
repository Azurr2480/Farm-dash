// utils/alertMonitor.ts
import { ref, onValue, get, set } from "firebase/database";
import { database } from "../firebase";
import { sendTelegramAlert } from "../utils/sendTelegramAlert";

export function watchCombinedAlert() {
  const tempRef = ref(database, "sensorDHT/temperature");
const waterRef = ref(database, "sensorWater/waterLevel");

const alertsRef = {
  temp: ref(database, "alerts/tempHigh"),
  water: ref(database, "alerts/waterLow"),
  both: ref(database, "alerts/both")
};

async function handleAlert(temp: number, water: string) {
  const isTempHigh = temp > 30;
  const isWaterLow = water === "Low";

  const [sentTemp, sentWater, sentBoth] = await Promise.all([
    get(alertsRef.temp).then((s) => s.val() || false),
    get(alertsRef.water).then((s) => s.val() || false),
    get(alertsRef.both).then((s) => s.val() || false),
  ]);

  // Condition 1: Both temp high and water low
  if (isTempHigh && isWaterLow && !sentBoth) {
    await sendTelegramAlert("⚠️ Temperature is above 30°C and water is LOW!");
    await set(alertsRef.both, true);
    await set(alertsRef.temp, true);
    await set(alertsRef.water, true);
    return;
  }

  // Condition 2: Temp high only
  if (isTempHigh && !isWaterLow && !sentTemp) {
    await sendTelegramAlert("🌡 Temperature is above 30°C!");
    await set(alertsRef.temp, true);
    await set(alertsRef.both, false);
    return;
  }

  // Condition 3: Water low only
  if (!isTempHigh && isWaterLow && !sentWater) {
    await sendTelegramAlert("🚱 Water level is LOW!");
    await set(alertsRef.water, true);
    await set(alertsRef.both, false);
    return;
  }

  // Reset alert flags if everything is OK
  if (!isTempHigh) await set(alertsRef.temp, false);
  if (!isWaterLow) await set(alertsRef.water, false);
  if (!isTempHigh || !isWaterLow) await set(alertsRef.both, false);
}

// Temperature listener
onValue(tempRef, async (tempSnap) => {
  const temp = tempSnap.val();
  const waterSnap = await get(waterRef);
  const water = waterSnap.val();
  await handleAlert(temp, water);
});

// Water level listener
onValue(waterRef, async (waterSnap) => {
  const water = waterSnap.val();
  const tempSnap = await get(tempRef);
  const temp = tempSnap.val();
  await handleAlert(temp, water);
});
}
