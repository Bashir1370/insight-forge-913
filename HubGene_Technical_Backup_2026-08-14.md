# HubGene — Technical Backup
**Backup date:** 2026-08-14  
**Purpose:** Preserve technical setup, major implemented features, key architecture decisions, and recovery notes.

> IMPORTANT: This file is a continuity document, not a substitute for the repository.  
> **GitHub is the source of truth for current code.**
> Old code snippets shared in ChatGPT may represent earlier snapshots.

---

# 1) Production / repository

## Production URL
`https://hubgene.bashirmos70217.workers.dev`

## GitHub repository
`Bashir1370/insight-forge-913`

## Hosting
Cloudflare Workers

## Backend
Supabase

## Supabase project name
`hubgene`

## Frontend stack
- React
- Vite
- TanStack Start / TanStack Router-style file routes
- TypeScript
- Tailwind-style utility classes
- shadcn/ui style components
- lucide-react icons

The project was originally generated with Lovable-style tooling.

---

# 2) Cloudflare deployment history

Cloudflare Workers deployment was successfully configured.

A deployment issue caused by automatic Wrangler detection/configuration was resolved by adding:

`wrangler.jsonc`

Environment variables for Supabase were added to Cloudflare.

Client-side Supabase usage requires `VITE_...` environment variable forms.

Do **not** store private secrets in this backup.

---

# 3) Supabase Auth

Supabase Auth is working.

Auth flow has been connected to the deployed Cloudflare Workers URL.

Site URL and redirect URLs were updated to the deployed domain.

Protected routing uses a route such as:

`/_authenticated`

and redirects unauthenticated users to:

`/auth`

---

# 4) Admin role

An admin-role system exists using:

`user_roles`

and a helper concept/function:

`private.has_role('admin')`

Admin access has previously been tested.

Admin URL:

`/admin`

Full deployed URL:

`https://hubgene.bashirmos70217.workers.dev/admin`

---

# 5) Important routing fix

There was a routing conflict between:

`/src/routes/admin.tsx`

and:

`/src/routes/_authenticated/admin.tsx`

The duplicate authenticated admin route was removed.

The intended admin page is:

`src/routes/admin.tsx`

If a future routing issue reappears, check for duplicate file-route definitions first.

---

# 6) Researcher dashboard

Dashboard URL:

`/dashboard`

Full deployed URL:

`https://hubgene.bashirmos70217.workers.dev/dashboard`

The researcher dashboard has been developed beyond the early mock version.

It includes / has included the following integrated capabilities:

- project listing
- active-project selection
- project statuses
- stage tracker
- files
- messages
- consultations
- reports
- results
- quotes
- invoices / payments

The dashboard was corrected for RTL using root-level RTL direction and RTL tabs.

---

# 7) Projects

Projects can be created from a Project Wizard.

Project logic includes concepts such as:
- ProjectRow
- status labels
- stage mapping
- analysis labels
- suggested title
- short project ID
- formatted dates
- createProject
- listMyProjects

Important helper file:

`src/lib/projects.ts`

Wizard answer logic lives in:

`src/lib/wizard.ts`

---

# 8) Project Wizard

Route:

`/wizard`

The early/current wizard concept collects a small set of project dimensions and creates a project.

The strategic plan is to **eventually evolve this from a simple project questionnaire into the larger HubGene Research Navigator system**.

Do not throw away the current project-registration capability when building the future Navigator.

Future architecture should distinguish:
- Learning Mode
- Project Design Mode
- Data Mode
- Problem Solver Mode

---

# 9) Project messaging

Messaging between researcher and Admin has been implemented.

The researcher can communicate project context with the admin team from within the project experience.

Preserve this when future product architecture changes.

---

# 10) Project files

Supabase Storage private bucket:

`project-files`

Researcher/Admin file workflows have been implemented.

Current standard browser upload UI has been constrained around a 6 MB limit in the implemented interface.

For large scientific data such as FASTQ, this should **not** be assumed to be the final architecture.

Long-term raw-data transfer needs a more appropriate approach.

---

# 11) Reports and results

Admin can upload reports/result files.

Researchers can access them through dashboard areas/tabs such as:
- Reports
- Results

This is part of the existing project-delivery workflow.

---

# 12) Consultation system

Consultation requests have been implemented.

Admin can manage:
- scheduling
- status
- meeting link
- admin note

Researcher can view consultation status and access the meeting link.

The strategic product plan may expand consultation types, but existing consultation infrastructure should be reused where possible.

---

# 13) Quotes

Database table:

`project_quotes`

Implemented flow:
- Admin drafts a quote
- Admin sends a quote
- Researcher sees it
- Researcher accepts or rejects

Secure response flow uses an RPC concept/function:

`respond_to_project_quote`

Quote RLS/status logic has been implemented.

---

# 14) Invoices

Database table:

`project_invoices`

Known columns:

- `id`
- `project_id`
- `quote_id`
- `user_id`
- `created_by`
- `title`
- `amount`
- `currency`
- `status`
- `due_at`
- `payment_instructions`
- `admin_note`
- `paid_at`
- `payment_reference`
- `created_at`
- `updated_at`

`quote_id` is unique in the current design, meaning one invoice per quote.

Known invoice statuses:
- `draft`
- `issued`
- `paid`
- `overdue`
- `cancelled`

