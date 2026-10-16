# Git / PR lab

Repository: https://github.com/Lazzyx22/minidesk (private).

| Head | Base | Purpose |
|---|---|---|
| feature/minidesk-core | main | Working issue tracker |
| test/validation-bug | feature/minidesk-core | Draft lab defect; NEVER MERGE |
| fix/restore-validation | test/validation-bug | Draft lab restoration and boundary tests |

All branches are preserved. No merges or force pushes. Final checkout: fix/restore-validation.

To publish these branches to another empty repository:

```sh
git remote add origin <URL>
git push -u origin main feature/minidesk-core test/validation-bug fix/restore-validation
gh pr create --base main --head feature/minidesk-core --title "feat: implement MiniDesk issue tracker" --body "React/Vite issue tracker with Express/SQLite, validation and tests."
gh pr create --draft --base feature/minidesk-core --head test/validation-bug --title "TEST ONLY: validation defect — NEVER MERGE" --body "Deliberately weakens one title rule for the validation lab. Never merge."
gh pr create --draft --base test/validation-bug --head fix/restore-validation --title "fix: restore title validation" --body "Restores validation and adds boundary tests. Lab comparison only."
```
