# Learning progress persistence scope

Current client-side persistence applies to lessons rendered through `GuidedConceptLesson`.

Stored per lesson:
- current section
- selected answers
- highest unlocked section

Storage is browser/device local and is intentionally isolated by lesson `sectionId`.

The integrated project lesson has a separate simulator state model and should use the same persistence hook in a follow-up change rather than relying on implicit DOM behavior.
