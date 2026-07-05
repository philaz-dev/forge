#!/usr/bin/env bash
#
# Generate a Markdown PR review bundle: PR metadata, diffs, and the results of
# typecheck / lint / test. Reused by the pr-review-bundle GitHub Action and
# runnable locally via `pnpm review:bundle`.
#
# Configuration (all optional; sensible git-derived defaults are used):
#   OUTPUT     Output file path        (default: pr-review-bundle.md)
#   PR_TITLE   Pull request title      (default: latest commit subject)
#   HEAD_REF   Head branch name        (default: current branch)
#   BASE_REF   Base branch name        (default: main)
#   BASE_SHA   Explicit base commit    (default: resolved from BASE_REF)
#
# The script never aborts on a failing check: it records the result and always
# writes the bundle. It reports the overall status via the `status` GitHub
# Actions output (pass|fail) so the workflow can fail the job afterwards.

set -euo pipefail

OUTPUT="${OUTPUT:-pr-review-bundle.md}"
PR_TITLE="${PR_TITLE:-$(git log -1 --pretty=%s)}"
HEAD_REF="${HEAD_REF:-$(git rev-parse --abbrev-ref HEAD)}"
BASE_REF="${BASE_REF:-main}"
LATEST_COMMIT="$(git log -1 --pretty='%h — %s (%an, %ad)' --date=short)"

# Resolve the commit to diff against.
if [[ -n "${BASE_SHA:-}" ]]; then
  DIFF_BASE="$BASE_SHA"
elif git rev-parse --verify --quiet "origin/${BASE_REF}^{commit}" >/dev/null; then
  DIFF_BASE="origin/${BASE_REF}"
elif git rev-parse --verify --quiet "${BASE_REF}^{commit}" >/dev/null; then
  DIFF_BASE="$BASE_REF"
else
  DIFF_BASE="$(git rev-parse --verify --quiet HEAD~1 || git rev-parse HEAD)"
fi

# Only show changes introduced by this branch (compare from the merge base).
RANGE_BASE="$(git merge-base "$DIFF_BASE" HEAD 2>/dev/null || echo "$DIFF_BASE")"

# --- Run checks, capturing results without aborting ---------------------------

CHECK_LABELS=("pnpm typecheck" "pnpm lint" "pnpm test")
CHECK_COMMANDS=("pnpm typecheck" "pnpm lint" "pnpm test")
declare -a CHECK_RESULTS CHECK_LOGFILES
OVERALL="pass"

for i in "${!CHECK_LABELS[@]}"; do
  label="${CHECK_LABELS[$i]}"
  logfile="$(mktemp)"
  echo "==> ${label}" >&2
  if ${CHECK_COMMANDS[$i]} >"$logfile" 2>&1; then
    CHECK_RESULTS[$i]="pass"
  else
    CHECK_RESULTS[$i]="fail"
    OVERALL="fail"
  fi
  CHECK_LOGFILES[$i]="$logfile"
done

# --- Build the bundle ---------------------------------------------------------

status_icon() { [[ "$1" == "pass" ]] && echo "✅ pass" || echo "❌ fail"; }

{
  echo "<!-- pr-review-bundle -->"
  echo "# PR Review Bundle"
  echo
  echo "| | |"
  echo "| --- | --- |"
  echo "| **Title** | ${PR_TITLE} |"
  echo "| **Branch** | \`${HEAD_REF}\` |"
  echo "| **Base** | \`${BASE_REF}\` |"
  echo "| **Latest commit** | ${LATEST_COMMIT} |"
  echo "| **Overall checks** | $(status_icon "$OVERALL") |"
  echo

  echo "## Check results"
  echo
  echo "| Check | Result |"
  echo "| --- | --- |"
  for i in "${!CHECK_LABELS[@]}"; do
    echo "| \`${CHECK_LABELS[$i]}\` | $(status_icon "${CHECK_RESULTS[$i]}") |"
  done
  echo
  for i in "${!CHECK_LABELS[@]}"; do
    echo "<details><summary>${CHECK_LABELS[$i]} — output</summary>"
    echo
    echo '```'
    tail -n 200 "${CHECK_LOGFILES[$i]}"
    echo '```'
    echo
    echo "</details>"
    echo
  done

  echo "## Files changed (git diff --stat)"
  echo
  echo '```'
  git diff --stat "$RANGE_BASE" HEAD
  echo '```'
  echo

  echo "## Files changed (git diff --name-status)"
  echo
  echo '```'
  git diff --name-status "$RANGE_BASE" HEAD
  echo '```'
  echo

  echo "## Full diff (excluding pnpm-lock.yaml)"
  echo
  echo '```diff'
  git diff "$RANGE_BASE" HEAD -- . ':(exclude)pnpm-lock.yaml'
  echo '```'
} >"$OUTPUT"

# --- Report status ------------------------------------------------------------

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "status=${OVERALL}" >>"$GITHUB_OUTPUT"
fi

echo "Review bundle written to ${OUTPUT} (overall: ${OVERALL})." >&2
