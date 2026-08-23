# HubGene — Project Master Context

**Updated:** 2026-08-23  
**Repository:** `Bashir1370/insight-forge-913`  
**Primary branch:** `main`  
**Purpose:** Single Markdown source for project continuity, architecture, recovery notes, stabilization status, and the next development direction.

> GitHub source code is the source of truth for implementation. This file is the single human-readable project context kept in the repository.

---

## 1. Product identity

**HubGene / هاب‌ژن** is a Persian-first bioinformatics and computational-biology platform for life-science researchers.

Core product model:

> **Learn → Design → Consult → Analyze**

Core scientific principles:

> **سؤال → مفهوم → تصمیم → ابزار**

> **قابل اجرا بودن ≠ مناسب بودن**

> **Clarity = Trust**

The product should help a researcher understand the scientific problem and the structure of an analysis before presenting software as the solution.

Primary early persona:

- life-science MSc-level learner/researcher,
- little or no programming experience,
- wants enough understanding to make correct research decisions,
- does not need to become a software engineer before understanding bioinformatics.

Educational default:

> **Concept → Purpose → Input → Output → Checks → Mistakes → Tools**

---

## 2. Main research lines

Initial product research lines:

1. Bulk Transcriptomics / RNA-seq
2. Public Data Research — GEO / SRA / TCGA
3. Network Biology & Biomarker Discovery
4. Single-cell Transcriptomics
5. Microbiome / 16S

WES/WGS and broader multi-omics are deferred.

Cross-cutting concepts include experimental design, reproducibility, visualization, biological interpretation, GO, KEGG, GSEA, pathway analysis, and statistics.

---

## 3. Product architecture direction

HubGene is not intended to become a static article collection or a generic LMS.

Each research line should progressively support:

- Start Here
- Learning Navigator
- Workflow Map
- Data Explorer
- Demo / real project
- Guides
- Learning Path
- Project Mode
- Problem Solver
- Expert Consultation

The preferred architecture is a shared engine with research-line-specific scientific content rather than five unrelated hard-coded wizards.

User behavior in one part of the product should eventually influence recommendations elsewhere. The goal is **research-path personalization**, not generic personalization.

---

## 4. Current technology stack

Current repository stack:

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite 8
- Bun
- Tailwind CSS 4
- Supabase
- Cloudflare Workers
- GitHub
- Lovable-connected repository

Important package scripts:

```text
bun run dev
bun run build
bun run build:dev
bun run preview
bun run lint
bun run typecheck
bun run format
```

`typecheck` was added during the 2026-08-23 stabilization pass and runs:

```text
tsc --noEmit
```

TypeScript is configured in strict mode.

---

## 5. Lovable / Git history safety rule

This repository is connected to Lovable.

**Do not rewrite published Git history.**

Avoid:

- force push,
- rebasing already-pushed shared history,
- amending already-pushed commits,
- squashing/replacing published history in a way that rewrites it.

Commits pushed to connected branches may sync back to Lovable. Keep shared branches in a working state.

Preferred workflow for significant development:

1. create a branch from `main`,
2. make focused commits,
3. open a pull request,
4. run quality checks,
5. merge without rewriting published history.

---

## 6. Deployment

### Cloudflare

Project:

```text
hubgene
```

Known production deployment:

```text
https://hubgene.bashirmos70217.workers.dev
```

Build command:

```text
bun run build
```

Deploy command:

```text
npx wrangler deploy
```

`wrangler.jsonc` uses Cloudflare Workers with `nodejs_compat`.

Important historical deployment lesson:

> Build the TanStack Start application before Wrangler deploy. Deploying without a generated build can cause errors around `@tanstack/react-start/server-entry`.

### Vite

`@lovable.dev/vite-tanstack-config` already configures the TanStack/React/Tailwind integration. Do not duplicate those plugins manually unless the build architecture is deliberately changed.

---

## 7. Environment variables and repository security

Expected environment-variable names include:

```text
SUPABASE_PROJECT_ID
SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
```

Rules:

- Never commit service-role keys, database passwords, private API keys, tokens, or production secrets.
- Browser code may only receive values intended to be public/publishable.
- `VITE_...` variables are bundled for the client and must never contain a secret key.
- Secrets belong in the appropriate Cloudflare/Supabase/GitHub secret configuration or a secure password manager.

### Stabilization change — 2026-08-23

The repository previously tracked a root `.env` file. During stabilization:

- `.env` was removed from the working branch,
- `.env` and `.env.*` are now ignored,
- `.env.example` remains allowed,
- a safe `.env.example` was added.

Important:

> Removing `.env` from the current tree does **not** remove its historical contents from Git history.

