-- HubGene core production baseline
-- Reconstructs the application schema that existed before the first tracked
-- production migration (20260819164255).
--
-- IMPORTANT:
-- 1) This file is intended to make fresh databases reproducible.
-- 2) Do not execute it manually against the current production database.
--    Production already has these objects; after validation we will mark this
--    migration as applied in migration history instead.

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  organization text,
  research_field text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  analysis_type text,
  research_stage text,
  status text not null default 'submitted',
  wizard_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx
  on public.projects(user_id);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  consultation_type text not null default 'initial'
    check (consultation_type in (
      'initial',
      'research_design',
      'bioinformatics',
      'results_interpretation',
      'custom'
    )),
  subject text not null,
  description text,
  status text not null default 'requested'
    check (status in ('requested','reviewing','scheduled','completed','cancelled')),
  scheduled_at timestamptz,
  duration_minutes integer
    check (duration_minutes is null or duration_minutes between 15 and 240),
  meeting_url text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists consultations_created_at_idx
  on public.consultations(created_at);
create index if not exists consultations_project_id_idx
  on public.consultations(project_id);
create index if not exists consultations_status_idx
  on public.consultations(status);
create index if not exists consultations_user_id_idx
  on public.consultations(user_id);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  research_line text not null,
  node_id text not null,
  status text not null default 'in_progress'
    check (status in ('not_started','in_progress','completed','needs_review')),
  confidence text
    check (confidence is null or confidence in ('unclear','developing','clear')),
  selected_answer smallint,
  is_correct boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, research_line, node_id)
);

create index if not exists learning_progress_user_id_idx
  on public.learning_progress(user_id);
create index if not exists learning_progress_user_research_line_idx
  on public.learning_progress(user_id, research_line);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null default 'project-files',
  storage_path text not null unique,
  original_name text not null,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  category text not null default 'data'
    check (category in ('data','report','result','other')),
  created_at timestamptz not null default now()
);

create index if not exists project_files_created_at_idx
  on public.project_files(created_at);
create index if not exists project_files_project_id_idx
  on public.project_files(project_id);
create index if not exists project_files_uploader_id_idx
  on public.project_files(uploader_id);

