# Branch Protection & Deployment Automation

A comprehensive GitHub Actions workflow system for safeguarding code quality and managing deployments across multiple environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Workflows](#workflows)
- [Setup Instructions](#setup-instructions)
- [Git Workflow](#git-workflow)
- [Environment Structure](#environment-structure)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This repository implements a **complete CI/CD pipeline** with branch protection and environment-based deployments:

- ✅ **Automated Testing**: Frontend and backend tests run on every commit
- ✅ **Code Quality Gates**: Branch protection enforces test passing and code reviews
- ✅ **Safe Deployments**: Multi-environment setup (development, staging, production)
- ✅ **Infrastructure as Code**: All settings defined in YAML, version controlled

### Key Features

| Feature | Benefit |
|---------|---------|
| Parallel CI jobs | Fast feedback (frontend + backend in parallel) |
| Branch protection | Prevent broken code from reaching main |
| Code review required | Team knowledge sharing & oversight |
| Environment-based deployment | Safe progression: dev → stage → prod |
| Admin enforcement | Even repository owners follow the rules |

---

## 📁 Project Structure

```
brach_protection/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Automated tests (AUTOMATIC)
│       ├── apply-branch-protection.yml     # Enforce branch rules (SETUP)
│       ├── apply-environments.yml          # Create environments (SETUP)
│       └── discover-check-names.yml        # Debug utility (ON-DEMAND)
├── frontend/
│   ├── package.json                        # Frontend dependencies
│   └── ...
├── backend/
│   ├── pom.xml or build.gradle            # Backend build config
│   └── ...
└── README.md                               # This file
```

---

## 🔄 Workflows

### 1. **ci.yml** — Continuous Integration (AUTOMATIC)

**Runs on:** Every push and pull request to `dev`, `stage`, or `main`

**What it does:**
- Detects frontend/backend projects
- Installs dependencies
- Runs tests
- Builds projects for production

**Jobs:**
- `frontend-build-test`: Tests and builds Node.js frontend
- `backend-build-test`: Tests and builds Java backend (Maven/Gradle)

**Output:** Two status checks
```
✅ frontend-build-test
✅ backend-build-test
```

**YAML Location:** [.github/workflows/ci.yml](.github/workflows/ci.yml)

---

### 2. **apply-branch-protection.yml** — Branch Protection (SETUP)

**Runs on:** Manual trigger (`workflow_dispatch`) or when this file changes

**What it does:**
- Creates `dev`, `stage`, and `main` branches (if missing)
- Applies protection rules to all three branches
- Enforces that both CI tests must pass
- Requires 1 code review approval
- Prevents force pushes and deletions
- Applies rules to admins too

**Protection Rules:**
```yaml
Required Status Checks:
  - frontend-build-test (must pass)
  - backend-build-test (must pass)

Code Review:
  - 1 approval required
  - Stale reviews dismissed on new commits
  - Conversation resolution required

Restrictions:
  - No force pushes
  - No deletions
  - Admins cannot bypass
```

**Requirements:**
- `GH_ADMIN_TOKEN` secret must be configured
- Token scope: `repo + admin:repo_hook` (classic) OR `Administration: Read/Write + Contents: Read` (fine-grained)

**YAML Location:** [.github/workflows/apply-branch-protection.yml](.github/workflows/apply-branch-protection.yml)

---

### 3. **apply-environments.yml** — Deployment Environments (SETUP)

**Runs on:** Manual trigger (`workflow_dispatch`) or when this file changes

**What it does:**
- Creates 3 GitHub Environments:
  - `development` → deployable from `dev` branch only
  - `staging` → deployable from `stage` branch only
  - `production` → deployable from `main` branch only
- Sets deployment branch policies
- Prevents accidental deployments from wrong branches

**Environment Settings:**
- Wait timer: 0 (deploy immediately)
- Self-review: Allowed
- No mandatory reviewers
- Custom branch policies: Enabled

**YAML Location:** [.github/workflows/apply-environments.yml](.github/workflows/apply-environments.yml)

---

### 4. **discover-check-names.yml** — Debug Utility (ON-DEMAND)

**Runs on:** Manual trigger only (`workflow_dispatch`)

**What it does:**
- Lists recent workflow runs
- Shows job names from latest run
- Helps identify actual check names (useful for troubleshooting)

**Use when:**
- You rename a job in ci.yml
- Branch protection says "check not found"
- Need to verify what checks are being produced

**YAML Location:** [.github/workflows/discover-check-names.yml](.github/workflows/discover-check-names.yml)

---

## 🚀 Setup Instructions

### Prerequisites

- [ ] GitHub repository created
- [ ] `frontend/package.json` and/or `backend/pom.xml` (or Gradle equivalent) in repo
- [ ] Administrative access to repository settings

### Step 1: Create GH_ADMIN_TOKEN Secret

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Set name: `GH_ADMIN_TOKEN`
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `admin:repo_hook` (write for hooks)
5. Copy the token (it won't show again)
6. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
7. Click **"New repository secret"**
8. Name: `GH_ADMIN_TOKEN`
9. Value: Paste the token
10. Click **"Add secret"**

### Step 2: Set Up Branch Protection

1. Go to repo → **GitHub Actions**
2. Find **"Apply Branch Protection (IaC)"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait for it to complete (check logs for success)
5. Verify branches were created: **Settings** → **Branches**
6. Verify protection rules: **Settings** → **Branches** → click each branch

### Step 3: Set Up Deployment Environments

1. Go to repo → **GitHub Actions**
2. Find **"Apply Environments (IaC)"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait for completion
5. Verify environments: **Settings** → **Environments**

### Step 4: Verify CI is Working

1. Create a test feature branch: `git checkout -b feature/test-ci`
2. Make a small commit
3. Push: `git push origin feature/test-ci`
4. Go to **GitHub Actions** tab
5. You should see **"CI"** workflow running
6. Wait for completion (both jobs should pass ✅)

---

## 🌿 Git Workflow

This project follows a **feature branch workflow** with branch protection:

### Feature → Dev → Stage → Main

```
Feature Development:
├─ Create feature branch from dev: git checkout -b feature/your-feature dev
├─ Make commits: git commit -m "..."
├─ Push: git push origin feature/your-feature
├─ Open PR to dev
│  ├─ CI tests run automatically ✅
│  ├─ Wait for approval
│  └─ Merge to dev
│
├─ Code is now in development environment 🌍
│
└─ When ready for staging:
   ├─ Create PR: stage from dev
   ├─ Code is tested again on stage branch
   ├─ Merge to stage (deploys to staging env)
   │
   └─ When ready for production:
      ├─ Create PR: main from stage
      ├─ Final testing on production branch
      └─ Merge to main (deploys to production env) 🚀
```

### Example Workflow

```bash
# 1. Start from dev branch
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feature/add-user-auth

# 3. Make changes
echo "export function login() { ... }" > frontend/auth.js

# 4. Commit changes
git add .
git commit -m "feat: add user authentication"

# 5. Push feature branch
git push origin feature/add-user-auth

# 6. Open PR in GitHub UI (dev ← feature/add-user-auth)
# GitHub Actions will:
#   ✅ Run ci.yml automatically
#   ✅ Show results on PR
#   ✅ Block merge if tests fail
#   ✅ Require 1 approval before merge

# 7. Get code review and approval
# (Once approved and tests pass, you can merge)

# 8. Click "Merge pull request" in GitHub UI
# Code is now in dev branch!

# 9. Later: Promote dev → stage
git checkout -b release/v1.0 dev
git push origin release/v1.0
# Open PR: stage ← release/v1.0
# Same review + test process
# Merge to stage (deploys to staging)

# 10. Later: Promote stage → main
git checkout -b hotfix/final-release stage
git push origin hotfix/final-release
# Open PR: main ← hotfix/final-release
# Same review + test process
# Merge to main (deploys to production) 🚀
```

### Important Branch Rules

| Branch | Purpose | Deploys To | Can Come From |
|--------|---------|-----------|----------------|
| `dev` | Development | development | feature/* |
| `stage` | Staging | staging | dev |
| `main` | Production | production | stage |
| `feature/*` | Feature work | (nowhere) | dev |

---

## 🌍 Environment Structure

After setup, you'll have 3 GitHub Environments:

### development
- **Deploys from:** `dev` branch only
- **Use:** Development testing
- **Access:** All team members
- **Deploy command:** `gh deployment create development --ref dev`

### staging
- **Deploys from:** `stage` branch only
- **Use:** Pre-production testing
- **Access:** All team members
- **Deploy command:** `gh deployment create staging --ref stage`

### production
- **Deploys from:** `main` branch only
- **Use:** Live production
- **Access:** All team members (with caution!)
- **Deploy command:** `gh deployment create production --ref main`

---

## 🔧 Customization

### Changing Required Reviewers

Edit `apply-branch-protection.yml`:
```yaml
required_pull_request_reviews: {
  required_approving_review_count: 2  # Change from 1 to 2
}
```

Then run the workflow again to update.

### Changing Check Names

If you rename jobs in `ci.yml`, update `apply-branch-protection.yml`:

```yaml
env:
  CHECK_FRONTEND: my-new-frontend-name  # Update here
  CHECK_BACKEND: my-new-backend-name    # Update here
```

### Adding Custom Reviewers to Environments

Edit `apply-environments.yml`:
```yaml
reviewers: ["@org/team-devops", "@org/team-infra"]  # Add teams
```

---

## 🐛 Troubleshooting

### Problem: "GH_ADMIN_TOKEN secret not found"

**Solution:**
1. Go to **Repository Settings** → **Secrets and variables** → **Actions**
2. Verify `GH_ADMIN_TOKEN` is listed
3. If not, create it (see [Step 1](#step-1-create-gh_admin_token-secret))

### Problem: "Check 'frontend-build-test' not found"

**Solution:**
1. Run **"Discover CI Check Names"** workflow manually
2. Check the actual job names produced
3. Update `apply-branch-protection.yml` to match
4. Re-run **"Apply Branch Protection"** workflow

### Problem: "Cannot merge: required status checks have not succeeded"

**This is normal!** It means:
- Frontend or backend tests are failing
- Click on the red ❌ to see why
- Fix the issue and push new commits
- Tests will re-run automatically

### Problem: Workflow says "Branch already exists"

**This is fine!** It means:
- First time you ran the workflow, it created the branches
- Subsequent runs skip creation since they already exist
- This is normal behavior (idempotent)

### Problem: "No Maven/Gradle project found in backend"

**This means:**
- There's no `pom.xml`, `build.gradle`, `mvnw`, or `gradlew` file
- Backend job exits gracefully (no error)
- If you want backend tests:
  1. Create a Maven/Gradle project in `backend/`
  2. Commit and push
  3. CI will detect and test it automatically

### Debug Check Names

Run this manually anytime:
```bash
gh run list --repo your-owner/your-repo --limit 10
# Pick a run ID from output, then:
gh run view <RUN_ID> --repo your-owner/your-repo --json jobs --jq '.jobs[].name'
```

---

## 📚 Workflow Execution Order

### On Every Push/PR to dev/stage/main

```
1. ci.yml runs (AUTOMATIC)
   ├─ frontend-build-test (parallel)
   └─ backend-build-test (parallel)
        ↓
2. GitHub checks branch protection rules
   (set by apply-branch-protection.yml)
        ↓
3. Results shown on PR:
   ✅ CI passed
   ✅ Ready for review
        ↓
4. After code review approval:
   ✅ Can merge
        ↓
5. Code merged:
   ✅ Deployment workflow can proceed
   (if configured separately)
```

---

## 🔐 Security Features

This setup provides:

- ✅ **Code Quality**: Tests must pass before merge
- ✅ **Peer Review**: 1 approval required
- ✅ **No Bypasses**: Even admins follow rules
- ✅ **No Force Pushes**: Prevents history rewriting
- ✅ **No Branch Deletions**: Prevents accidents
- ✅ **Conversation Resolution**: Comments must be addressed
- ✅ **Safe Deployments**: Only correct branches deploy to each environment

---

## 📖 References

### GitHub Workflows Documentation
- [GitHub Actions Workflows](https://docs.github.com/en/actions/learn-github-actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments)

### CLI References
- [GitHub CLI Commands](https://cli.github.com)
- [jq Documentation](https://stedolan.github.io/jq/)
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)

---

## 📝 Workflow Files Overview

| File | Type | Trigger | Purpose |
|------|------|---------|---------|
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | CI | push, pull_request | Tests & builds |
| [.github/workflows/apply-branch-protection.yml](.github/workflows/apply-branch-protection.yml) | Setup | workflow_dispatch, push | Enforces quality gates |
| [.github/workflows/apply-environments.yml](.github/workflows/apply-environments.yml) | Setup | workflow_dispatch, push | Creates deployment channels |
| [.github/workflows/discover-check-names.yml](.github/workflows/discover-check-names.yml) | Utility | workflow_dispatch | Debug check names |

---

## ✨ Next Steps

1. ✅ Set up `GH_ADMIN_TOKEN` secret
2. ✅ Run **"Apply Branch Protection"** workflow
3. ✅ Run **"Apply Environments"** workflow
4. ✅ Create a test feature branch and verify CI runs
5. ✅ Read `.github/workflows/ci.yml` to understand check names
6. ✅ Set up your deployment workflow (not included here)

---

## 📧 Support

For issues with:
- **Workflows**: Check GitHub Actions logs
- **Branch Protection**: Verify in Settings → Branches
- **Environments**: Check Settings → Environments
- **Tests Failing**: Click on the red ❌ in PR to see details

---

**Created with ❤️ for safe deployments**
