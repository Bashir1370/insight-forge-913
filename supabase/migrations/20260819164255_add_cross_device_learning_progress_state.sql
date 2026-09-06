alter table public.learning_progress
  add column if not exists progress_state jsonb not null default '{}'::jsonb;

create or replace function public.set_learning_progress_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_learning_progress_updated_at on public.learning_progress;
create trigger set_learning_progress_updated_at
before update on public.learning_progress
for each row
execute function public.set_learning_progress_updated_at();

comment on column public.learning_progress.progress_state is
  'Versioned client learning state used for cross-device lesson progress sync.';;
