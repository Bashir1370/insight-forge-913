-- HubGene production reconciliation
-- Generated from a validated `supabase db diff --linked --schema public,private`.
--
-- Purpose:
--   Normalize a fresh database rebuilt from migrations so that its public/private
--   schema, privileges, constraint names, and stored function definitions match
--   the current production database.
--
-- IMPORTANT:
--   Do not execute this file manually against the current production database.
--   Production already represents the target state. After a zero-diff validation,
--   this migration will be marked as applied in remote migration history only.

revoke delete on table "public"."consultations" from "anon";

revoke insert on table "public"."consultations" from "anon";

revoke references on table "public"."consultations" from "anon";

revoke select on table "public"."consultations" from "anon";

revoke trigger on table "public"."consultations" from "anon";

revoke truncate on table "public"."consultations" from "anon";

revoke update on table "public"."consultations" from "anon";

revoke delete on table "public"."consultations" from "authenticated";

revoke delete on table "public"."consultations" from "service_role";

revoke insert on table "public"."consultations" from "service_role";

revoke select on table "public"."consultations" from "service_role";

revoke update on table "public"."consultations" from "service_role";

revoke delete on table "public"."learning_content_drafts" from "anon";

revoke insert on table "public"."learning_content_drafts" from "anon";

revoke select on table "public"."learning_content_drafts" from "anon";

revoke update on table "public"."learning_content_drafts" from "anon";

revoke delete on table "public"."learning_content_drafts" from "service_role";

revoke insert on table "public"."learning_content_drafts" from "service_role";

revoke select on table "public"."learning_content_drafts" from "service_role";

revoke update on table "public"."learning_content_drafts" from "service_role";

revoke delete on table "public"."learning_content_published" from "anon";

revoke insert on table "public"."learning_content_published" from "anon";

revoke update on table "public"."learning_content_published" from "anon";

revoke delete on table "public"."learning_content_published" from "service_role";

revoke insert on table "public"."learning_content_published" from "service_role";

revoke select on table "public"."learning_content_published" from "service_role";

revoke update on table "public"."learning_content_published" from "service_role";

revoke delete on table "public"."learning_content_revisions" from "anon";

revoke insert on table "public"."learning_content_revisions" from "anon";

revoke select on table "public"."learning_content_revisions" from "anon";

revoke update on table "public"."learning_content_revisions" from "anon";

revoke delete on table "public"."learning_content_revisions" from "service_role";

revoke insert on table "public"."learning_content_revisions" from "service_role";

revoke select on table "public"."learning_content_revisions" from "service_role";

revoke update on table "public"."learning_content_revisions" from "service_role";

revoke delete on table "public"."learning_progress" from "anon";

revoke insert on table "public"."learning_progress" from "anon";

revoke select on table "public"."learning_progress" from "anon";

revoke update on table "public"."learning_progress" from "anon";

revoke delete on table "public"."learning_progress" from "service_role";

revoke insert on table "public"."learning_progress" from "service_role";

revoke select on table "public"."learning_progress" from "service_role";

revoke update on table "public"."learning_progress" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke delete on table "public"."project_files" from "anon";

revoke insert on table "public"."project_files" from "anon";

revoke references on table "public"."project_files" from "anon";

revoke select on table "public"."project_files" from "anon";

revoke trigger on table "public"."project_files" from "anon";

revoke truncate on table "public"."project_files" from "anon";

revoke update on table "public"."project_files" from "anon";

revoke delete on table "public"."project_files" from "authenticated";

revoke update on table "public"."project_files" from "authenticated";

revoke delete on table "public"."project_files" from "service_role";

revoke insert on table "public"."project_files" from "service_role";

revoke select on table "public"."project_files" from "service_role";

revoke update on table "public"."project_files" from "service_role";

revoke delete on table "public"."project_invoices" from "anon";

revoke insert on table "public"."project_invoices" from "anon";

revoke references on table "public"."project_invoices" from "anon";

revoke select on table "public"."project_invoices" from "anon";

revoke trigger on table "public"."project_invoices" from "anon";

revoke truncate on table "public"."project_invoices" from "anon";

revoke update on table "public"."project_invoices" from "anon";

revoke delete on table "public"."project_invoices" from "authenticated";

revoke delete on table "public"."project_invoices" from "service_role";

revoke insert on table "public"."project_invoices" from "service_role";

revoke select on table "public"."project_invoices" from "service_role";

revoke update on table "public"."project_invoices" from "service_role";

revoke delete on table "public"."project_messages" from "anon";

revoke insert on table "public"."project_messages" from "anon";

revoke references on table "public"."project_messages" from "anon";

revoke select on table "public"."project_messages" from "anon";

revoke trigger on table "public"."project_messages" from "anon";

revoke truncate on table "public"."project_messages" from "anon";

revoke update on table "public"."project_messages" from "anon";

revoke delete on table "public"."project_messages" from "authenticated";

revoke update on table "public"."project_messages" from "authenticated";

revoke delete on table "public"."project_messages" from "service_role";

revoke insert on table "public"."project_messages" from "service_role";

revoke select on table "public"."project_messages" from "service_role";

