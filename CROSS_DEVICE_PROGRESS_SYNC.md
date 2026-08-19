# Cross-device learning progress sync

Learning progress now uses a dual persistence strategy:

- localStorage remains the offline/local fallback.
- Authenticated users also sync lesson progress to `public.learning_progress` in Supabase.
- The cloud row is keyed by `(user_id, research_line, node_id)` and protected by the existing row-level security policies.
- `progress_state` stores the versioned current section/mission, unlocked range, and recorded answers.
- On load, the hook compares local and cloud timestamps and restores the newer state.
- On subsequent changes, the state is saved locally immediately and upserted to Supabase with a short debounce.
- Signing out keeps the local fallback; signing in restores the account-backed state.
- Resetting a lesson clears both the local record and the account-backed row for that lesson.

The database migration is recorded in `supabase/migrations/20260819164500_add_cross_device_learning_progress_state.sql`.
