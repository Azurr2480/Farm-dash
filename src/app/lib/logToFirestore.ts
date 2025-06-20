// src/lib/logToFirestore.ts

import { firestore, rtdb } from './firebaseAdmin';

export async function logSensorSnapshot() {
  const snapshot = await rtdb.ref('/').once('value');
  const data = snapshot.val();

  const doc = {
    pumpMode: data.pump?.mode || null,
    pumpStatus: data.pump?.status || null,
    humidity: data.sensorData?.sensorDHT?.humidity?? null,
    temperature: data.sensorData?.sensorDHT?.temperature?? null,
    intensity: data.sensorData?.sensorLight?.intensity ?? null,
    levelRaw: data.sensorData?.sensorWater?.levelRaw ?? null,
    phValue: data.sensorData?.sensorWater?.phValue ?? null,
    waterLevel: data.sensorData?.sensorWater?.waterLevel ?? null,
    waterTemp: data.sensorData?.sensorWater?.waterTemp ?? null,
    createdAt: new Date()
  };

  await firestore.collection('sensorLogs').add(doc);
  console.log('✅ Firestore log written');
}
