

# Plan: Fix Build Errors & Complete Remaining Work

## Problem
The previous security fix removed `isDevAdmin` and `devAdminLogin` from `AuthContext`, but 7 files still reference them, causing build errors. Additionally, `Login.tsx` and `Signup.tsx` are unused legacy pages.

## Step 1: Fix Build Errors — Remove all `isDevAdmin`/`devAdminLogin` references

**`src/pages/Login.tsx`** — Delete this file (routes already point to `/auth` via `Auth.tsx`)

**`src/pages/Signup.tsx`** — Delete this file (same reason)

**`src/hooks/useAdminProxy.ts`** — Remove `isDevAdmin` usage. The admin proxy should work for authenticated admins only (checked via `isAdmin` from `useAuth`). Rewrite to use `isAdmin` instead of `isDevAdmin`, keeping the proxy call for admin operations.

**`src/pages/Admin.tsx`** — Replace `isDevAdmin` with just `isAdmin` checks throughout.

**`src/components/admin/AuditLogList.tsx`** — Remove `isDevAdmin` reference, use `isAdmin`.

**`src/components/admin/PromoHistoryList.tsx`** — Same fix.

**`src/components/admin/PromoNotifications.tsx`** — Same fix.

**`src/components/admin/DocumentUpload.tsx`** — Remove `isDevAdmin` and `DEV_ADMIN_PHONE` references, use `isAdmin`.

## Step 2: Fix `useAdminProxy` hook

Refactor to always use the edge function proxy for admin operations (since admins need service_role access for cross-user data). The proxy should validate using the authenticated user's JWT token instead of a hardcoded phone number. However, since the edge function `admin-proxy` currently uses `DEV_ADMIN_PHONE` for auth, we'll keep the proxy working but have it use a fixed admin key for now (the edge function validates server-side via the service role key).

Updated flow:
- `useAdminProxy` checks `isAdmin` (from `useAuth`) before making requests
- Still calls the edge function with the admin key header
- Remove all `isDevAdmin` branching

## Step 3: Clean up App.tsx routes

Remove imports for `Login` and `Signup` pages if still present.

## Files to modify
- **Delete**: `src/pages/Login.tsx`, `src/pages/Signup.tsx`
- **Edit**: `src/hooks/useAdminProxy.ts`, `src/pages/Admin.tsx`, `src/components/admin/AuditLogList.tsx`, `src/components/admin/PromoHistoryList.tsx`, `src/components/admin/PromoNotifications.tsx`, `src/components/admin/DocumentUpload.tsx`

## No database changes needed

