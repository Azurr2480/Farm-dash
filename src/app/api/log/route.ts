import { logSensorSnapshot } from '../../lib/logToFirestore';

export async function GET() {
  await logSensorSnapshot();
  return new Response(JSON.stringify({ ok: true }));
}
