# 🛠️ Skill Guide: Git Workflow

This guide establishes the standard Git practices for the **FastPass Admin** project to ensure code stability, clear history, and seamless collaboration.

---

## 🏷️ 1. Commit Message Conventions
We follow the **Conventional Commits** specification. This makes the history readable and allows for automated changelog generation.

**Format:** `<type>: <description>`

| Type | Description | Example |
| :--- | :--- | :--- |
| `feat` | A new feature | `feat: add customer edit dialog` |
| `fix` | A bug fix | `fix: resolve login validation error` |
| `docs` | Documentation changes | `docs: update skill guide` |
| `style` | Formatting, missing semi-colons, etc (no code changes) | `style: fix indentation in auth service` |
| `refactor` | Refactoring production code | `refactor: simplify user permissions logic` |
| `chore` | Maintenance tasks (build, dependencies, etc) | `chore: update primeng to latest` |

---

## 🚀 2. Workflow Modes

### ⚡ Mode A: Direct Push to Main (Solo / Hotfix)
Use this only for small projects, solo work, or critical urgent fixes.

1.  **Check Status:** `git status` (Ensure you are on the right branch)
2.  **Stage Changes:** `git add .`
3.  **Commit:** `git commit -m "feat: your message"`
4.  **Sync (Crucial):** `git pull origin main --rebase`
    > [!TIP]
    > Using `--rebase` keeps the history linear and clean.
5.  **Test:** Ensure `ng serve` is running and no errors exist.
6.  **Push:** `git push origin main`

### 🌿 Mode B: Feature Branch (Collaborative / Large Tasks)
Recommended for major features or when working in a team.

1.  **Create Branch:** `git checkout -b feat/your-feature-name`
2.  **Develop:** Commit changes regularly on your branch.
3.  **Sync Main:** 
    ```bash
    git checkout main
    git pull origin main
    git checkout feat/your-feature-name
    git merge main
    ```
4.  **Push Branch:** `git push origin feat/your-feature-name`
5.  **Merge:** Open a Pull Request (PR) or merge manually if permitted.

---

## ⚠️ 3. Conflict Resolution
If `git pull` or `merge` results in a conflict:

1.  **Locate Conflicts:** Look for files marked as `both modified`.
2.  **Resolve:** Open the files and look for `<<<<<<< HEAD`. Choose the correct version.
3.  **Finalize:**
    ```bash
    git add <resolved-file>
    git commit -m "fix: resolve merge conflicts"
    git push
    ```

---

## ✅ Pre-Push Checklist
- [ ] No compilation errors in terminal (`ng serve` or `ng build`).
- [ ] No `console.log()` left in production code.
- [ ] Code is properly formatted (Prettier/Lint).
- [ ] UI looks consistent with the design system.

> [!IMPORTANT]
> **Never** force push (`--force`) to the `main` branch unless absolutely necessary and coordinated with the team.