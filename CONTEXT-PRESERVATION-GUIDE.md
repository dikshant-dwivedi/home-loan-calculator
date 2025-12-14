# Context Preservation Guide
## Simple Recipe for Multi-Session Development with Claude

**Version:** 2.0  
**Last Updated:** December 14, 2025  
**Purpose:** Scientific, repeatable workflow for maintaining context across Claude conversations

---

## 📖 Table of Contents

1. [Glossary - Read This First](#glossary---read-this-first)
2. [The System Overview](#the-system-overview)
3. [The 3 Core Files](#the-3-core-files)
4. [Manual Setup Steps](#manual-setup-steps)
5. [Conversation Templates](#conversation-templates)
6. [Session Workflow](#session-workflow)
7. [Common Scenarios](#common-scenarios)
8. [Maintenance Guide](#maintenance-guide)
9. [FAQ - Frequently Asked Questions](#faq---frequently-asked-questions)
10. [Quick Reference](#quick-reference)

---

## Glossary - Read This First

**This guide uses TWO core terms. That's it.**

### Core Terms

**CONVERSATION**
- A single Claude chat window
- Can contain multiple prompts and responses back-and-forth
- Ends when you close the chat or start a new one
- Claude remembers everything WITHIN a conversation
- Claude forgets everything BETWEEN conversations

**WORK SESSION**
- A focused block of work time (typically 1-2 hours)
- Has a specific goal (e.g., "implement EMI calculation")
- May use ONE or MULTIPLE conversations
- **Always ends with:** PROJECT-STATE.md update + git commit

**That's it. Two terms.**

---

### Optional: Numbering and Grouping

**You can OPTIONALLY number/group sessions. If you do, track them in PROJECT-STATE.md.**

**Option 1: Number your work sessions**
```markdown
## In PROJECT-STATE.md:
Current Work Session: 14
Goal: Implementing EMI calculation
```

**Option 2: Group into phases**
```markdown
## In PROJECT-STATE.md:
Current Phase: Phase 2 - Backend
Work Session: 8 (of this phase)
Goal: API endpoints
```

**Option 3: Just descriptive names**
```markdown
## In PROJECT-STATE.md:
Current Work: Implementing EMI calculation
```

**How Claude knows:**
- You write it in PROJECT-STATE.md after each work session
- Claude reads `@PROJECT-STATE.md` at the start of each new conversation
- That's how Claude knows you're on "Session 14" or "Phase 2"

**All valid. Same workflow. Choose what works.**

---

### The Hierarchy

```
Work Session: Implementing EMI calculation
├── Conversation 1: Set up function structure
├── Conversation 2: Debug formula issue
└── Conversation 3: Write tests
└── [End: Update PROJECT-STATE.md + Git Commit]

Work Session: API endpoints
├── Conversation 1: Create controllers
└── [End: Update PROJECT-STATE.md + Git Commit]
```

**With optional numbering/grouping:**
```
Phase 2: Calculation Engine
├── Work Session 14: EMI calculation
│   ├── Conversation 1, 2, 3...
│   └── [End: Update + Commit]
└── Work Session 15: Amortization schedule
```

**Bottom line:** Work session is the fundamental unit. Everything else is optional labeling.

---

---

## The System Overview

### The Problem
- Claude doesn't remember previous conversations
- Long conversations become expensive and less accurate
- Need to work across multiple days/weeks
- Can't maintain dozens of progress documents

### The Solution
**3 files + Windsurf rules = Automatic context in every conversation**

```
PROJECT-STATE.md        ← What's done, what's next (YOU update after sessions)
DOCUMENT-CHANGES.md     ← Spec changes (Claude updates during sessions)
.windsurfrules          ← Project rules (Set once, auto-loaded)
```

### Why This Works
- ✅ File `@mentions` load content efficiently
- ✅ Single state file = no doc explosion
- ✅ Windsurf rules auto-loaded every conversation
- ✅ Git commits = breadcrumb trail
- ✅ Takes 2-3 minutes maintenance per session

---

## The 3 Core Files

### 1. PROJECT-STATE.md (Your Single Source of Truth)

**Purpose:** Capture current state of the project

**Structure:**
```markdown
# Project State

Last Updated: [Date]
Current Phase: [Phase name]
Session: [Session number]

## What's Complete
- ✅ Item 1
- ✅ Item 2

## Current Phase: [Name]
🔄 In Progress: [What you're working on now]

## Current File State
**Backend:**
- `file.ts` - Status, what's working, what's not

**Frontend:**
- `component.tsx` - Status

## Next Actions
1. Specific next step
2. Another step

## Recent Decisions/Changes
- Date: Decision made

## Blockers/Notes
- Any issues or open questions
```

**When to Update:** After every work session (2 minutes)

**Who Updates:** You, with Claude's help at session end

---

### 2. DOCUMENT-CHANGES.md (Track Deviations)

**Purpose:** Log when you deviate from original documentation

**Structure:**
```markdown
# Documentation Changes Log

## Changes Made to Original Specifications

### [Date] - [Brief Title]
**Original:** What the doc said
**Changed to:** New specification
**Reason:** Why the change
**Files affected:** Which docs
**Implementation status:** Implemented/Pending/Planned
```

**When to Update:** Only when you modify original specs

**Who Updates:** Claude during session when you make changes

---

### 3. .windsurfrules (Project Rules)

**Purpose:** Auto-loaded context about your project standards

**Contains:**
- Project overview
- Tech stack
- Documentation structure
- Code standards
- Current phase
- What to check first

**When to Update:** Rarely (maybe when tech stack changes)

**Who Updates:** You set it once, then forget about it

---

## Manual Setup Steps

### One-Time Setup (5 minutes)

**Step 1: Rename Windsurf Rules**
```bash
cd /Users/dikshantdwivedi/development/design
mv windsurfrules.txt .windsurfrules
```

**Step 2: Verify Structure**
```
/Users/dikshantdwivedi/development/design/
├── PROJECT-STATE.md              ✓
├── DOCUMENT-CHANGES.md           ✓
├── .windsurfrules                ✓ (after rename)
└── docs/                         ✓
    └── [all documentation files]
```

**Step 3: Review Current State**
- Open `PROJECT-STATE.md`
- Confirm it reflects your actual current state
- Update if needed

**Done!** System is ready.

---

## Conversation Templates

### Template 1: Starting Any Conversation

**Use when:** Starting a new conversation (first or subsequent in your work session)

```markdown
Continuing work on [project name].

CONTEXT:
@PROJECT-STATE.md
@DOCUMENT-CHANGES.md
[Any other relevant files]

CURRENT STATUS:
As per PROJECT-STATE.md, [briefly state where you are]

GOAL FOR THIS WORK SESSION:
[Specific goal - e.g., "Implement EMI calculation" or "Refine UI docs"]

Ready to start?
```

**Examples:**

```markdown
# Example 1: Documentation work
Continuing work on loan calculator.

CONTEXT:
@PROJECT-STATE.md
@docs/04-UI-UX-SPECIFICATIONS.md

CURRENT STATUS:
Documentation refinement phase. No code yet.

GOAL FOR THIS WORK SESSION:
Add dark mode specifications to UI docs.

Ready?
```

```markdown
# Example 2: Development work
Continuing work on loan calculator.

CONTEXT:
@PROJECT-STATE.md
@docs/03-CALCULATION-FORMULAS-REFERENCE.md
@backend/src/calculation.service.ts

CURRENT STATUS:
Database setup complete. Starting calculation engine.

GOAL FOR THIS WORK SESSION:
Implement calculateEMI() function with tests.

Ready?
```

---

### Template 2: Resuming After Closing Conversation

**Use when:** You closed previous conversation mid-work session, need to continue

```markdown
Resuming work session - [feature name].

CONTEXT:
@PROJECT-STATE.md - See "Current File State"
@[relevant files]

WHERE WE LEFT OFF:
[Brief summary from PROJECT-STATE.md]

NEXT STEP:
[Specific next action]

Let's continue.
```

---

### Template 3: Work Session Wrap-Up

**Use when:** Ending any work session (MANDATORY)

**Steps:**
1. Use this template in current conversation
2. Update PROJECT-STATE.md with Claude's help
3. Git commit
4. Close conversation

```markdown
Let's wrap up this session.

CONTEXT:
@PROJECT-STATE.md

TASK:
Help me update PROJECT-STATE.md with:
1. What we completed today
2. Current file states
3. Next immediate action
4. Any decisions made

ALSO:
- Summarize for DOCUMENT-CHANGES.md if we modified specs
- Suggest good git commit message(s)

Provide the updated PROJECT-STATE.md sections.
```

---

### Template 4: Coming Back After Break

**Use when:** Starting a new WORK SESSION after days/weeks away from the project

**Template:**

```markdown
Returning to loan calculator project after a break.

CONTEXT REFRESH:
@PROJECT-STATE.md - Full review needed
@DOCUMENT-CHANGES.md - What changed?
@docs/00-README-INDEX.md - Project overview

ADDITIONAL CONTEXT:
Recent git commits:
```
[Paste output of: git log --oneline -10]
```

TASK:
Give me a summary:
1. What's fully working?
2. What was in progress?
3. What's the next logical step?
4. Any noted blockers?

Then recommend: continue where left off, or something else?
```

---

## Session Workflow

**CRITICAL: This is your step-by-step formula. Follow it exactly every time.**

---

### Starting a Work Session (Every Time)

**Step 1: Review Current State (1 minute)**
```bash
# Action: Open and read PROJECT-STATE.md
# Read these sections:
# - "What's Complete"
# - "Next Actions"  
# - "Current File State"
# - "Blockers/Notes"
```

**Step 2: Start First Conversation**
- Choose appropriate template from section 5
- Copy template and customize
- Include `@PROJECT-STATE.md` (mandatory)
- Include `@` mentions of files you'll work with
- Paste in new Claude conversation

**Step 3: Work Incrementally**
- Make changes/additions
- Test after each change
- Keep conversation focused

---

### During the Work Session

**SCENARIO A: Continuing in Same Conversation**

Just continue with natural prompts - Claude remembers everything:

```markdown
Good! Now let's [next specific thing].

@[any new file you need to reference]

[Your specific request]
```

**No special template needed - it's the same conversation.**

---

**SCENARIO B: Need New Conversation (Same Work Session)**

**Why you might need this:**
- Conversation got too long (performance degrading)
- Claude lost context or made errors
- Want to start fresh on next sub-task

**Steps:**

1. **Update PROJECT-STATE.md in current conversation:**
```markdown
Before we close, help me update PROJECT-STATE.md with current progress.

## Current File State
What's the exact state of files we worked on?
What's working, what's not, what's next?
```

2. **Copy Claude's suggestions, paste into PROJECT-STATE.md**

3. **Start new conversation with Template 4:**
```markdown
Resuming Development Session [X] - [feature name].

@PROJECT-STATE.md - See "Current File State"
@[relevant files]

Continuing where we left off...
```

**Important:** You do NOT git commit yet - work session isn't done!

---

### Ending the Work Session (Mandatory)

**This is REQUIRED at the end of every work session. No exceptions.**

**Step 1: Use Template 7 (Wrap-Up) in Current Conversation**
```markdown
Let's wrap up this work session.

@PROJECT-STATE.md

Help me update PROJECT-STATE.md with:
1. What we completed today
2. Current file states
3. Next immediate action
4. Any decisions made

Also suggest git commit message(s).
```

**Step 2: Update PROJECT-STATE.md**
- Claude provides updated sections
- You review
- You copy-paste into PROJECT-STATE.md
- Save the file

**Step 3: Git Commit (Mandatory)**
```bash
# Add all changes
git add .

# Commit with Claude's suggested message
git commit -m "feat(backend): add EMI calculation with tests"

# If you made multiple features, multiple commits:
git add backend/src/calculation.service.ts backend/src/calculation.service.spec.ts
git commit -m "feat(backend): add EMI calculation function"

git add backend/src/loan.controller.ts
git commit -m "feat(api): add POST /calculate endpoint"
```

**Step 4: Verify**
```bash
# Check git status is clean
git status

# Verify PROJECT-STATE.md was updated
# Should have today's date in "Last Updated"
```

**Step 5: Close Conversation**
- Now you can close Claude conversation
- Work session is complete

---

### The Mathematical Formula

```
WORK SESSION = 
  1. Read PROJECT-STATE.md
  2. Start Conversation (with template + @PROJECT-STATE.md)
  3. Work (using 1 or more conversations)
  4. Wrap-Up (Template 7)
  5. Update PROJECT-STATE.md
  6. Git Commit
  7. Close

IF (need new conversation mid-session):
  → Quick update to PROJECT-STATE.md
  → New conversation with Template 4
  → Continue working
  → Still end with full wrap-up (steps 4-7)

EVERY work session MUST end with steps 4-7.
NO EXCEPTIONS.
```

---

## FAQ - Frequently Asked Questions

### Q0: Should I number my work sessions or group them into phases?

**Answer:**

**OPTIONAL. Use only if it helps you.**

**Numbering work sessions:**
```markdown
Work Session 1: Setup
Work Session 2: Database
Work Session 14: EMI calculation
```

**Benefits:** Track progress, see how many sessions completed, motivation  
**Use if:** Large project, want to see velocity

**Grouping into phases:**
```markdown
Phase 1: Backend (Sessions 1-8)
Phase 2: Frontend (Sessions 9-15)
```

**Benefits:** High-level milestones  
**Use if:** Very large project, want to see big-picture progress

**Or just use descriptive names:**
```markdown
Work session - implementing EMI calculation
Work session - bug fix
Work session - adding charts
```

**Benefits:** Maximum flexibility, no overhead  
**Use if:** Small project, exploratory work, maintenance

**All three are valid. Choose what helps you. The workflow is identical.**

---

### Q1: Why does "Full Session Flow" look different from the templates?

**Answer:**

**Templates (Section 5)** = What to paste into Claude conversations  
**Full Session Flow (Section 6)** = The complete process from start to finish

**Think of it this way:**
- Templates are the **recipes** (specific prompts to copy)
- Session Flow is the **cookbook structure** (how to use recipes in order)

**Example Flow:**
1. Read PROJECT-STATE.md ← Not a template, just an action
2. Use Template 3 to start conversation ← Use the template
3. Work and make follow-up prompts ← Natural conversation
4. Use Template 7 to wrap up ← Use the template
5. Update PROJECT-STATE.md ← Action after conversation
6. Git commit ← Action after conversation

**Templates are inputs to conversations. Flow is the entire work process.**

---

### Q2: What if I forget to wrap up a work session?

**Answer:**

**SCENARIO: You closed conversation without wrapping up, or computer crashed, or you just left.**

**Recovery Process:**

1. **Don't panic** - Your git history shows your last commit state

2. **Check git status:**
```bash
git status
git log --oneline -5
```

3. **Manually update PROJECT-STATE.md:**
   - Look at files you changed (git status)
   - Look at what you committed (git log)
   - Update PROJECT-STATE.md sections yourself:
     - Move completed items to "What's Complete"
     - Update "Current File State" with what you remember
     - Set "Next Actions" to what you think is next
   - Add note: "Session ended abruptly - manual reconstruction"

4. **If uncommitted changes exist:**
```bash
# Option A: Changes are good, commit them
git add .
git commit -m "feat: [describe what you did]"

# Option B: Changes are incomplete/broken, stash them
git stash save "incomplete work from interrupted session"
# You can recover later with: git stash pop

# Option C: Discard bad changes
git reset --hard HEAD
```

5. **Next session:**
   - Start with Template 8 (Coming Back After Break)
   - Mention the interruption in your prompt:
   ```markdown
   @PROJECT-STATE.md
   
   Note: Previous session ended without proper wrap-up.
   Manually updated PROJECT-STATE.md based on git history.
   
   Let's verify current state and proceed.
   ```

**Prevention:**
- Set a reminder to wrap up before closing
- Use Template 7 as checklist before ending
- Make it a habit: "Wrap up → Update → Commit → Close"

---

### Q3: Can I make multiple git commits in one work session?

**Answer:**

**YES! Absolutely recommended!**

**The Rule:**
- **One WORK SESSION** = Can have **multiple git commits**
- **One git commit** = One logical, working feature

**Example Work Session with 3 Commits:**

**Development Session 14 - Calculation Engine**

*First part of session:*
```bash
# Implement and test calculateEMI()
git add backend/src/calculation.service.ts backend/src/calculation.service.spec.ts
git commit -m "feat(backend): add calculateEMI function with tests"
```

*Continue in same session/conversation:*
```bash
# Add validation
git add backend/src/calculation.service.ts backend/src/dto/
git commit -m "feat(backend): add input validation for loan parameters"
```

*Still same session:*
```bash
# Add helper function
git add backend/src/calculation.service.ts
git commit -m "refactor(backend): extract monthly rate calculation to helper"
```

**At end of work session:**
```markdown
# Use Template 7
Let's wrap up this work session.

@PROJECT-STATE.md

We made 3 commits today:
1. calculateEMI function
2. Input validation
3. Helper function refactor

Update PROJECT-STATE.md accordingly.
```

**Benefits:**
- ✅ Each commit is a working checkpoint
- ✅ Easy to revert specific changes
- ✅ Clear history of progress
- ✅ Can review each piece separately

**When to commit:**
- After each feature/function works and tests pass
- After fixing a bug
- After refactoring that doesn't break tests
- Before trying something risky (checkpoint)

**PROJECT-STATE.md still gets updated ONCE at end of work session** (even with multiple commits).

---

### Q4: How do I undo a git commit?

**Answer:**

**Depends on what you want to undo:**

**SCENARIO A: Just committed, haven't pushed, want to modify it**
```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Now your changes are staged, you can modify and recommit
# Edit files...
git add .
git commit -m "feat(backend): corrected commit message"
```

**SCENARIO B: Just committed, want to completely undo it**
```bash
# Undo commit and discard all changes (DANGEROUS!)
git reset --hard HEAD~1

# Everything from that commit is gone
```

**SCENARIO C: Committed but made a mistake, want to add more to it**
```bash
# Make the additional changes
# Edit files...

# Add to previous commit
git add .
git commit --amend

# This modifies the last commit
```

**SCENARIO D: Already pushed to GitHub, need to undo**
```bash
# Create a new commit that undoes the previous one
git revert HEAD

# This is safe for pushed commits
# Creates a new commit that reverses the changes
```

**SCENARIO E: Need to undo multiple commits**
```bash
# Undo last 3 commits but keep changes
git reset --soft HEAD~3

# Undo last 3 commits and discard changes (DANGEROUS!)
git reset --hard HEAD~3
```

**After undoing:**

1. **Update PROJECT-STATE.md** if needed:
   - If you removed completed work, move it back to "In Progress"
   - Update "Current File State"

2. **In next conversation**, mention what you did:
```markdown
@PROJECT-STATE.md

Note: Reverted previous commit due to [reason].
Current state is [describe state].

Continuing with [next step].
```

**Safety Tips:**
- ✅ Only use `--hard` if you're absolutely sure
- ✅ Before `reset --hard`, consider: `git stash` instead
- ✅ Never force push after resetting if others use the repo
- ✅ Use `git reflog` if you accidentally deleted something (advanced recovery)

**Prevention:**
- Test before committing
- Review changes: `git diff --staged`
- Use descriptive commit messages

---

### Q5: What if Claude suggests something that conflicts with documentation?

**Answer:**

**The Documentation is Law. Always.**

**If Claude suggests something different from docs:**

**Your Response:**
```markdown
Wait - the documentation says [X].

@docs/[relevant-doc].md - Section [Y]

You're suggesting [Z] which is different.

Can you explain:
1. Why the difference?
2. Is this better than the documented approach?
3. What are the tradeoffs?

If this is indeed better, we need to:
- Log it in DOCUMENT-CHANGES.md
- Update the relevant documentation
- Get my approval before proceeding
```

**Claude will then:**
- Either correct itself to match docs
- Or explain why the suggestion is better and ask for approval

**If you approve the deviation:**
```markdown
Approved. Let's:
1. Implement your suggested approach
2. Update DOCUMENT-CHANGES.md with this change
3. Update PROJECT-STATE.md to note the decision
```

**Never let Claude deviate from specs without:**
- ✅ Explicit explanation
- ✅ Your approval
- ✅ Logging in DOCUMENT-CHANGES.md
- ✅ Understanding the impact

---

### Q6: How detailed should "Current File State" be in PROJECT-STATE.md?

**Answer:**

**Level of Detail: Function/Feature level, not line-by-line**

**❌ TOO DETAILED (Don't do this):**
```markdown
## Current File State
**Backend:**
- `calculation.service.ts`
  - Line 15-30: calculateEMI() function defined
  - Line 32: Imports Decimal
  - Line 45: Monthly rate calculation
  - Line 50: EMI formula applied
  - Line 55-60: Rounding logic
```

**✅ RIGHT LEVEL (Do this):**
```markdown
## Current File State
**Backend:**
- `calculation.service.ts` - EMI calculation service
  - ✅ Working: calculateEMI() with tests passing
  - ✅ Working: Input validation
  - 🔄 In progress: generateAmortizationSchedule() - 60% done
    - Working: Creates array, calculates interest/principal per month
    - NOT working: Closing balance off by ₹2 (rounding issue)
    - Next: Fix rounding in final month calculation
  - ❌ Not started: Prepayment calculation functions

**Frontend:**
- `LoanForm.tsx` - Input form component
  - ✅ Working: Basic form with principal, rate, tenure inputs
  - ✅ Working: Validation with Zod
  - 🔄 In progress: Indian number formatting
  - ❌ Not started: Date picker for start date
```

**Guidelines:**
- **Completed items:** Brief description
- **In-progress items:** What works, what doesn't, what's next
- **File-level granularity:** Not line-level
- **Specific enough** for Claude to pick up where you left off
- **Specific enough** for you to remember after a week

**Think:** "If I come back in a week, what do I need to know?"

---

### Q7: Should I update PROJECT-STATE.md during the work session or only at the end?

**Answer:**

**It depends on the scenario:**

**NORMAL CASE: Update only at end**
- Working in one conversation
- Things going smoothly
- Update using Template 7 when wrapping up

**EXCEPTION: Update mid-session IF:**
- **You need to start a new conversation** (current one too long/broken)
  - Quick update with current progress
  - Use Template 4 for new conversation
  - Still do full update at final wrap-up

- **You're about to try something risky** (might break things)
  - Update PROJECT-STATE.md with current working state
  - Git commit (checkpoint)
  - Then experiment

- **You hit a blocker and need to stop** (can't continue today)
  - Update with current state and blocker details
  - Git commit or stash
  - Next session will know exactly where you were

**Rule of Thumb:**
```
Update PROJECT-STATE.md whenever you're creating a "checkpoint"
(new conversation, git commit, or stopping point)
```

**Minimum:** Once at end of work session (mandatory)  
**Maximum:** Every time you switch context or create checkpoint  

---

### Q8: What should I call my work sessions in prompts?

**Answer:**

**Any of these are fine:**

```markdown
Work Session 14 - EMI calculation
Session 14 - EMI calculation
Work session - implementing EMI calculation
Implementing EMI calculation work session
```

**DON'T say:**
- ❌ "Conversation 14" (conversations are Claude chats, not work sessions)

**Just be consistent within your project. The name doesn't matter - the workflow does.**

---

### Q9: Can I work on multiple features in one work session?

**Answer:**

**Technically yes, but NOT recommended.**

**The Problem:**
- Context mixing
- Harder to track progress
- Messy git history
- Difficult to debug if something breaks

**Better Approach:**

**One work session = One focused goal**

**❌ Bad - Multiple Goals:**
```markdown
Work Session Today:
- Implement EMI calculation
- Add user authentication
- Create chart components
- Fix deployment bug
```

**✅ Good - Single Focus:**
```markdown
Development Session 14:
Goal: Implement and test EMI calculation function
- calculateEMI() function
- Unit tests
- Integration with API endpoint
```

**If you finish early:**
```markdown
# Completed calculateEMI()
# Wrap up this session:
git commit -m "feat: add EMI calculation"
# Update PROJECT-STATE.md

# Start NEW session:
Development Session 15:
Goal: Implement amortization schedule generation
```

**Exception - Related Sub-features:**

**✅ OK - Multiple sub-tasks of same feature:**
```markdown
Development Session 14: EMI Calculation
- calculateEMI() function
- Input validation for loan parameters
- Helper functions for rate conversion
- All tests for above

# These are all part of "EMI calculation feature"
# Can be 3 separate commits in same session
```

**Rule:** Ask yourself: "Is this one logical feature or multiple separate features?"

---

### Q10: What if I realize mid-session that my approach is wrong?

**Answer:**

**STOP. Don't continue down wrong path.**

**Immediate Actions:**

**1. Assess the situation:**
```markdown
Pause - I think this approach might be wrong.

@docs/[relevant-spec].md

Current approach: [what you're doing]
Problem: [what's wrong with it]
Alternative: [what might be better]

Should we:
A) Continue current approach
B) Switch to alternative
C) Review documentation again
```

**2. If switching approaches:**

**Option A: Haven't committed yet (easy)**
```bash
# Discard current changes
git status
git restore .  # or git reset --hard

# Or stash if you want to keep for reference
git stash save "wrong approach - may revisit"
```

**Option B: Already committed (still easy)**
```bash
# Undo commit but keep changes to review
git reset --soft HEAD~1

# Or completely remove
git reset --hard HEAD~1
```

**3. Update PROJECT-STATE.md:**
```markdown
## Recent Decisions/Changes
- Dec 14: Tried [wrong approach], realized issue: [problem]
- Dec 14: Switched to [correct approach] based on [reason]

## Current File State
- Reverted previous changes
- Starting fresh with [new approach]
```

**4. Continue or wrap up:**
```markdown
# If you have time/energy:
Let's implement the correct approach...

# If you're exhausted/frustrated:
Let's wrap up. We learned [wrong approach] doesn't work.
Next session will start with [correct approach].
```

**5. Git commit the learning:**
```bash
# Even if you reverted, commit the updated PROJECT-STATE.md
git add PROJECT-STATE.md
git commit -m "docs: document decision to change approach for EMI calc"
```

**Remember:** Trying wrong approach is NOT failure - it's learning. Document it so you don't repeat it.

---

## Common Scenarios

### Scenario A: Refining Multiple Documents (Multiple Prompts)

**First Prompt:**
```markdown
Documentation refinement session.

@PROJECT-STATE.md
@DOCUMENT-CHANGES.md
@docs/04-UI-UX-SPECIFICATIONS.md

Add dark mode specifications to UI doc.
Show me proposed additions.
```

**Follow-Up Prompts (Same Conversation):**
```markdown
Good! Now refine API docs.

@docs/05-API-DOCUMENTATION.md

Add detailed rate limiting section.
```

**Another Follow-Up:**
```markdown
One more change - prepayment validation rules.

@docs/01-PRODUCT-REQUIREMENTS.md - Section 2.2.3

Make validation rules stricter: [your requirements]
```

**Wrap Up:**
```markdown
Let's wrap up.
@PROJECT-STATE.md

Update with what we refined today.
```

---

### Scenario B: Building a Feature (Multiple Sessions)

**Session 1 - Start Feature:**
```markdown
Starting Session 14 - EMI calculation.

@PROJECT-STATE.md
@docs/03-CALCULATION-FORMULAS-REFERENCE.md - Section 2
@docs/09-IMPLEMENTATION-STRATEGY-WITH-CLAUDE.md - Session 14

Implement calculateEMI() function.
[Specific requirements]
```

**Work... test... works! Update PROJECT-STATE.md:**
```markdown
## What's Complete
- ✅ EMI calculation function (calculateEMI) - TESTED ✓

## Next Actions
1. Session 15: Implement generateAmortizationSchedule()
```

**Session 2 - Continue Feature:**
```markdown
Continuing development - Session 15.

@PROJECT-STATE.md
@docs/03-CALCULATION-FORMULAS-REFERENCE.md - Section 3
@backend/src/loan/services/calculation.service.ts

From PROJECT-STATE.md: calculateEMI() is done.
Now implement generateAmortizationSchedule().
```

---

### Scenario C: Hit a Bug Mid-Development

**You're in Session 15, something breaks:**

**In SAME conversation:**
```markdown
I'm getting an error in generateAmortizationSchedule():

Error:
```
TypeError: Cannot read property 'toNumber' of undefined
```

Expected: Generate 240 month schedule
Actual: Error on month 3

Code: calculation.service.ts lines 45-60

Let's debug this.
```

**If you need NEW conversation for debugging:**

**Update PROJECT-STATE.md:**
```markdown
## Blockers/Notes
- Bug in generateAmortizationSchedule(): undefined error on month 3
- Location: calculation.service.ts line 52
- Happens after 3rd iteration
```

**New conversation:**
```markdown
Debugging session - amortization calculation.

@PROJECT-STATE.md - See "Blockers/Notes"
@backend/src/loan/services/calculation.service.ts
@backend/src/loan/services/calculation.service.spec.ts

Issue described in PROJECT-STATE.md.
Let's debug step by step.
```

---

### Scenario D: Decide to Change Design

**You're implementing something, realize spec should change:**

**In current conversation:**
```markdown
I want to modify the API design.

@PROJECT-STATE.md
@DOCUMENT-CHANGES.md
@docs/05-API-DOCUMENTATION.md
@backend/src/scenarios/scenarios.controller.ts

CHANGE:
Original: POST /api/v1/scenarios
Change to: POST /api/v1/scenarios/save

Reason: Clearer intent, matches frontend expectations

Check PROJECT-STATE.md: is this endpoint implemented?
If yes, update code. If no, just update docs.
Log in DOCUMENT-CHANGES.md.
```

---

## Maintenance Guide

### After Every Session (2-3 minutes)

**1. Update PROJECT-STATE.md (with Claude's help)**
```markdown
# Use Template 7 at end of session
# Claude suggests updates
# You approve
```

**Updates typically:**
- Move items from "In Progress" to "Complete"
- Update "Current File State" with specifics
- Update "Next Actions" with next step
- Add decisions to "Recent Decisions"
- Add blockers if any

**2. Git Commit**
```bash
git add .
git commit -m "[Claude suggested message]"
```

**3. Done!**

---

### Rarely (Only When Needed)

**Update DOCUMENT-CHANGES.md:**
- Only when you deviate from original specs
- Claude does this during session
- Review and approve

**Update .windsurfrules:**
- Only if tech stack fundamentally changes
- Or if project phase shifts permanently
- Maybe once every few weeks, if at all

---

## Quick Reference

### Starting Any Conversation

```markdown
[Context type] for loan calculator.

@PROJECT-STATE.md
@DOCUMENT-CHANGES.md
[Other @file mentions]

TASK: [Specific goal]

[Details]

Ready?
```

### Follow-Up in Same Conversation

```markdown
Good! Now [next thing].

@[new file if needed]

[Specific request]
```

### Ending Any Session

```markdown
Let's wrap up.

@PROJECT-STATE.md

Help me update with today's progress.
```

### Essential @Mentions

Always include:
- `@PROJECT-STATE.md` - Where you are
- `@DOCUMENT-CHANGES.md` - Spec changes (if relevant)

Add as needed:
- `@docs/[specific-doc].md` - Relevant documentation
- `@backend/src/[file].ts` - Code you're working on
- `@frontend/components/[file].tsx` - Frontend code

---

## File Update Frequency

| File | When to Update | Who | Time |
|------|---------------|-----|------|
| **PROJECT-STATE.md** | After every session | You + Claude | 2 min |
| **DOCUMENT-CHANGES.md** | When specs change | Claude | Auto |
| **.windsurfrules** | Almost never | You | N/A |
| **docs/*.md** | When refining/changing | Claude | Auto |
| **Code files** | When implementing | Claude | Auto |

---

## Best Practices

### ✅ DO:
- Start every conversation with `@PROJECT-STATE.md`
- Use file `@mentions` liberally
- Update PROJECT-STATE.md after EVERY session (2 min)
- Keep PROJECT-STATE.md concise and actionable
- Commit after each working feature
- Use specific, focused prompts

### ❌ DON'T:
- Skip updating PROJECT-STATE.md (you'll lose context)
- Write long context summaries (use @file instead)
- Update .windsurfrules constantly (set and forget)
- Create new progress files (use PROJECT-STATE.md)
- Work on multiple features without committing

---

## Troubleshooting

### "Claude doesn't have context"
**Fix:** Did you include `@PROJECT-STATE.md` in your prompt?

### "Claude suggests wrong approach"
**Fix:** Reference specific documentation: `@docs/02-TECHNICAL-SPECIFICATION.md section 4.2`

### "Lost track of where I was"
**Fix:** Read PROJECT-STATE.md. If not updated, check `git log --oneline -10`

### "Too much maintenance overhead"
**Fix:** You should only update PROJECT-STATE.md (2 min/session). If doing more, you're over-documenting.

### "Context files getting huge"
**Fix:** PROJECT-STATE.md should stay focused on current state. Archive old decisions. Keep it under 200 lines.

---

## Example: Full Session Flow

**Starting (1 min):**
```markdown
Session 14 - EMI calculation.

@PROJECT-STATE.md
@docs/03-CALCULATION-FORMULAS-REFERENCE.md

Implement calculateEMI() per docs section 2.1.
```

**Working (60-90 min):**
- Claude implements
- You test
- Iterate
- Tests pass ✓

**Wrapping (2 min):**
```markdown
Let's wrap up.

@PROJECT-STATE.md

Update with:
- EMI calculation complete and tested
- Next: Session 15 amortization schedule

Suggest commit message.
```

**Commit:**
```bash
git commit -m "feat(backend): add EMI calculation with tests"
```

**Next Session (1 min):**
```markdown
Session 15 - amortization schedule.

@PROJECT-STATE.md
@docs/03-CALCULATION-FORMULAS-REFERENCE.md

Per PROJECT-STATE.md, EMI calc done.
Now implement generateAmortizationSchedule().
```

**That's it!** Rinse and repeat.

---

## Summary

**The System:**
- 3 files (PROJECT-STATE.md, DOCUMENT-CHANGES.md, .windsurfrules)
- File @mentions for context
- 2-3 minutes maintenance per session

**The Workflow:**
1. Start conversation with template + @mentions
2. Work incrementally
3. Wrap up with PROJECT-STATE.md update
4. Commit

**The Result:**
- Context preserved across conversations
- No document explosion
- Cost-efficient (short, focused conversations)
- Can leave and return anytime
- Git history as backup

---

**Save this file and reference it whenever you work on the project!** 🎯

---

**Quick Start Checklist:**
- [ ] .windsurfrules renamed (one-time)
- [ ] PROJECT-STATE.md reflects current state
- [ ] Bookmark this file for reference
- [ ] Start next conversation with Template 1 or 2

**You're ready!**
