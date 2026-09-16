# Wallet System - Supabase Setup Guide

## Quick Setup

### 1. Run the SQL Migration

Go to your Supabase dashboard → SQL Editor and run the migration script:

```sql
-- Located at: supabase/migrations/wallet_system.sql
```

This creates three tables:
- `wallets` - User balances and spending totals
- `transactions` - All credit/debit records
- `video_generations` - Video job tracking with costs

### 2. Update Your Environment

Your `.env` already has Supabase credentials. Make sure you have:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 4. Use the New Service

Replace the old wallet service with the Supabase version:

```typescript
// Old (SQLite/Prisma)
import { wallet-service } from '@/lib/wallet/wallet-service'

// New (Supabase)
import { 
  getOrCreateWallet,
  addWalletCredit,
  deductWalletForVideo,
  calculateTotalCost
} from '@/lib/wallet/wallet-service-supabase'
```

## API Usage (Same as Before)

All API endpoints remain unchanged:

```
GET  /api/wallet?userId={id}
POST /api/wallet
POST /api/wallet/deduct
POST /api/video-generate-with-wallet
```

## Database Schema

### Wallets Table
```
id UUID PRIMARY KEY
user_id VARCHAR(255) UNIQUE
balance DECIMAL(10,2)
total_added DECIMAL(10,2)
total_spent DECIMAL(10,2)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Transactions Table
```
id UUID PRIMARY KEY
user_id VARCHAR(255)
type VARCHAR(50) - 'credit' or 'debit'
amount DECIMAL(10,2)
description TEXT
balance_before DECIMAL(10,2)
balance_after DECIMAL(10,2)
video_gen_id VARCHAR(255) - Optional
created_at TIMESTAMP
```

### Video Generations Table
```
id UUID PRIMARY KEY
user_id VARCHAR(255)
model_id VARCHAR(255)
model_name VARCHAR(255)
prompt TEXT
duration INT
api_cost DECIMAL(10,2)
commission DECIMAL(10,2)
total_cost DECIMAL(10,2)
status VARCHAR(50) - 'pending', 'completed', 'failed'
job_id VARCHAR(255)
provider VARCHAR(255)
video_url TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Row Level Security (RLS)

All tables have RLS enabled:

**Wallets:**
- Users can view their own wallet
- Service role can manage all

**Transactions:**
- Users can view their own transactions
- Service role can manage all

**Video Generations:**
- Users can view their own video generations
- Service role can manage all

## Benefits Over Prisma/SQLite

✅ **Cloud Database** - No local SQLite, always available
✅ **Better Scaling** - PostgreSQL with proven reliability
✅ **Easy Backup** - Supabase handles backups automatically
✅ **Real-time Ready** - Built-in for future real-time features
✅ **Same API** - All wallet functions work identically
✅ **RLS Built-in** - Security policies already configured
✅ **Admin Dashboard** - View/manage wallets via Supabase UI

## Testing

Add test funds:
```bash
curl -X POST http://localhost:3000/api/wallet \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user", "amount": 100}'
```

Check wallet:
```bash
curl http://localhost:3000/api/wallet?userId=test-user
```

View transactions in Supabase:
- Go to Supabase Dashboard → Table Editor
- Select `transactions` table
- Filter by `user_id`

## Files

- **Service:** `src/lib/wallet/wallet-service-supabase.ts`
- **Migration:** `supabase/migrations/wallet_system.sql`
- **API Routes:** (unchanged, same as before)
  - `src/app/api/wallet/route.ts`
  - `src/app/api/wallet/deduct/route.ts`

## Next: Payment Gateway

Now that Supabase is set up, the next step is to integrate a payment gateway so users can actually add real funds:

1. Stripe (global, most popular)
2. PayPal (global alternative)
3. Razorpay (great for India market)

This will allow users to convert real money → wallet credits → video generation.
