# HubGene — Project Snapshot & Recovery Notes
**Date:** 2026-08-15  
**Purpose:** External recovery snapshot so the project can be reconstructed even if ChatGPT/project history is lost.

---

## 1) Product identity

**Name:** هاب‌ژن / HubGene  
**Focus:** Persian-first bioinformatics and computational biology platform for life-science researchers.

Core product model:

> **Learn → Design → Consult → Analyze**  
> یاد بگیر → پروژه‌ات را طراحی کن → با متخصص مشورت کن → در صورت نیاز تحلیل را بسپار

Core scientific principle:

> **قابل اجرا بودن ≠ مناسب بودن**

The platform should start from the research question, not the tool:

> **سؤال → مفهوم → تصمیم → ابزار**

Trust principle:

> **Clarity = Trust**

---

## 2) Main research lines

1. ترنسکریپتومیکس و RNA-seq / Bulk Transcriptomics
2. پژوهش با داده‌های عمومی / Public Data Research
3. زیست‌شناسی شبکه‌ای و کشف نشانگر زیستی / Network Biology & Biomarker Discovery
4. ترنسکریپتومیکس تک‌سلولی / Single-cell Transcriptomics
5. میکروبیوم و تحلیل 16S / Microbiome & 16S

WES/WGS is deferred.

---

## 3) Current main persona

Life-science MSc-ish researcher/student with little or no programming experience who wants to understand RNA-seq and data analysis structure.

Main need:

> «آن‌قدر بفهمم که بدانم چه اتفاقی دارد می‌افتد و بتوانم برای پروژه خودم تصمیم درست بگیرم.»

Primary learning model:

> **Concept → Purpose → Tools**

---

## 4) Tech stack

- TanStack Start
- React 19
- Vite 8
- Bun
- Supabase
- Cloudflare Workers
- GitHub
- Lovable-origin repository, but development is done manually

GitHub:
- Repo: `Bashir1370/insight-forge-913`
- Branch: `main`

Supabase:
- Org: `HubGene`
- Project: `hubgene`
- Region: Frankfurt
- Project ref: `ocviagxjwsitticawwwn`
- URL: `https://ocviagxjwsitticawwwn.supabase.co`

Cloudflare:
- Project: `hubgene`
- Production: `https://hubgene.bashirmos70217.workers.dev`
- Branch: `main`
- Build command: `bun run build`
- Deploy command: `npx wrangler deploy`

---

## 5) Critical config

### `wrangler.jsonc`

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "hubgene",
  "compatibility_date": "2026-08-13",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "observability": { "enabled": true }
}
```

### `vite.config.ts`

```ts
// @lovable.dev/vite-tanstack-config already includes plugins; don't duplicate them.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
```

Do **not** duplicate TanStack/React/Tailwind plugins.

---

## 6) Environment variable names

Keep these in GitHub/Cloudflare/Supabase configuration as appropriate.

```text
SUPABASE_PROJECT_ID
SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
```

**Do not store service-role keys or database passwords in the browser or repository.**

This snapshot intentionally does not contain secret values.

---

## 7) Existing application routes

Important routes:

```text
/learn
/learn/rna-seq
/learn/rna-seq/navigator
/learn/rna-seq/project

/dashboard
/admin
/consultation
```

Main files:

```text
src/routes/learn.tsx
src/routes/learn_.rna-seq.tsx
src/routes/learn_.rna-seq_.navigator.tsx
src/routes/learn_.rna-seq_.project.tsx
src/routes/_authenticated/dashboard.tsx
src/routes/admin.tsx
src/routes/consultation.tsx
```

Important existing route rule:

```text
src/routes/admin.tsx
```

Do **not** create `_authenticated/admin.tsx`.

Authenticated route:

```text
src/routes/_authenticated/route.tsx
```

Uses Supabase auth and redirects unauthenticated users to `/auth`.

---

## 8) Supabase client/auth conventions

Supabase client:

```ts
import { supabase } from "@/integrations/supabase/client";
```

Auth hook:

```ts
import { useAuth } from "@/hooks/use-auth";
```

When generated Supabase DB types have not yet been refreshed for a newly created table, the current implementation temporarily uses:

```ts
(supabase as any).from("table_name")
```

RLS remains authoritative.

---

## 9) Existing database tables

Known tables include:

```text
profiles
projects
user_roles
project_messages
project_files
consultations
project_quotes
project_invoices
learning_progress
research_assessments
```

Private storage bucket:

```text
project-files
```

Standard direct-upload UI limit:

```text
6 MB
```

---

## 10) Project status vocabulary

Project statuses:

```text
submitted
scientific_review
design_confirmation
data_received
qc
analysis
interpretation
completed
cancelled
```

Quote statuses:

```text
draft
sent
accepted
rejected
expired
cancelled
```

Invoice statuses:

```text
draft
issued
paid
overdue
cancelled
```

RPC used for quote responses:

```text
respond_to_project_quote
```

There is **no** `quote_approved` status.

---

## 11) `learning_progress` table — SQL used

```sql
create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  research_line text not null,

  node_id text not null,

  status text not null default 'in_progress'
    check (
      status in (
        'not_started',
        'in_progress',
        'completed',
        'needs_review'
      )
    ),

  confidence text
    check (
      confidence is null
      or confidence in (
        'unclear',
        'developing',
        'clear'
      )
    ),

  selected_answer smallint,

  is_correct boolean,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (user_id, research_line, node_id)
);

