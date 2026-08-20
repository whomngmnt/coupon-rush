# Race Condition Test Results

## Test Configuration
- **Test Date:** 2026-08-03
- **Concurrent Requests:** 100
- **Total Coupons Available:** 10

## Before Fix (Naive Implementation)
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

## After Fix (Atomic Update with Transaction)
```
Starting stress test...
Concurrent requests: 100
Total coupons available: 10
✓ Admin user registered
✓ Campaign created with ID: 61a99e17-e096-4389-b0f1-f16146a92081
Registering 100 users...
✓ 100 users registered
Sending 100 concurrent claim requests...

--- Results ---
Successful claims: 10
Expected maximum: 10
Oversold: NO
Duration: 1145ms
✓ No race condition detected
```

## Problem Analysis

### What Happened (Before Fix)
The naive implementation allowed 100 coupons to be claimed when only 10 were available. This is a classic race condition where concurrent requests read the same state before any of them can update it.

### Root Cause
In the naive implementation, the code followed this pattern:
1. Read current `issuedCount` from database
2. Check if `issuedCount < totalCoupons`
3. Create claim record
4. Update `issuedCount`

The problem occurred between steps 1-4 when multiple concurrent requests read the same `issuedCount` value before any of them updates it.

### Solution Implemented
The fix uses Prisma's atomic update with a WHERE clause:
```typescript
await tx.campaign.update({
  where: { 
    id: campaignId,
    issuedCount: {
      lt: campaign.totalCoupons,
    },
  },
  data: {
    issuedCount: {
      increment: 1,
    },
  },
});
```

This ensures the update only happens if `issuedCount < totalCoupons`. If the condition is not met, Prisma throws error P2025 (Record not found), which we catch and return as "No coupons left".

Additionally, the entire operation is wrapped in a transaction to ensure atomicity between the claim creation and the counter update.

### Results
- **Before:** 100 successful claims (90 oversold)
- **After:** 10 successful claims (exactly as expected)
- **Race condition:** Fixed
