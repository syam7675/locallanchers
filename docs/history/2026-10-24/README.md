# Local Lanchers history and reusable handoff

Requested coverage: 18–24 October 2026, using India time. Read `HISTORY.pdf` or `HISTORY.md` first. The archive explicitly identifies the missing dated evidence for 18–21 October rather than inventing entries.

## Contents

- `HISTORY.pdf` and `HISTORY.md`: chronological brief, outcomes, limitations and next steps.
- `SKILL.md`: reusable Local Lanchers maintenance instructions.
- `references/`: project context and deliverable links required by the skill.
- `evidence/`: timestamped Git history, saved verification summaries and the latest public-state check.
- `supporting/`: existing V2.1 build/design PDF, V2.2 customer/admin guide, presentation PDF and editable PowerPoint, plus promo production notes.
- `MANIFEST.sha256`: SHA-256 hashes of all other files in the ZIP.

## Use the skill again

Copy `SKILL.md` and the complete `references/` folder into `.agents/skills/local-lanchers-maintenance/` in the actual repository if your agent supports that convention. Ask: “Use local-lanchers-maintenance to continue this project; inspect the current code before changing it.” Otherwise attach both as context. Host support determines activation; this file does not install tools, connect accounts or automatically run in future sessions.

The full application and videos are linked in `references/LINKS.md` rather than duplicated here. This is a documentation/skill bundle. It contains no credentials, environment files, runtime database or private user records. Historical test reports are evidence of earlier checks, not a claim that tests were rerun during this documentation task.

To verify an extracted archive on a system with sha256sum, run `sha256sum -c MANIFEST.sha256` from inside this folder.