create index if not exists learning_progress_user_id_idx
  on public.learning_progress (user_id);

create index if not exists learning_progress_user_research_line_idx
  on public.learning_progress (user_id, research_line);

alter table public.learning_progress
  enable row level security;

drop policy if exists "Users can view own learning progress"
  on public.learning_progress;

create policy "Users can view own learning progress"
  on public.learning_progress
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
  );

drop policy if exists "Users can create own learning progress"
  on public.learning_progress;

create policy "Users can create own learning progress"
  on public.learning_progress
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
  );

drop policy if exists "Users can update own learning progress"
  on public.learning_progress;

create policy "Users can update own learning progress"
  on public.learning_progress
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
  )
  with check (
    (select auth.uid()) = user_id
  );

drop policy if exists "Users can delete own learning progress"
  on public.learning_progress;

create policy "Users can delete own learning progress"
  on public.learning_progress
  for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
  );

grant select, insert, update, delete
  on public.learning_progress
  to authenticated;
```

---

## 12) `research_assessments` table — SQL used

```sql
create table if not exists public.research_assessments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  research_line text not null,

  question_type text,

  data_stage text,

  replicate_level text,

  metadata_level text,

  analysis_goal text,

  recommendation_level text
    check (
      recommendation_level is null
      or recommendation_level in (
        'learn',
        'review',
        'design'
      )
    ),

  recommendation_destination text,

  answers jsonb not null default '{}'::jsonb,

  status text not null default 'active'
    check (
      status in (
        'active',
        'completed',
        'archived'
      )
    ),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  unique (user_id, research_line)
);

create index if not exists research_assessments_user_id_idx
  on public.research_assessments (user_id);

create index if not exists research_assessments_user_line_idx
  on public.research_assessments (user_id, research_line);

create index if not exists research_assessments_goal_idx
  on public.research_assessments (analysis_goal);

alter table public.research_assessments
  enable row level security;

drop policy if exists "Users can view own research assessments"
  on public.research_assessments;

create policy "Users can view own research assessments"
  on public.research_assessments
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
  );

drop policy if exists "Users can create own research assessments"
  on public.research_assessments;

create policy "Users can create own research assessments"
  on public.research_assessments
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
  );

drop policy if exists "Users can update own research assessments"
  on public.research_assessments;

create policy "Users can update own research assessments"
  on public.research_assessments
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
  )
  with check (
    (select auth.uid()) = user_id
  );

drop policy if exists "Users can delete own research assessments"
  on public.research_assessments;

create policy "Users can delete own research assessments"
  on public.research_assessments
  for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
  );

grant select, insert, update, delete
  on public.research_assessments
  to authenticated;
