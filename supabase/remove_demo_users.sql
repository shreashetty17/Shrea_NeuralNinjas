-- Remove the two built-in demo accounts (Priya Sharma + Rajesh Kumar, example.com emails).
-- Paste into Supabase Dashboard > SQL Editor > Run.
delete from public.app_users
where id in ('user_919820044102', 'user_919820144521')
  and email in ('priya.sharma@example.com', 'rajesh.plumber@example.com')
returning id, name, email;
