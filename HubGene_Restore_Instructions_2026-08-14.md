# HubGene — Restore & Backup Instructions
**Backup date:** 2026-08-14

This file explains how to recover the project context if the current ChatGPT account, project, or conversation is unavailable.

---

# A) What to keep outside ChatGPT

Keep at least these copies:

1. The ZIP archive containing these markdown files
2. A cloned/local copy or accessible remote of the GitHub repository
3. Supabase schema/migration backups
4. Cloudflare deployment/config notes
5. Secrets in a password manager

Recommended locations:
- Local computer
- Cloud drive
- Optional external drive

Do not rely on a single location.

---

# B) How to restart in a new ChatGPT account

Upload:

- `HubGene_Master_Context_2026-08-14.md`
- `HubGene_Product_Backup_2026-08-14.md`
- `HubGene_Technical_Backup_2026-08-14.md`

Then send:

> این‌ها بکاپ پروژه HubGene من هستند. هر سه فایل را کامل بخوان.  
> تصمیم‌های محصولی و استراتژیک را از Master/Product Context ادامه بده و برای کد، GitHub را منبع اصلی بدان.  
> ما فعلاً روی نیازسنجی و طراحی پنج Research Line برای Persona اول کار می‌کنیم و گام بعدی Public Data Research است.  
> بدون درخواست من به کدنویسی برنگرد.

---

# C) What each file is for

## Master Context
Use when:
- starting a new conversation,
- giving a new AI the full story,
- deciding what the next project step is.

## Product Backup
Use when:
- designing learning architecture,
- building Research Navigator,
- defining consultation/course/product flow,
- returning to Persona/research-line work.

## Technical Backup
Use when:
- resuming coding,
- recovering deployment context,
- checking existing features,
- preventing accidental overwrites.

---

# D) Source-of-truth order

For product strategy:
1. Latest explicit decisions in the current discussion
2. Master/Product backup
3. Older conversations

For code:
1. Current GitHub repository
2. Current Supabase schema
3. Current deployed behavior
4. Technical backup
5. Old code snippets in chats

---

# E) Recommended recurring backup routine

After each major milestone:
- update these markdown files,
- add the date,
- export a new ZIP,
- keep previous ZIPs instead of overwriting them.

Suggested naming:

`HubGene_Backup_YYYY-MM-DD.zip`

Examples:
- `HubGene_Backup_2026-08-14.zip`
- `HubGene_Backup_2026-09-01.zip`

---

# F) Next milestone to add to the backup

When the following are completed, create a new backup:

- Public Data Research Navigator
- Network Biology Navigator
- Single-cell Navigator
- Microbiome Navigator
- Unified HubGene Learn architecture

Then create another backup before implementation begins.

---

# G) Current continuation point

Continue with:

## Persona 01 × Public Data Research

The user persona remains:

> دانشجوی ارشد/پژوهشگر علوم زیستی که برنامه‌نویسی بلد نیست و می‌خواهد ساختار تحلیل داده را به زبان ساده بفهمد.

Research line to design:

> GEO / SRA / TCGA / public-data research

Do not jump to implementation yet.

---

# End
