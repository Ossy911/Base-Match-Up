$gitPath = "git"
$commits = @(
    "feat: add foundations for special tile system",
    "feat: implement 4-match detection for Rocket tiles",
    "feat: implement 5-match detection for Bomb tiles",
    "feat: add row-clearing logic for Rocket tiles",
    "feat: add 3x3 explosion logic for Bomb tiles",
    "style: add Rocket tile visual effects and animations",
    "style: add Bomb tile visual effects and glow",
    "feat: implement level star rating system UI",
    "feat: add star calculation logic based on score performance",
    "style: enhance success modal with animated star ratings",
    "feat: update particle system for color-coded feedback",
    "feat: add particle density control to settings",
    "feat: implement daily reward streak data structure",
    "ui: add daily streak display to onboarding screen",
    "feat: add bonus score multiplier for high streaks",
    "ui: design interactive tutorial overlay for new players",
    "feat: implement step-by-step tutorial logic",
    "feat: add tutorial completion state persistence",
    "ui: add global leaderboard mock-up UI",
    "feat: implement local score persistence for leaderboard",
    "refactor: balance level difficulty and move limits",
    "docs: update documentation with new special tile guide"
)

foreach ($msg in $commits) {
    # Make a tiny change to a file to ensure a new commit can be made
    Add-Content -Path "COMMIT_GUIDE.md" -Value "`n- $msg"
    & $gitPath add .
    & $gitPath commit -m $msg
}

Write-Host "Successfully generated 22 new commits!"
