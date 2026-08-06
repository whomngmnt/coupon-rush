# Race Condition Test Results

## Test Configuration
- **Test Date:** 2026-08-03
- **Concurrent Requests:** 100
- **Total Coupons Available:** 10
- **Implementation:** Naive (no race condition protection)

## Test Results
```
Starting stress test...
Concurrent requests: 100
Total coupons available: 10
✓ Admin user registered
✓ Campaign created with ID: f9acc741-cca9-431c-9fcc-802ea5c91440
Registering 100 users...
✓ 100 users registered
Sending 100 concurrent claim requests...

--- Results ---
Successful claims: 100
Expected maximum: 10
Oversold: YES
Duration: 741ms
⚠️  RACE CONDITION DETECTED: 90 extra coupons issued
```

## Problem Analysis

### What Happened
The naive implementation allowed 100 coupons to be claimed when only 10 were available. This is a classic race condition where concurrent requests read the same state before any of them can update it.

### Root Cause
In `server/src/services/claim.service.ts`, the implementation follows this pattern:
1. Read current `issuedCount` from database
2. Check if `issuedCount < totalCoupons`
3. Create claim record
4. Update `issuedCount`

The problem occurs between steps 1-4 when multiple concurrent requests read the same `issuedCount` value before any of them updates it.

### Expected Behavior
Only 10 coupons should be issued. Requests 11-100 should receive "No coupons left" error.

### Actual Behavior
All 100 requests succeeded, resulting in 90 extra coupons being issued (oversold by 900%).

## Next Steps
Implement atomic update with `UPDATE ... WHERE issuedCount < limit` to prevent race conditions.