create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(trim(message)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists project_messages_created_at_idx
  on public.project_messages(created_at);
create index if not exists project_messages_project_id_idx
  on public.project_messages(project_id);

create table if not exists public.project_quotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null,
  scope_summary text,
  deliverables text,
  amount bigint not null check (amount >= 0),
  currency text not null default 'TOMAN',
  estimated_days integer
    check (estimated_days is null or estimated_days between 1 and 365),
  status text not null default 'draft'
    check (status in ('draft','sent','accepted','rejected','expired','cancelled')),
  valid_until timestamptz,
  admin_note text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_quotes_created_at_idx
  on public.project_quotes(created_at);
create index if not exists project_quotes_project_id_idx
  on public.project_quotes(project_id);
create index if not exists project_quotes_status_idx
  on public.project_quotes(status);
create index if not exists project_quotes_user_id_idx
  on public.project_quotes(user_id);

create table if not exists public.project_invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  quote_id uuid not null unique references public.project_quotes(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null,
  amount bigint not null check (amount > 0),
  currency text not null default 'TOMAN',
  status text not null default 'draft'
    check (status in ('draft','issued','paid','overdue','cancelled')),
  due_at timestamptz,
  payment_instructions text,
  admin_note text,
  paid_at timestamptz,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_invoices_created_at_idx
  on public.project_invoices(created_at);
create index if not exists project_invoices_project_id_idx
  on public.project_invoices(project_id);
create index if not exists project_invoices_status_idx
  on public.project_invoices(status);
create index if not exists project_invoices_user_id_idx
  on public.project_invoices(user_id);

create table if not exists public.research_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  research_line text not null,
  question_type text,
  data_stage text,
  replicate_level text,
  metadata_level text,
  analysis_goal text,
  recommendation_level text
    check (
      recommendation_level is null
      or recommendation_level in ('learn','review','design')
    ),
  recommendation_destination text,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'active'
    check (status in ('active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, research_line)
);

create index if not exists research_assessments_goal_idx
  on public.research_assessments(analysis_goal);
create index if not exists research_assessments_user_id_idx
  on public.research_assessments(user_id);
create index if not exists research_assessments_user_line_idx
  on public.research_assessments(user_id, research_line);

create table if not exists public.research_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  career_stage text
    check (
      career_stage is null
      or career_stage in ('bachelor','master','phd','postdoc','faculty','researcher','other')
    ),
  discipline text,
  bioinformatics_level text
    check (
      bioinformatics_level is null
      or bioinformatics_level in ('new','basic','intermediate','advanced')
    ),
  programming_level text
    check (
      programming_level is null
      or programming_level in ('none','basic','intermediate','advanced')
    ),
  primary_research_line text
    check (
      primary_research_line is null
      or primary_research_line in ('rna-seq','public-data','network-biology','single-cell','microbiome','unsure')
    ),
  primary_goal text
    check (
      primary_goal is null
      or primary_goal in (
        'learn','design-project','analyze-data','solve-problem',
        'interpret-results','publish-research','consultation','unsure'
      )
    ),
  preferred_support text
    check (
      preferred_support is null
      or preferred_support in (
        'guided-learning','project-design','analysis-strategy',
        'problem-solving','results-interpretation','expert-review','unsure'
      )
    ),
  interests text[] not null default '{}'::text[],
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_profiles_primary_line_idx
  on public.research_profiles(primary_research_line);
create index if not exists research_profiles_user_id_idx
  on public.research_profiles(user_id);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','analyst')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create schema if not exists private;

create or replace function private.has_role(requested_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = requested_role
  );
$$;

grant usage on schema private to authenticated;
revoke all on function private.has_role(text) from public;
grant all on function private.has_role(text) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_consultation_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.respond_to_project_quote(
  quote_id uuid,
  response text
)
returns public.project_quotes
language plpgsql
security definer
set search_path = public
as $$
declare
  target_quote public.project_quotes;
begin
  if response not in ('accepted', 'rejected') then
    raise exception 'Invalid quote response';
  end if;

  select *
  into target_quote
  from public.project_quotes
  where id = quote_id
    and user_id = auth.uid();

  if target_quote.id is null then
    raise exception 'Quote not found';
  end if;

  if target_quote.status <> 'sent' then
    raise exception 'Quote is not awaiting response';
  end if;

  if (
    target_quote.valid_until is not null
    and target_quote.valid_until < now()
  ) then
    update public.project_quotes
    set status = 'expired',
        updated_at = now()
    where id = quote_id;

    raise exception 'Quote has expired';
  end if;

  update public.project_quotes
  set status = response,
      responded_at = now(),
      updated_at = now()
  where id = quote_id
  returning * into target_quote;

  return target_quote;
end;
$$;

revoke all on function public.respond_to_project_quote(uuid, text) from public;
grant all on function public.respond_to_project_quote(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.consultations enable row level security;
alter table public.learning_progress enable row level security;
alter table public.profiles enable row level security;
alter table public.project_files enable row level security;
alter table public.project_invoices enable row level security;
alter table public.project_messages enable row level security;
alter table public.project_quotes enable row level security;
alter table public.projects enable row level security;
alter table public.research_assessments enable row level security;
alter table public.research_profiles enable row level security;
alter table public.user_roles enable row level security;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles for select to authenticated
using ((select private.has_role('admin'::text)));

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select to authenticated
using (((select auth.uid()) is not null) and ((select auth.uid()) = id));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update to authenticated
using (((select auth.uid()) is not null) and ((select auth.uid()) = id))
with check ((select auth.uid()) = id);

drop policy if exists "Admins can view all projects" on public.projects;
create policy "Admins can view all projects"
on public.projects for select to authenticated
using ((select private.has_role('admin'::text)));

drop policy if exists "Admins can update all projects" on public.projects;
create policy "Admins can update all projects"
on public.projects for update to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

drop policy if exists "Users can view own projects" on public.projects;
create policy "Users can view own projects"
on public.projects for select to authenticated
using (((select auth.uid()) is not null) and ((select auth.uid()) = user_id));

drop policy if exists "Users can create own projects" on public.projects;
create policy "Users can create own projects"
on public.projects for insert to authenticated
with check (((select auth.uid()) is not null) and ((select auth.uid()) = user_id));

drop policy if exists "Users can update own projects" on public.projects;
create policy "Users can update own projects"
on public.projects for update to authenticated
using (((select auth.uid()) is not null) and ((select auth.uid()) = user_id))
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own projects" on public.projects;
create policy "Users can delete own projects"
on public.projects for delete to authenticated
using (((select auth.uid()) is not null) and ((select auth.uid()) = user_id));

drop policy if exists "Users can create consultations" on public.consultations;
create policy "Users can create consultations"
on public.consultations for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (
    project_id is null
    or exists (
      select 1
      from public.projects p
      where p.id = consultations.project_id
        and p.user_id = (select auth.uid())
    )
  )
);

drop policy if exists "Users can view consultations" on public.consultations;
create policy "Users can view consultations"
on public.consultations for select to authenticated
using (
  user_id = (select auth.uid())
  or (select private.has_role('admin'::text))
);

drop policy if exists "Admins can update consultations" on public.consultations;
create policy "Admins can update consultations"
on public.consultations for update to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

drop policy if exists "Users can view own learning progress" on public.learning_progress;
create policy "Users can view own learning progress"
on public.learning_progress for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own learning progress" on public.learning_progress;
create policy "Users can create own learning progress"
on public.learning_progress for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own learning progress" on public.learning_progress;
create policy "Users can update own learning progress"
on public.learning_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own learning progress" on public.learning_progress;
create policy "Users can delete own learning progress"
on public.learning_progress for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view project files" on public.project_files;
create policy "Users can view project files"
on public.project_files for select to authenticated
using (
  exists (
    select 1 from public.projects p
    where p.id = project_files.project_id
      and p.user_id = (select auth.uid())
  )
  or (select private.has_role('admin'::text))
);

drop policy if exists "Users can create project files" on public.project_files;
create policy "Users can create project files"
on public.project_files for insert to authenticated
with check (
  uploader_id = (select auth.uid())
  and bucket_id = 'project-files'
  and (
    (
      category = 'data'
      and exists (
        select 1 from public.projects p
        where p.id = project_files.project_id
          and p.user_id = (select auth.uid())
      )
    )
    or (select private.has_role('admin'::text))
  )
);

drop policy if exists "Users can view project messages" on public.project_messages;
create policy "Users can view project messages"
on public.project_messages for select to authenticated
using (
  exists (
    select 1 from public.projects p
    where p.id = project_messages.project_id
      and p.user_id = (select auth.uid())
  )
  or (select private.has_role('admin'::text))
);

drop policy if exists "Users can create project messages" on public.project_messages;
create policy "Users can create project messages"
on public.project_messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and (
    exists (
      select 1 from public.projects p
      where p.id = project_messages.project_id
        and p.user_id = (select auth.uid())
    )
    or (select private.has_role('admin'::text))
  )
);

drop policy if exists "Users can view project quotes" on public.project_quotes;
create policy "Users can view project quotes"
on public.project_quotes for select to authenticated
using (
  (user_id = (select auth.uid()) and status <> 'draft')
  or (select private.has_role('admin'::text))
);

drop policy if exists "Admins can create project quotes" on public.project_quotes;
create policy "Admins can create project quotes"
on public.project_quotes for insert to authenticated
with check (
  (select private.has_role('admin'::text))
  and created_by = (select auth.uid())
  and exists (
    select 1 from public.projects p
    where p.id = project_quotes.project_id
      and p.user_id = project_quotes.user_id
  )
);

drop policy if exists "Admins can update project quotes" on public.project_quotes;
create policy "Admins can update project quotes"
on public.project_quotes for update to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

drop policy if exists "Users can view project invoices" on public.project_invoices;
create policy "Users can view project invoices"
on public.project_invoices for select to authenticated
using (
  (user_id = (select auth.uid()) and status <> 'draft')
  or (select private.has_role('admin'::text))
);

drop policy if exists "Admins can create project invoices" on public.project_invoices;
create policy "Admins can create project invoices"
on public.project_invoices for insert to authenticated
with check (
  (select private.has_role('admin'::text))
  and created_by = (select auth.uid())
  and exists (
    select 1 from public.projects p
    where p.id = project_invoices.project_id
      and p.user_id = project_invoices.user_id
  )
  and exists (
    select 1 from public.project_quotes q
    where q.id = project_invoices.quote_id
      and q.project_id = project_invoices.project_id
      and q.user_id = project_invoices.user_id
      and q.status = 'accepted'
  )
);

drop policy if exists "Admins can update project invoices" on public.project_invoices;
create policy "Admins can update project invoices"
on public.project_invoices for update to authenticated
using ((select private.has_role('admin'::text)))
with check ((select private.has_role('admin'::text)));

drop policy if exists "Users can view own research assessments" on public.research_assessments;
create policy "Users can view own research assessments"
on public.research_assessments for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own research assessments" on public.research_assessments;
create policy "Users can create own research assessments"
on public.research_assessments for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own research assessments" on public.research_assessments;
create policy "Users can update own research assessments"
on public.research_assessments for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own research assessments" on public.research_assessments;
create policy "Users can delete own research assessments"
on public.research_assessments for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own research profile" on public.research_profiles;
create policy "Users can view own research profile"
on public.research_profiles for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own research profile" on public.research_profiles;
create policy "Users can create own research profile"
on public.research_profiles for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own research profile" on public.research_profiles;
create policy "Users can update own research profile"
on public.research_profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own research profile" on public.research_profiles;
create policy "Users can delete own research profile"
on public.research_profiles for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles"
on public.user_roles for select to authenticated
using (
  user_id = (select auth.uid())
  or (select private.has_role('admin'::text))
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists consultations_set_updated_at on public.consultations;
create trigger consultations_set_updated_at
before update on public.consultations
for each row execute function public.set_consultation_updated_at();

drop trigger if exists project_quotes_set_updated_at on public.project_quotes;
create trigger project_quotes_set_updated_at
before update on public.project_quotes
for each row execute function public.set_updated_at();

drop trigger if exists project_invoices_set_updated_at on public.project_invoices;
create trigger project_invoices_set_updated_at
before update on public.project_invoices
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage: project-files
-- ---------------------------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'project-files',
  'project-files',
  false,
  52428800,
  null
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own project storage files" on storage.objects;
create policy "Users can upload own project storage files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-files'
  and (
    exists (
      select 1
      from public.projects p
      where p.user_id = (select auth.uid())
        and p.id::text = (storage.foldername(objects.name))[1]
    )
    or (select private.has_role('admin'::text))
  )
);

drop policy if exists "Users can view own project storage files" on storage.objects;
create policy "Users can view own project storage files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-files'
  and (
    exists (
      select 1
      from public.projects p
      where p.user_id = (select auth.uid())
        and p.id::text = (storage.foldername(objects.name))[1]
    )
    or (select private.has_role('admin'::text))
  )
);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant all on public.projects to authenticated;
grant all on public.projects to service_role;

grant select, insert, update on public.consultations to authenticated;

grant all on public.learning_progress to authenticated;

grant select, insert on public.project_files to authenticated;
grant select, insert on public.project_messages to authenticated;
grant select, insert, update on public.project_quotes to authenticated;
grant select, insert, update on public.project_invoices to authenticated;

grant all on public.research_assessments to authenticated;
grant all on public.research_profiles to authenticated;

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

-- ---------------------------------------------------------------------------
-- Auto-enable RLS for future public tables
-- ---------------------------------------------------------------------------

create or replace function public.rls_auto_enable()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table','partitioned table')
  loop
    if cmd.schema_name is not null
       and cmd.schema_name in ('public')
       and cmd.schema_name not in ('pg_catalog','information_schema')
       and cmd.schema_name not like 'pg_toast%'
       and cmd.schema_name not like 'pg_temp%'
    then
      begin
        execute format(
          'alter table if exists %s enable row level security',
          cmd.object_identity
        );
        raise log 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      exception
        when others then
          raise log 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      end;
    else
      raise log
        'rls_auto_enable: skip % (either system schema or not in enforced list: %.)',
        cmd.object_identity,
        cmd.schema_name;
    end if;
  end loop;
end;
$$;

drop event trigger if exists ensure_rls;
create event trigger ensure_rls
on ddl_command_end
when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
execute function public.rls_auto_enable();