If the old file contained active credentials, rotate/revoke those credentials. Do not rewrite Lovable-connected published Git history merely to hide an already-exposed secret; rotate the secret instead.

---

## 8. Main application routes

Important current routes include:

```text
/learn
/learn/rna-seq
/learn/rna-seq/navigator
/learn/rna-seq/project
/dashboard
/admin
/admin/content
/consultation
```

Important route rule:

```text
src/routes/admin.tsx
```

is the intended main admin route. Do not create a competing authenticated admin file-route that maps to the same URL.

Authenticated user areas use Supabase Auth and redirect unauthenticated users to `/auth`.

---

## 9. Existing production-oriented user workflow

The application already contains a substantial researcher/project workflow, not only educational pages.

Existing areas include:

- project creation,
- project list and stages,
- researcher dashboard,
- admin dashboard,
- project files,
- project messages,
- consultations,
- reports/results,
- quotes,
- invoices/payment state.

These working flows should be preserved during future Learn/Navigator refactors.

Known project statuses:

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

Known quote statuses:

```text
draft
sent
accepted
rejected
expired
cancelled
```

Known invoice statuses:

```text
draft
issued
paid
overdue
cancelled
```

Known quote-response RPC:

```text
respond_to_project_quote
```

There is no `quote_approved` status in the known design.

---

## 10. Admin and content management

There are currently two related admin surfaces.

### Operational admin

File:

```text
src/routes/admin.tsx
```

Used for operational/business management such as:

- projects,
- profiles,
- messages,
- project files,
- consultations,
- quotes,
- invoices.

Access is restricted to authenticated users with an `admin` role.

### Learning content admin

File:

```text
src/routes/admin_.content.tsx
```

Rendered route:

```text
/admin/content
```

This is the content-management hub for RNA-seq learning content. The intended workflow is primarily **edit content on the actual lesson page**, not maintain a disconnected CMS copy.

Current CMS supports:

- draft editing,
- preview,
- publish,
- revision history,
- restoring a revision to draft,
- text editing,
- question/answer editing,
- image/video media,
- reusable terminology intro controls.

Key implementation files:

```text
src/features/learning/cms/GuidedLessonCms.tsx
src/features/learning/cms/IntegratedProjectCms.tsx
src/features/learning/cms/TermsIntroCms.tsx
src/features/learning/cms/learning-content-service.ts
src/features/learning/cms/useStableGuidedLessonCms.ts
```

The code/content boundary is intentional: complex React behavior remains in code while editable scientific content is stored as structured CMS data.

---

## 11. Learning CMS database model

Repository migrations currently create these CMS tables:

```text
learning_content_drafts
learning_content_published
learning_content_revisions
```

The CMS also uses a public Supabase Storage bucket:

```text
learning-media
```

Known allowed media formats include PNG, JPEG, WebP, GIF, MP4, and WebM, with the current migration setting a 100 MB file-size limit.

RLS policies rely on:

```text
private.has_role('admin'::text)
```

The definition of `private.has_role` is **not currently present in the repository migration history**.

This is part of the database-recovery gap described below.

---

## 12. RNA-seq learning architecture — current code

The current code contains both an earlier Navigator/Project Mode experience and a newer guided specialist learning path.

### Earlier RNA-seq Navigator

Route:

```text
/learn/rna-seq/navigator
```

Historical 12-node mental model:

1. Research Question
2. Experimental Design
3. Sample to Sequencing
4. Quality Control
5. Quantification
6. Expression Matrix
7. Normalization
8. Sample Exploration
9. Differential Expression
10. Visualization
11. Functional Analysis
12. Biological Interpretation

The Navigator uses checkpoint answers/confidence and supports account-backed persistence for authenticated users.

### Project Mode

Route:

```text
/learn/rna-seq/project
```

Known assessment dimensions:

1. Research Question
2. Data Stage
3. Biological Replicates
4. Metadata
5. Analysis Goal

Known goals:

```text
differential-expression
functional
network
biomarker
explore
unsure
```

Known recommendation levels:

```text
learn
review
design
```

WGCNA/network readiness must not be inferred from replicates-per-group alone. Total independent sample count, matrix structure, preprocessing/filtering, quality, and phenotype/trait information require separate review.

### Newer guided learning content

`src/features/learning/learning-catalog.ts` currently defines a foundation path plus an 11-lesson Bulk RNA-seq specialist path.

Current Bulk RNA-seq lessons:

1. Study design
2. Sample to RNA
3. Library preparation
4. Sequencing & FASTQ
5. Raw-data QC
6. Alignment & quantification
7. Count matrix
8. Sample-level QC
9. Normalization & differential expression
10. Biological interpretation
11. Integrated pancreatic cancer project

