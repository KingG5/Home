# Autonomous Agent Guide

## 🤖 How to Work with Claude Code Agents

This guide explains how to effectively use autonomous agents to build features for your Blind Test Bar App.

---

## 📋 Table of Contents

1. [Agent Types](#agent-types)
2. [When to Use Agents](#when-to-use-agents)
3. [Parallel vs Sequential](#parallel-vs-sequential)
4. [Example Requests](#example-requests)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

---

## Agent Types

### 1. **General-Purpose Agent**
**Best For:** Complex multi-step implementations
**Use When:** Building complete features end-to-end

**Example:**
```
"Add a user profile system with avatars, bio, and stats"
```

### 2. **Explore Agent**
**Best For:** Understanding existing code
**Use When:** You need to understand how something works

**Example:**
```
"Explore how the scoring system calculates points and
explain how to add bonus multipliers"
```

### 3. **Plan Agent**
**Best For:** Architecture and design decisions
**Use When:** You need to plan before implementing

**Example:**
```
"Plan how to implement a tournament bracket system
with semi-finals and finals"
```

---

## When to Use Agents

### ✅ DO Use Agents For:

- **New features** - Adding complete functionality
- **Research** - Understanding existing code patterns
- **Refactoring** - Improving code structure
- **Documentation** - Writing guides and docs
- **Testing** - Adding test suites
- **Integration** - Connecting external services

### ❌ DON'T Use Agents For:

- **Simple edits** - Changing a few lines
- **Quick fixes** - Obvious bug fixes
- **File reading** - Just viewing code
- **Questions** - Simple clarifications

---

## Parallel vs Sequential

### ✅ Safe for Parallel Execution

**Independent features in different domains:**

```
Request: "Add these features in parallel:
1. Player achievement badges (Domain 1, 5)
2. Sound effects for all interfaces (Domain 5, 6, 7)
3. CSV export for game results (Domain 2, 4)
4. Dark mode toggle (Domain 5, 6, 7)"
```

**Why it works:**
- Different files
- Different domains
- No shared dependencies
- Can merge without conflicts

---

### ⚠️ Requires Sequential Execution

**Features with dependencies:**

```
Request: "Add team mode:
Step 1: Create Team and TeamMember models
Step 2: Add team service and API endpoints
Step 3: Build team creation UI
Step 4: Update game logic for team play"
```

**Why sequential:**
- Each step depends on previous
- Models → Services → API → UI flow
- Cannot parallelize dependencies

---

## Example Requests

### Example 1: Single Feature (One Agent)

```
"Add a player statistics dashboard that shows:
- Total games played
- Win/loss ratio
- Average score
- Favorite music genres
- Performance over time graph

Include backend API, database changes, and frontend UI."
```

**Agent will:**
1. Add Stats model (Domain 1)
2. Add statsService.ts (Domain 2)
3. Add stats API endpoints (Domain 4)
4. Create StatsScreen.tsx (Domain 5)

---

### Example 2: Multiple Independent Features (Parallel)

```
"I want to enhance the app with these features.
Work on them in parallel:

1. Add achievement system
   - Bronze/Silver/Gold badges
   - Unlock conditions
   - Display in player profile

2. Add sound effects
   - Correct answer sound
   - Wrong answer sound
   - Timer warning sound
   - Victory fanfare

3. Add social sharing
   - Share score to Twitter
   - Share score to Facebook
   - Generate shareable image

Please use 3 separate agents."
```

**Result:** 3 agents work simultaneously, faster completion

---

### Example 3: Complex Feature (Plan First)

```
"I want to add a tournament system where:
- Multiple games compete
- Bracket-style elimination
- Semi-finals and finals
- Prize tracking

First use the Plan agent to design the architecture,
then implement it."
```

**Process:**
1. Plan Agent → Creates design document
2. You review and approve
3. Implementation Agent → Builds it

---

### Example 4: Research + Implement

```
"Explore how authentication currently works, then add
social login (Google and Facebook OAuth)"
```

**Process:**
1. Explore Agent → Analyzes auth code
2. Reports findings
3. General Agent → Implements OAuth

---

## Best Practices

### 1. **Be Specific**

❌ Bad: "Make the app better"
✅ Good: "Add a leaderboard history page showing past top 10 for each game"

### 2. **Specify Parallel When Needed**

❌ Missing: "Add profiles, achievements, and stats"
✅ Better: "Add these in parallel: profiles, achievements, stats"

### 3. **Mention Dependencies**

❌ Unclear: "Add teams and team scores"
✅ Clear: "Add teams first (models + API), then update scoring logic"

### 4. **Provide Context**

❌ Vague: "Add filtering"
✅ Specific: "Add filtering to question list in DJ panel by category and difficulty"

### 5. **Request Planning for Complex Tasks**

❌ Jump in: "Add multiplayer mode"
✅ Plan first: "Plan how to implement multiplayer mode, then build it"

---

## Common Patterns

### Pattern 1: Full-Stack Feature

**Template:**
```
"Add [FEATURE NAME] with:
- Database model in Domain 1
- Service layer in Domain 2
- API endpoints in Domain 4
- UI in Domain [5/6/7]"
```

**Example:**
```
"Add player notes feature where players can save notes about songs:
- Note model (user_id, game_id, question_id, note_text)
- noteService.ts for CRUD operations
- API endpoints for creating/reading/updating/deleting notes
- Notes tab in player game history screen"
```

---

### Pattern 2: UI Enhancement

**Template:**
```
"Enhance [INTERFACE] with [IMPROVEMENTS]"
```

**Example:**
```
"Enhance the display screen with:
- Animated transitions between questions
- Confetti effect for winners
- Smooth leaderboard position changes
- Background video support"
```

---

### Pattern 3: Integration

**Template:**
```
"Integrate [EXTERNAL SERVICE] for [PURPOSE]"
```

**Example:**
```
"Integrate Twilio SMS API to:
- Send game codes via text
- Notify players when game starts
- Send winner notifications"
```

---

### Pattern 4: Refactoring

**Template:**
```
"Explore [AREA], then refactor to [IMPROVEMENT]"
```

**Example:**
```
"Explore the socket event handlers, then refactor to:
- Use TypeScript strict types
- Add error handling
- Improve event naming consistency
- Add reconnection logic"
```

---

## Domain-Specific Requests

### For Data Layer (Domain 1)

```
"Add these database models:
- UserProfile (avatar, bio, favorite_genres)
- Achievement (name, description, icon, unlock_condition)
- GameHistory (extended stats, recording)"
```

### For Business Logic (Domain 2)

```
"Create these services:
- achievementService.ts (check and award achievements)
- statsService.ts (calculate player statistics)
- playlistService.ts (manage DJ playlists)"
```

### For Real-Time (Domain 3)

```
"Add real-time features:
- Chat system with socket events
- Live reactions (thumbs up, fire, etc.)
- Spectator mode with view-only access"
```

### For API Layer (Domain 4)

```
"Add REST API endpoints:
- GET/POST /api/achievements
- GET /api/stats/:userId
- POST /api/export/game/:gameId/csv"
```

### For Player UI (Domain 5)

```
"Add player screens:
- ProfileScreen.tsx (edit profile, view stats)
- HistoryScreen.tsx (past games, performance)
- AchievementsScreen.tsx (badge collection)"
```

### For DJ Panel (Domain 6)

```
"Add DJ features:
- PlaylistManager.tsx (import Spotify playlists)
- QuestionBuilder.tsx (custom question templates)
- AnalyticsDashboard.tsx (game insights)"
```

### For Display Screen (Domain 7)

```
"Add display enhancements:
- Custom themes (choose colors, fonts)
- Animated transitions
- Sponsor ad rotation"
```

---

## Real-World Scenarios

### Scenario A: Weekend Sprint

**Goal:** Add 3 features before your bar's Friday event

**Request:**
```
"I need these done by Friday. Work in parallel:

Agent 1: Add sound effects
- Success/failure sounds for players
- Timer warning beep
- Game start/end sounds

Agent 2: Add dark mode
- Toggle in player settings
- Dark theme for all 3 interfaces
- Save preference to local storage

Agent 3: Add game templates
- Pre-built question sets (80s Rock, 90s Pop, etc.)
- DJ can select template when creating game
- 20 questions per template"
```

---

### Scenario B: Feature Request from Bar Owner

**Goal:** Owner wants player engagement features

**Request:**
```
"The bar owner wants to increase player retention.
Add an achievement and profile system:

1. First, plan the achievement system:
   - What achievements to include
   - How to track progress
   - Database schema needed

2. Then implement in parallel:
   - Agent A: Backend (models, services, API)
   - Agent B: Player profile UI
   - Agent C: Achievement display and notifications"
```

---

### Scenario C: Bug Fix + Enhancement

**Goal:** Fix issue and prevent future occurrences

**Request:**
```
"Players report losing connection during games.

1. Explore agent: Investigate socket connection handling
2. General agent: Fix the disconnect issue
3. General agent: Add connection status indicator to UI
4. General agent: Implement auto-reconnect with state recovery"
```

---

## Tips for Success

### 1. Start Small
Begin with one agent, one feature. Get comfortable before running parallel agents.

### 2. Review Plans
When using Plan agent, review the plan before implementation.

### 3. Test Between Features
Test each agent's work before starting the next feature.

### 4. Document Decisions
Keep track of what agents built and why.

### 5. Communicate Clearly
The more specific your request, the better the result.

---

## Quick Reference

| Task Type | Agent Type | Parallel? | Example |
|-----------|-----------|-----------|---------|
| New feature | General | ✅ If independent | Add profiles |
| Understand code | Explore | ✅ Always | How does auth work? |
| Plan architecture | Plan | ✅ Always | Design tournament system |
| Multiple features | Multiple General | ✅ If independent | Add 3 UI screens |
| Sequential feature | General | ❌ No | Team mode (step by step) |
| Refactoring | Explore + General | ⚠️ Usually no | Refactor socket code |

---

## Need Help?

**To request agent work, simply say:**

```
"[Your feature request]"
```

**For parallel work:**
```
"Add these in parallel: [feature 1], [feature 2], [feature 3]"
```

**For planning:**
```
"Plan how to implement [feature], then build it"
```

**For research:**
```
"Explore [area of code] and explain [what you want to understand]"
```

---

## Next Steps

1. Open [PROJECT_DASHBOARD.html](PROJECT_DASHBOARD.html) to visualize domains
2. Choose a feature from Phase 2 in the roadmap
3. Request agent work using examples from this guide
4. Watch agents work autonomously!

Happy building! 🚀
