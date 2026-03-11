

# Plan: Make App Fully Functional & Production-Ready

## Current State Assessment

After reviewing all pages, the app already has solid implementations for most features. Here's what needs attention:

### Issues to Fix
1. **Security vulnerability**: Dev admin login via `localStorage` with hardcoded phone number — must be removed
2. **`ComingSoon` import** in `App.tsx` is unused — clean up
3. **Order Confirmation page** shows a random order ID instead of the actual order from the database
4. **Orders page "Reorder"** doesn't actually add items to cart — just navigates home

### Pages to Enhance for Production-Readiness

**1. Order Confirmation** — Connect to real order data (pass order ID via URL/state, display actual order number and address)

**2. Reorder Flow** — Actually add items back to cart using `addToCart` from AppContext

**3. Account Page Quick Stats** — Show real order count from database instead of hardcoded "0"

**4. Auth Security Fix** — Remove `devAdminLogin`, `DEV_ADMIN_PHONE`, and all localStorage-based admin bypass logic from AuthContext

**5. Notification Settings** — Persist settings to database (currently only in-memory state)

**6. Payments page** — Currently hardcoded mock data; connect wallet balance and transactions to the database

## Implementation Steps

### Step 1: Remove Dev Admin Security Hole
- Remove `DEV_ADMIN_PHONE`, `devAdminLogin`, `isDevAdmin` from `AuthContext.tsx`
- Remove all `isDevAdmin` references in `Account.tsx` and `Auth.tsx`

### Step 2: Fix Order Confirmation Page
- Accept order ID from navigation state or URL param
- Fetch and display actual order number, address, and amount from the database
- Pass order ID when navigating from Checkout

### Step 3: Fix Reorder Flow
- In `MyOrders.tsx`, when reorder returns items, map them to products and call `addToCart` for each
- Navigate to `/cart` instead of `/`

### Step 4: Account Page Real Stats  
- Use `useOrders` hook to show actual order count
- Show real reward points (if stored) or earned from orders

### Step 5: Create Notification Preferences Table
- Add `notification_preferences` table in database
- Persist NotificationSettings toggles to DB with RLS

### Step 6: Wallet & Transactions (DB-backed)
- Create `wallet_transactions` table
- Update Payments page to fetch real balance and transaction history

### Step 7: Clean Up
- Remove unused `ComingSoon` import from App.tsx
- Remove unused `Login.tsx` and `Signup.tsx` if they just redirect to Auth

## Database Migrations Needed

```sql
-- Notification preferences
CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_updates boolean DEFAULT true,
  delivery_updates boolean DEFAULT true,
  offers boolean DEFAULT true,
  rewards boolean DEFAULT true,
  chat_messages boolean DEFAULT true,
  sound_enabled boolean DEFAULT true,
  vibration_enabled boolean DEFAULT true,
  dnd_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
ON public.notification_preferences FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  title text NOT NULL,
  reference_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
ON public.wallet_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
ON public.wallet_transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

## Files to Modify
- `src/contexts/AuthContext.tsx` — Remove dev admin bypass
- `src/pages/Account.tsx` — Remove isDevAdmin, add real stats
- `src/pages/Auth.tsx` — Remove devAdminLogin references
- `src/pages/Checkout.tsx` — Pass order data to confirmation
- `src/pages/OrderConfirmation.tsx` — Use real order data
- `src/pages/MyOrders.tsx` — Fix reorder to add items to cart
- `src/pages/NotificationSettings.tsx` — Persist to DB
- `src/pages/Payments.tsx` — Connect to wallet_transactions table
- `src/App.tsx` — Remove ComingSoon import

