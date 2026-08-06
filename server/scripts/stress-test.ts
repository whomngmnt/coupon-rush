const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function register(): Promise<{ email: string; accessToken: string }> {
  const email = `stress-test-${Date.now()}-${Math.random()}@example.com`;
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'password123',
    }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  const data = await response.json();
  return { email, accessToken: data.accessToken };
}

async function createCampaign(token: string, totalCoupons: number) {
  const response = await fetch(`${BASE_URL}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Stress Test Campaign',
      description: 'Campaign for stress testing',
      totalCoupons,
      startsAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Campaign creation failed');
  }

  const data = await response.json();
  return data.id;
}

async function claimCoupon(token: string, campaignId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ campaignId }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function stressTest(concurrentRequests: number, totalCoupons: number) {
  console.log('Starting stress test...');
  console.log(`Concurrent requests: ${concurrentRequests}`);
  console.log(`Total coupons available: ${totalCoupons}`);

  const { accessToken: adminToken } = await register();
  console.log('✓ Admin user registered');

  const campaignId = await createCampaign(adminToken, totalCoupons);
  console.log(`✓ Campaign created with ID: ${campaignId}`);

  console.log(`Registering ${concurrentRequests} users...`);
  const users = await Promise.all(
    Array.from({ length: concurrentRequests }, () => register())
  );
  console.log(`✓ ${users.length} users registered`);

  console.log(`Sending ${concurrentRequests} concurrent claim requests...`);

  const startTime = Date.now();
  const promises = users.map((user) =>
    claimCoupon(user.accessToken, campaignId)
  );

  const results = await Promise.all(promises);
  const successfulClaims = results.filter((r) => r).length;
  const duration = Date.now() - startTime;

  console.log('\n--- Results ---');
  console.log(`Successful claims: ${successfulClaims}`);
  console.log(`Expected maximum: ${totalCoupons}`);
  console.log(`Oversold: ${successfulClaims > totalCoupons ? 'YES' : 'NO'}`);
  console.log(`Duration: ${duration}ms`);

  if (successfulClaims > totalCoupons) {
    console.log(`  RACE CONDITION DETECTED: ${successfulClaims - totalCoupons} extra coupons issued`);
  } else {
    console.log(' No race condition detected');
  }
}

const concurrentRequests = parseInt(process.argv[2]) || 100;
const totalCoupons = parseInt(process.argv[3]) || 10;

stressTest(concurrentRequests, totalCoupons).catch(console.error);