```

---

## 13) RNA-seq Navigator

Current 12 nodes:

1. سؤال پژوهشی / Research Question
2. طراحی مطالعه / Experimental Design
3. از نمونه تا FASTQ / Sample to Sequencing
4. کنترل کیفیت / Quality Control
5. کمی‌سازی بیان / Quantification
6. ماتریس بیان / Expression Matrix
7. نرمال‌سازی داده / Normalization
8. بررسی ساختار نمونه‌ها / Sample Exploration
9. تحلیل بیان افتراقی / Differential Expression
10. نمایش نتایج / Visualization
11. تحلیل عملکردی / Functional Analysis
12. تفسیر زیستی / Biological Interpretation

Progress behavior:

- checkpoint answer + confidence required
- `completed` or `needs_review`
- guest mode works without DB write
- authenticated mode saves to `learning_progress`
- refresh restores progress
- resumes at first incomplete node

---

## 14) RNA-seq Project Mode

Route:

```text
/learn/rna-seq/project
```

Five assessment inputs:

1. Research Question
2. Data Stage
3. Biological Replicates
4. Metadata
5. Analysis Goal

Possible goals:

```text
differential-expression
functional
network
biomarker
explore
unsure
```

Recommendation levels:

```text
learn
review
design
```

Recommendation destinations:

```text
rna-seq-foundations
differential-expression
functional-analysis
network-biology
biomarker-discovery
data-exploration
```

Important routing behavior:

- WGCNA / network goal should route to **Network Biology / WGCNA Readiness**
- Biomarker goal should route to biomarker discovery + validation
- Functional goal should route to functional analysis
- Differential-expression goal should remain in RNA-seq DE path
- Unknown/fundamental gaps can still route back to RNA-seq foundations

Current WGCNA principle:

> The number of replicates per group alone is not enough to declare WGCNA readiness. Total independent sample count, expression matrix structure, filtering/preprocessing, data quality, and traits/phenotypes need separate review.

Project Mode persistence:

- Guest can use it without login
- Authenticated users save to `research_assessments`
- Refresh restores answers
- Completed result restores
- Restart deletes the current RNA-seq assessment row
- Tested successfully

Example saved WGCNA assessment:

```text
research_line                rna-seq
analysis_goal                network
recommendation_level         review
recommendation_destination   network-biology
status                       completed
```

Example `answers`:

```json
{
  "questionType": "group-comparison",
  "dataStage": "count-matrix",
  "replicates": "three-plus",
  "metadata": "clear",
  "goal": "network"
}
```

---

## 15) Dashboard direction

Existing dashboard is a real production dashboard containing:

- project list
- status/stage tracking
- project files
- messages
- consultations
- reports
- results
- quotes
- invoices/payments

Learning progress has already been integrated into Dashboard.

A newer personalized Dashboard version has been prepared to combine:

```text
learning_progress
+
research_assessments
```

Goal:

> Turn Dashboard into a personal research workspace, not merely an account panel.

Example desired personalized state:

```text
تمرکز پژوهشی فعلی: تحلیل شبکه و WGCNA
وضعیت پروژه: نیازمند بازبینی
مسیر پیشنهادی: بررسی آمادگی WGCNA
یادگیری RNA-seq: 7/12
پیشنهاد شخصی: تکمیل مفاهیم مرتبط قبل از ورود به تحلیل شبکه
```

Important concept:

> User behavior in one part of the site should change the experience in another part.

---

## 16) Persian-first language standard

Main UI should use Persian for translatable specialist terms, with English scientific subtitles only where useful.

Examples:

```text
سؤال پژوهشی / Research Question
طراحی مطالعه / Experimental Design
تکرار زیستی / Biological Replicate
فراداده / Metadata
اثر دسته‌ای / Batch Effect
کنترل کیفیت / Quality Control
کمی‌سازی / Quantification
ماتریس بیان / Expression Matrix
نرمال‌سازی / Normalization
تحلیل بیان افتراقی / Differential Expression
تحلیل عملکردی / Functional Analysis
تحلیل شبکه / Network Analysis
کشف نشانگر زیستی / Biomarker Discovery
```

Standard names/formats/software stay English:

```text
RNA-seq
scRNA-seq
FASTQ
BAM
TPM
FPKM
DESeq2
edgeR
limma-voom
FastQC
MultiQC
STAR
Salmon
GEO
SRA
TCGA
GO
KEGG
GSEA
WGCNA
PPI
PCA
UMAP
ASV
OTU
QIIME 2
```

Glossary is currently **paused**.

---

## 17) Current product philosophy for personalization

Each meaningful interaction should help HubGene understand the user’s current research path better.

Long-term Dashboard inputs may include:

```text
Learning Progress
Research Assessment
Projects
Consultations
Public Dataset choices
Problem Solver interactions
Research goals
Current blockers
Recommended next action
```

The objective is not generic personalization. It is **research-path personalization**.

---

## 18) Current implementation phase

Completed:

- HubGene Learn shell
- RNA-seq Hub
- RNA-seq Navigator
- learning progress persistence
- Dashboard learning progress
- RNA-seq Project Mode
- goal-aware Recommendation Engine
- Project Mode persistence in `research_assessments`
- Hub ↔ Navigator ↔ Project Mode connections

Current direction:

> Combine learning progress and project assessment into a more personalized Researcher Dashboard.

Future:

- other research-line navigators
- shared concepts
- demo projects
- contextual consultation
- public-data strategy
- network biology readiness
- broader personalized research workspace

Not building yet:

- AI chatbot
- automatic AI study design
- raw sequencing upload inside Learn
- LMS/certificates
- heavy gamification
- forum
- WES/WGS Navigator
- multi-omics
- docking/drug-discovery

---

# Recovery checklist

If the project ever needs to be rebuilt:

1. Restore the GitHub repository.
2. Restore `.env` values from a secure password manager / encrypted local file.
3. Recreate or restore Supabase project.
4. Run database schema/migration SQL.
5. Restore data backups if needed.
6. Restore Storage bucket files if they were backed up separately.
7. Reconnect Cloudflare project to the GitHub repository.
8. Restore Cloudflare environment variables/secrets.
9. Confirm `wrangler.jsonc`.
10. Confirm `vite.config.ts`.
11. Deploy from `main`.
12. Test:
    - auth
    - `/dashboard`
    - `/admin`
    - `/consultation`
    - `/learn`
    - `/learn/rna-seq`
    - `/learn/rna-seq/navigator`
    - `/learn/rna-seq/project`
    - learning persistence
    - assessment persistence
    - project messages/files
    - quote response
    - invoice display

---

# Backup rule

Do not rely on one backup.

Recommended minimum:

```text
GitHub repository
+
local source ZIP
+
Supabase database backup/export
+
storage backup
+
secure environment-variable backup
+
this project snapshot
```

A ChatGPT conversation/project should be treated as documentation convenience, not the only place where project knowledge exists.