Rules implemented:
- Researcher can see own non-draft invoices.
- Admin can see all.
- Only Admin creates/updates.
- Invoice creation requires an accepted quote with matching project/user.

The end-to-end flow was tested:

**Quote → Accept → Invoice → Paid**

---

# 15) RLS / security philosophy

Supabase RLS is used for ownership separation and admin access.

Do not replace secure server/database authorization with UI-only checks.

When building the future learning platform:
- public learning content can be anonymous,
- logged-in learning progress should be owner-scoped,
- consultation/project data must remain access-controlled,
- sensitive data should not be exposed client-side.

---

# 16) Important current code areas

Known relevant files:

`src/routes/_authenticated/dashboard.tsx`
- researcher dashboard

`src/routes/admin.tsx`
- admin console

`src/routes/wizard.tsx`
- project wizard

`src/routes/_authenticated.tsx`
- auth-protected layout / route

`src/lib/projects.ts`
- project helpers

`src/lib/wizard.ts`
- wizard answers / labels / recommendations

`src/integrations/supabase/client`
- Supabase client

`src/hooks/use-auth`
- auth/session/profile hooks

---

# 17) Auth hook pattern

Known concepts in `use-auth`:
- `useAuth()`
- `useProfile(userId)`
- auth state change subscription
- profile fields such as:
  - id
  - full_name
  - organization
  - research_field
- localized auth error messaging

Future changes should preserve user/profile behavior unless there is a reason to migrate it.

---

# 18) UI / language

The product is:
- Persian-first
- RTL
- research/professional tone

Brand:
**HubGene / هاب‌ژن**

Tagline previously seen:
**Bioinformatics & Computational Biology**

Do not assume the current tagline is final product positioning.

---

# 19) Existing dashboard information architecture

Researcher project tabs have included:

- داده‌ها
- پیام‌ها
- مشاوره‌ها
- گزارش‌ها
- نتایج
- پرداخت‌ها

The future educational platform should probably add a separate learning/research-navigation experience instead of cramming all learning into the existing project tabs.

---

# 20) Future technical architecture — planned direction

When product discovery is complete, likely new product area:

# HubGene Learn / Research Navigator

Potential components:

- `/learn`
- research-line landing pages
- `/learn/rna-seq`
- navigator session
- progress storage
- knowledge/confidence signals
- recommendation engine
- demo projects
- content links
- handoff to project design
- handoff to consultation

Do not lock these route names before implementation; they are conceptual.

---

# 21) Suggested future data model concepts

Not yet implemented/locked. Possible entities:

### learning_tracks
Defines research lines:
- bulk_transcriptomics
- public_data
- network_biology
- single_cell
- microbiome

### learning_nodes
Fields could include:
- id
- track_id
- slug
- order
- title_fa
- level
- content
- input concept
- output concept
- common mistake
- tool notes

### navigator_sessions
- id
- user_id nullable
- track_id
- mode
- started_at
- completed_at
- project_intent
- data_state

### navigator_answers
- session_id
- node_id
- question key
- answer
- confidence

### navigator_progress
- user_id
- track_id
- node_id
- status
- revisit count

### navigator_recommendations
- session_id
- type
- reason
- target

These are planning ideas only; create the schema only after the five research-line designs are complete.

---

# 22) Technical design principle for Navigator

Do not hard-code five totally separate wizards.

Prefer a shared engine driven by structured content/data:

**Research Line**
→ nodes
→ questions
→ explanation levels
→ branching rules
→ recommendations

This makes it possible to reuse the product engine across:
- RNA-seq
- Public Data
- Network Biology
- Single-cell
- Microbiome

---

# 23) Preserve existing working flows

Before future refactors, preserve:

- Auth
- Researcher project dashboard
- Admin project view
- Project creation
- Messaging
- Consultation
- File delivery
- Quote acceptance/rejection
- Invoices
- Payment status
- RTL behavior

Do not overwrite large files blindly.

Use current GitHub source before replacing anything.

---

# 24) Important note about old uploaded code snapshots

Some code snippets shared earlier in ChatGPT included mocked arrays for:
- files
- messages
- queue
- consultation requests
- dashboard stats

These snippets may be older than the current deployed implementation.

They should be treated as **historical snapshots**, not necessarily the current production state.

Always check:
1. GitHub
2. deployed behavior
3. current Supabase schema

before making a destructive refactor.

---

# 25) Backup checklist for the actual project

This markdown backup does NOT contain all production data.

For full recovery, separately maintain:

- GitHub repository clone / remote
- Supabase SQL schema dump
- Supabase migrations
- Supabase Storage inventory/backups as appropriate
- Cloudflare configuration
- DNS/domain notes if later added
- Environment variable names
- Secret values in a secure password manager, NOT in this file
- ChatGPT data export if desired

---

# 26) Secrets that should NOT be copied into a context file

Do not include:
- Supabase service-role key
- private API keys
- production secrets
- personal passwords
- payment secrets
- tokens

Instead record only the variable **names** and where they are configured.

---

# 27) Current implementation checkpoint

Current website functionality is working.

The team/user intentionally paused feature coding to rethink the product and business direction.

The current priority is:

**Product strategy → needs assessment → Persona 01 → five research-line Navigators**

Only after the five research lines are designed should implementation resume.

Next product topic:

**Persona 01 × Public Data Research**

---

# End of technical backup
