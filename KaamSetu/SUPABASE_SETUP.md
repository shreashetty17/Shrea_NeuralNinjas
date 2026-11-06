# KaamSetu + Supabase: setup guide

## 1. Create the tables (one time, ~2 minutes)
1. Open https://supabase.com/dashboard/project/mmkmfishmjbyebwkgjcm/sql/new
2. Open `supabase/migration.sql` from this folder, copy everything, paste it into the editor.
3. Click **Run**. You should see "Success. No rows returned". (Running it again is harmless.)
4. Check **Table Editor**: you should see `app_users`, `bookings`, `chat_messages`.

## 2. Run the site
- Copy these files over your existing project folder (keep your `node_modules`; no new packages are needed).
- Run `start_app.bat` (or `npm run dev`). The prebuilt `dist/` also works on its own.
- Log in with a demo account. The 3 demo bookings and the users get uploaded automatically on first load.
  Refresh the `bookings` table in Supabase to see them.

## What gets saved
| Table | What | Written when |
|---|---|---|
| app_users | customers + workers (name, phone, locality, trade, document names, verification flags). Passwords are NOT stored. | sign up, login, worker uploads ID/police certificate |
| bookings | every job: category, address, budget, quote, worker, OTP, status, cancellation fee/refund | booking confirmed, OTP verified, completed, cancelled |
| chat_messages | customer/worker chat lines per booking | each chat message |

The site keeps a local copy (localStorage) so it stays fast and still works offline; it pulls from
Supabase every 5 seconds, so a booking made on one device shows up in the worker portal on another.

## Config
`.env` holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The publishable key is designed to be public.
Never put the `service_role`/secret key or DB password in the frontend.

## Security: read before going live
The app has no real login (any phone number "logs in"), so the database rules let anyone with the
public key read and update users and bookings (no deletes). That is fine for a demo or pitch, NOT for real
customers: phone numbers and addresses would be readable. To go live: add Supabase Auth (phone OTP fits this app),
add an `auth_user_id` column, and change the policies to `using (auth.uid() = auth_user_id)`.