Lessons 1–10 share the `GuidedConceptLesson` runtime. Lesson 11 has integrated-project-specific CMS support.

This shared runtime is important because progress, CMS integration, terminology handling, media, and navigation behavior are centralized rather than duplicated across lessons.

---

## 13. Learning progress persistence

Current guided lessons use dual persistence:

- localStorage as device/offline fallback,
- Supabase `learning_progress` for authenticated users.

Known cloud key:

```text
(user_id, research_line, node_id)
```

Current guided learning research line:

```text
rna-seq-learning
```

Current progress payload version:

```text
version: 2
```

It stores current position, unlocked range, answers, and timestamps.

On load, local and cloud timestamps are compared and the newer state wins. Changes are written locally and then debounced to Supabase. Reset clears both local and account-backed progress for the lesson.

### Important future fix

Current answer persistence is based on numeric section indexes and numeric option indexes. CMS editors can structurally change a lesson or reorder answer options.

Therefore future content publishing should introduce a **content revision/version/hash** relationship between published lesson content and stored progress. Structural CMS changes must have an explicit migration/reset policy so old answers cannot silently point to a different option.

---

## 14. Known database tables

Known application tables include:

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
learning_content_drafts
learning_content_published
learning_content_revisions
```

Known Storage buckets include:

```text
project-files
learning-media
```

The standard direct project-file upload UI has historically used a roughly 6 MB browser upload limit. This is not an appropriate final architecture for large scientific raw data such as FASTQ.

---

## 15. Supabase migration / type status

### Current repository migrations

At the 2026-08-23 stabilization checkpoint, the repository contains three Supabase migrations:

```text
20260819164500_add_cross_device_learning_progress_state.sql
20260819170818_add_learning_content_cms.sql
20260819173349_optimize_learning_content_cms_policies.sql
```

Important gap:

- the first migration alters an already-existing `learning_progress` table,
- CMS policies depend on `private.has_role`,
- several production tables predate the available migration history,
- the generated Supabase type snapshot contains only `profiles` and `projects`.

Therefore the repository is **not yet a complete database disaster-recovery source**.

### Safe stabilization decision

No guessed migration was added to production schema during this pass. Reconstructing security-sensitive database objects without the live schema could alter RLS or table behavior.

Instead:

- generated `src/integrations/supabase/types.ts` remains untouched,
- `src/integrations/supabase/database.ts` was added as a compatibility layer,
- the Supabase client now imports the compatibility `Database` type,
- known generated table types remain available,
- legacy/unrepresented tables and RPCs can compile until a fresh complete schema type generation is performed.

This compatibility layer is temporary.

### Required future database stabilization

Before claiming full recovery/reproducibility:

1. export the complete live Supabase schema,
2. save a canonical schema backup outside the production database,
3. reconcile historical objects with repository migrations,
4. regenerate `src/integrations/supabase/types.ts` from the complete project,
5. remove the temporary compatibility widening in `database.ts`,
6. verify all RLS policies and `private.has_role`,
7. test a clean database replay in a disposable environment.

Do not invent a production migration merely to make the repository look complete.

---

## 16. Browser R / WebR proof of concept

The current repository includes a browser-based R proof of concept:

```text
src/features/transcriptomics-learning/rna-seq/BrowserRnaSeqPoc.tsx
```

It dynamically loads WebR and currently uses **synthetic technical demonstration data**, not TCGA data.

The PoC demonstrates ideas such as:

- inspecting expression/count-like data,
- library-size calculations,
- log transformation,
- PCA,
- reproducibility,
- attempting a DESeq2-related environment check.

Treat this as a technical experiment. It does not replace the product requirement for scientifically curated real-study examples.

---

## 17. Real RNA-seq analysis direction

The intended next high-value educational development is a real, reproducible RNA-seq case-study experience using curated fixed snapshots rather than trying to perform heavy remote bioinformatics live in the browser.

Preferred first "Golden Template":

```text
TCGA-LIHC
```

Target learning flow:

```text
Research Question
→ Dataset
→ Metadata
→ Count Matrix
→ QC
→ Normalization
→ PCA
→ DESeq2
→ Volcano
→ Heatmap
→ Biological Interpretation
→ Pathway Analysis
→ Complete R Script
```

Scientific rules:

- use appropriate count data for DESeq2,
- do not substitute TPM/FPKM for raw-count-based DESeq2 analysis,
- expose real metadata and study structure,
- provide complete reusable R code,
- distinguish exploratory visualizations from statistical evidence,
- keep biological interpretation connected to limitations and study design.

Planned progression after the first template:

```text
TCGA-LIHC — foundational
TCGA-BRCA — intermediate
TCGA-LUAD — more advanced
```

A later "R for biologists" layer can reuse these real projects.

---

## 18. Current CMS technical debt

Known non-blocking issues to address incrementally:

1. **Publish is not transactional.** Revision insert, published upsert, and draft cleanup currently happen as separate client operations. A database RPC/transaction would be safer.
2. **Media cleanup can orphan files.** Removing media from content does not always delete the corresponding Storage object.
3. **Stable CMS hook duplicates a published-content fetch.** Low-priority optimization.
4. **Progress is not bound to content revision.** Structural edits can invalidate stored numeric answer indexes.
5. **Generated database types are stale.** Temporary compatibility widening is in place until a real schema regeneration is possible.

---

## 19. Maintainability debt

Several route/components have grown very large, including the operational admin, researcher dashboard, RNA-seq Navigator, and Project Mode.

Do not perform a large cosmetic refactor merely because files are long. Refactor when a concrete development milestone benefits from it.

Preferred future decomposition boundaries include:

- data-access/services,
- domain types,
- page sections,
- forms/editors,
- reusable project/admin components,
- learning runtime vs scientific lesson data.

The shared `GuidedConceptLesson` pattern is a good example of the desired direction.

---

## 20. Quality gates added in stabilization

GitHub Actions workflow:

```text
.github/workflows/quality.yml
```

Intended checks:

```text
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run build
```

The workflow is configured for `main`, stabilization branches, and pull requests.

At the time this master file was written, the connector had not yet observed a completed workflow run for the new commits. Do not assume CI is green until GitHub reports an actual successful run.

---

## 21. Stabilization pass — 2026-08-23

Branch:

```text
stabilization/security-ci-2026-08-23
```

Pull request:

```text
#20 — Stabilization: secure env handling and add quality gates
```

Changes performed:

- repository confirmed private while GitHub integration access remains available,
- `.env` removed from the branch,
- environment files added to `.gitignore`,
- safe `.env.example` added,
- `typecheck` package script added,
- GitHub Actions quality workflow added,
- Supabase compatibility database type added without modifying generated types,
- Supabase client switched to the compatibility type,
- no destructive database migration was guessed,
- old project Markdown files are being consolidated into this single master context.

---

## 22. Documentation policy from this point forward

This file is the only general project Markdown document intended to remain in the repository.

When a major milestone is completed, update this file instead of creating dated context/back-up Markdown files.

GitHub code remains implementation truth. This document should contain:

- product decisions,
- architectural constraints,
- deployment/recovery knowledge,
- current milestone state,
- important technical debt,
- next development direction.

Avoid copying secrets or large obsolete code snapshots into documentation.

---

## 23. Recovery checklist

For a full recovery, maintain more than this repository alone.

Minimum recovery assets:

```text
GitHub repository
+
Supabase schema/database backup
+
Supabase Storage backup/inventory
+
Cloudflare configuration
+
secure environment-variable backup
```

Recovery sequence:

1. restore/clone the GitHub repository,
2. restore secrets from a secure secret store,
3. recreate or restore Supabase,
4. restore canonical schema and migrations,
5. restore database data as required,
6. restore Storage files as required,
7. restore Cloudflare environment variables/secrets,
8. run `bun install`,
9. run `bun run lint`,
10. run `bun run typecheck`,
11. run `bun run build`,
12. deploy,
13. test auth, dashboard, admin, consultation, Learn, RNA-seq learning, persistence, project files/messages, quotes, and invoices.

Do not rely on a ChatGPT conversation as the only project backup.

---

## 24. Next development checkpoint

After the stabilization PR is reviewed/merged, return to product development rather than adding more cleanup for its own sake.

Recommended next milestone:

> **Build the detailed TCGA-LIHC real-analysis learning experience as the first reusable Golden Template.**

Before implementation, define the exact learner UX for each step:

- what the learner sees,
- what question they answer,
- which chart/table is shown,
- what R code is revealed,
- what must be understood before the next step unlocks,
- which data artifacts are fixed snapshots,
- how the complete reproducible script is delivered.

This should then become the template for later BRCA/LUAD case studies and future research-line projects.

---

## 25. Immediate development rules

When continuing development:

- preserve working auth/project/admin/payment flows,
- prefer small feature branches and PRs,
- do not rewrite Lovable-connected history,
- do not commit secrets,
- keep RLS authoritative,
- do not use normalized expression values as raw counts for DESeq2,
- keep scientific claims and visualizations tied to real data provenance,
- keep Persian-first UX and RTL behavior,
- update this master file when a major architecture/product decision changes.

---

# Current status

**Repository cleanup/stabilization is nearly complete.**  
**Next phase: continue HubGene product development, starting from the real RNA-seq learning/case-study experience unless a newer explicit product decision supersedes it.**