revoke update on table "public"."project_messages" from "service_role";

revoke delete on table "public"."project_quotes" from "anon";

revoke insert on table "public"."project_quotes" from "anon";

revoke references on table "public"."project_quotes" from "anon";

revoke select on table "public"."project_quotes" from "anon";

revoke trigger on table "public"."project_quotes" from "anon";

revoke truncate on table "public"."project_quotes" from "anon";

revoke update on table "public"."project_quotes" from "anon";

revoke delete on table "public"."project_quotes" from "authenticated";

revoke delete on table "public"."project_quotes" from "service_role";

revoke insert on table "public"."project_quotes" from "service_role";

revoke select on table "public"."project_quotes" from "service_role";

revoke update on table "public"."project_quotes" from "service_role";

revoke delete on table "public"."projects" from "anon";

revoke insert on table "public"."projects" from "anon";

revoke references on table "public"."projects" from "anon";

revoke select on table "public"."projects" from "anon";

revoke trigger on table "public"."projects" from "anon";

revoke truncate on table "public"."projects" from "anon";

revoke update on table "public"."projects" from "anon";

revoke delete on table "public"."research_assessments" from "anon";

revoke insert on table "public"."research_assessments" from "anon";

revoke select on table "public"."research_assessments" from "anon";

revoke update on table "public"."research_assessments" from "anon";

revoke delete on table "public"."research_assessments" from "service_role";

revoke insert on table "public"."research_assessments" from "service_role";

revoke select on table "public"."research_assessments" from "service_role";

revoke update on table "public"."research_assessments" from "service_role";

revoke delete on table "public"."research_profiles" from "anon";

revoke insert on table "public"."research_profiles" from "anon";

revoke select on table "public"."research_profiles" from "anon";

revoke update on table "public"."research_profiles" from "anon";

revoke delete on table "public"."research_profiles" from "service_role";

revoke insert on table "public"."research_profiles" from "service_role";

revoke select on table "public"."research_profiles" from "service_role";

revoke update on table "public"."research_profiles" from "service_role";

revoke delete on table "public"."resource_content_blocks" from "anon";

revoke insert on table "public"."resource_content_blocks" from "anon";

revoke update on table "public"."resource_content_blocks" from "anon";

revoke delete on table "public"."resource_content_blocks" from "service_role";

revoke insert on table "public"."resource_content_blocks" from "service_role";

revoke select on table "public"."resource_content_blocks" from "service_role";

revoke update on table "public"."resource_content_blocks" from "service_role";

revoke delete on table "public"."resource_hotspots" from "anon";

revoke insert on table "public"."resource_hotspots" from "anon";

revoke update on table "public"."resource_hotspots" from "anon";

revoke delete on table "public"."resource_hotspots" from "service_role";

revoke insert on table "public"."resource_hotspots" from "service_role";

revoke select on table "public"."resource_hotspots" from "service_role";

revoke update on table "public"."resource_hotspots" from "service_role";

revoke delete on table "public"."resource_tours" from "anon";

revoke insert on table "public"."resource_tours" from "anon";

revoke update on table "public"."resource_tours" from "anon";

revoke delete on table "public"."resource_tours" from "service_role";

revoke insert on table "public"."resource_tours" from "service_role";

revoke select on table "public"."resource_tours" from "service_role";

revoke update on table "public"."resource_tours" from "service_role";

revoke delete on table "public"."user_roles" from "anon";

revoke insert on table "public"."user_roles" from "anon";

revoke references on table "public"."user_roles" from "anon";

revoke select on table "public"."user_roles" from "anon";

revoke trigger on table "public"."user_roles" from "anon";

revoke truncate on table "public"."user_roles" from "anon";

revoke update on table "public"."user_roles" from "anon";

revoke delete on table "public"."user_roles" from "authenticated";

revoke insert on table "public"."user_roles" from "authenticated";

revoke references on table "public"."user_roles" from "authenticated";

revoke trigger on table "public"."user_roles" from "authenticated";

revoke truncate on table "public"."user_roles" from "authenticated";

revoke update on table "public"."user_roles" from "authenticated";

alter table "public"."project_invoices" drop constraint "project_invoices_quote_id_key";

drop index if exists "public"."project_invoices_quote_id_key";

CREATE UNIQUE INDEX project_invoices_quote_unique ON public.project_invoices USING btree (quote_id);

alter table "public"."project_invoices" add constraint "project_invoices_quote_unique" UNIQUE using index "project_invoices_quote_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin

  insert into public.profiles (
    id,
    full_name
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;

  return new;

end;
$function$
;

CREATE OR REPLACE FUNCTION public.respond_to_project_quote(quote_id uuid, response text)
 RETURNS public.project_quotes
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    set
      status = 'expired',
      updated_at = now()
    where id = quote_id;

    raise exception 'Quote has expired';

  end if;

  update public.project_quotes
  set
    status = response,
    responded_at = now(),
    updated_at = now()
  where id = quote_id
  returning *
  into target_quote;

  return target_quote;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_consultation_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.has_role(requested_role text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = requested_role
  );
$function$
;



