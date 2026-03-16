# PrepSync
## Product Requirements Document — v4.0 (Final)

**Status:** Active  
**Team:** 2-person student team  
**Stack:** Full-stack TypeScript · WebRTC · LiveKit · CRDT · AI Evaluation Pipeline  
**Cost to ship:** ₹0  
**Last updated:** March 2026

---

> **PrepSync is a real-time technical interview simulation platform — AI plays the interviewer, peers practice together, a community learns in the open, and the system tracks your readiness like a personal coach.**

This is not a LeetCode clone. Not a video calling tool. Not a chatbot wrapper. Not another Discord.  
It is the closest thing to a real placement interview a student can get without sitting in one — wrapped inside a community that keeps them accountable every day.

---

## Table of Contents

1. [Problem](#1-problem)
2. [What PrepSync is](#2-what-prepsync-is)
3. [Users](#3-users)
4. [Product philosophy](#4-product-philosophy)
5. [UI/UX Design System](#5-uiux-design-system)
6. [Access model](#6-access-model)
7. [Feature modules](#7-feature-modules)
   - 7.1 AI Interview Room
   - 7.2 Peer Interview Room
   - 7.3 Collaborative Code Editor
   - 7.4 Canvas Whiteboard
   - 7.5 Execution Sandbox
   - 7.6 Performance Intelligence Dashboard
   - 7.7 Session Summariser
   - 7.8 Peer Percentile System
   - 7.9 Domain Groups
   - 7.10 Personal DMs
8. [Authentication system](#8-authentication-system)
9. [User flows](#9-user-flows)
10. [Technical architecture](#10-technical-architecture)
11. [Data models](#11-data-models)
12. [API outline](#12-api-outline)
13. [WebSocket events](#13-websocket-events)
14. [Non-functional requirements](#14-non-functional-requirements)
15. [Build plan](#15-build-plan)
16. [Free stack](#16-free-stack)
17. [Risks and mitigations](#17-risks-and-mitigations)
18. [Why this is a top-tier project](#18-why-this-is-a-top-tier-project)

---

## 1. Problem

Students preparing for placements are splitting their time across five tools that don't talk to each other:

- They solve problems on LeetCode but never practice explaining their thought process out loud.
- They watch system design videos but never draw or discuss architecture with someone.
- They do mock interviews on Google Meet with no shared editor, no whiteboard, no feedback.
- There is no feedback loop. Students finish a session not knowing what they got wrong or why.
- There is no readiness signal. Students have no idea if they are actually improving over time.
- Community is scattered across WhatsApp groups and Discord servers — no connection to actual practice.

Existing platforms (LeetCode, Pramp, InterviewBit) solve one piece. None solve the whole journey.

PrepSync solves this by putting practice, collaboration, community, and analytics into one coherent environment — and using AI to close the feedback loop that every other platform leaves open.

---

## 2. What PrepSync is

Three layers that reinforce each other:

**Practice layer — AI + Peer Rooms**
A solo session where the AI acts as a real interviewer: opens with a question, probes your answer with follow-ups, identifies gaps, and generates a scored evaluation report when you're done. Or a live peer room where two students interview each other with a shared code editor, whiteboard, video, and chat — all in one tab, joined via a 6-character code or link.

**Community layer — Domain Groups**
Five WhatsApp-style group chats, one per domain (DSA, System Design, Backend, Conceptual, Behavioural). Every signed-up user is auto-joined. Text chat, file sharing, polls, group audio/video calls, and a persistent Study Lounge (drop-in video room) — all inside one group screen. No sub-channels. No sidebar complexity.

**Intelligence layer — Readiness Dashboard**
Every session feeds a performance dashboard that tracks your readiness score per domain, shows where you consistently underperform via a radar chart, benchmarks you against peers via a daily percentile job, and tells you what to practice next. Not vanity metrics. Actual measurable progress.

---

## 3. Users

PrepSync is built for **students only**. No recruiters. No job listings. No mentor marketplace.

### Primary — Placement-prep student

- Pre-final or final year engineering student
- Preparing for SWE placements (on-campus or off-campus)
- Practices daily or near-daily for 2–6 months before placement season
- Has coding basics, wants to become genuinely interview-ready
- Core frustration: finishes sessions with no idea how to improve

### Secondary — Job-switching professional

- Working professional preparing for a role change
- Wants structured simulation and measurable progress tracking
- Self-directed learner

### What they actually want

- A simulation that feels like a real interview, not a quiz
- Feedback that is specific and actionable — not "good communication skills"
- A clear sense of whether they are getting better over time
- A study community that is actually connected to their practice

---

## 4. Product philosophy

**Practice layer — depth over breadth**
The AI interview and peer room must feel real. The evaluation must be specific. The tools (editor, whiteboard, sandbox) must be production-grade. This is where PrepSync earns trust.

**Community layer — context over chaos**
Domain groups are not general chat rooms. Every interaction happens in the context of interview prep. A message in #DSA is from someone grinding the same problems as you. Polls, study lounges, and file sharing are purposeful — not social features for their own sake.

**Intelligence layer — progress over scores**
The dashboard does not show you a number and stop. It shows you a trajectory. The question it answers is not "how did I do today?" but "am I actually getting better at this?"

---

## 5. UI/UX Design System

### 5.1 Design Direction — "Terminal Intelligence"

PrepSync's visual identity is built around one idea: this is serious infrastructure for engineers, not a consumer app. The aesthetic borrows confidence from a Bloomberg terminal and precision from a modern IDE — but built for students who live on dark-mode tools.

**Core principles:**
- Dark-first. The primary theme is deep near-black, not grey.
- One accent color: electric cyan `#00D4FF`. Nothing else is colored unless it carries meaning.
- Monospace for data and code. Proportional sans-serif for UI. Used in deliberate contrast.
- Motion is functional — transitions signal state changes, not entertainment.
- Data is the hero. Layouts are built around making numbers and code readable.

---

### 5.2 Color Palette

```css
/* Backgrounds */
--color-bg-base:        #0A0B0E   /* page background */
--color-bg-surface:     #111318   /* cards, panels */
--color-bg-elevated:    #1A1D24   /* modals, inputs, dropdowns */
--color-bg-overlay:     #222631   /* hover states, selected rows */

/* Borders */
--color-border-subtle:  #1E2330   /* default borders */
--color-border-default: #2A3040   /* interactive element borders */
--color-border-strong:  #3D4760   /* focused / active borders */

/* Text */
--color-text-primary:   #E8EAF0   /* headings, important values */
--color-text-secondary: #8B91A8   /* labels, descriptions */
--color-text-muted:     #4A5068   /* placeholders, disabled */
--color-text-inverse:   #0A0B0E   /* text on accent backgrounds */

/* Accent — use sparingly, one per screen */
--color-accent:         #00D4FF
--color-accent-dim:     #0A2A33
--color-accent-border:  #0E4455

/* Semantic */
--color-success:        #00E5A0
--color-success-dim:    #0A2E22
--color-warning:        #FFB020
--color-warning-dim:    #2E1F00
--color-danger:         #FF4444
--color-danger-dim:     #2E0A0A

/* Domain colors — for category tagging only */
--color-domain-dsa:         #7C3AED   /* violet */
--color-domain-systemdesign:#0EA5E9   /* sky */
--color-domain-backend:     #10B981   /* emerald */
--color-domain-conceptual:  #F59E0B   /* amber */
--color-domain-behavioural: #EC4899   /* pink */
```

---

### 5.3 Typography

Two typefaces used in deliberate contrast throughout the product.

```
Display + UI:   DM Sans (Google Fonts)
                Weights: 400, 500, 600
                Usage: headings, nav, buttons, body copy, labels

Code + Data:    JetBrains Mono (Google Fonts)
                Weights: 400, 500
                Usage: code editor, score numbers, session IDs, timestamps, monospace output
```

| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `--text-display` | 32px | 600 | DM Sans | Page hero titles |
| `--text-title` | 22px | 600 | DM Sans | Section titles |
| `--text-heading` | 17px | 500 | DM Sans | Card headings |
| `--text-body` | 14px | 400 | DM Sans | Body copy |
| `--text-label` | 12px | 500 | DM Sans | Labels, tags, badges |
| `--text-caption` | 11px | 400 | DM Sans | Helper text, timestamps |
| `--text-code` | 14px | 400 | JetBrains Mono | Code, IDs |
| `--text-score` | 42px | 500 | JetBrains Mono | Big score displays |

---

### 5.4 Spacing System

4px base unit. All spacing is a multiple of 4.

```
--space-1: 4px    --space-2: 8px    --space-3: 12px
--space-4: 16px   --space-5: 20px   --space-6: 24px
--space-8: 32px   --space-10: 40px  --space-12: 48px
--space-16: 64px  --space-20: 80px
```

---

### 5.5 Border Radius

```
--radius-sm:   4px      tags, badges
--radius-md:   8px      inputs, buttons, small cards
--radius-lg:   12px     cards, panels
--radius-xl:   16px     modals, large surfaces
--radius-full: 9999px   pills, avatars
```

---

### 5.6 Component Specifications

#### Buttons

```css
/* Primary */
background:    var(--color-accent);
color:         var(--color-text-inverse);
font:          14px/500 'DM Sans';
padding:       10px 20px;
border-radius: var(--radius-md);
hover:         background #00BBDF;
active:        transform scale(0.98);

/* Secondary */
background:    transparent;
border:        1px solid var(--color-border-default);
hover:         background var(--color-bg-overlay), border-color var(--color-border-strong);

/* Danger */
color:         var(--color-danger);
border:        1px solid var(--color-danger);
hover:         background var(--color-danger-dim);

/* Ghost */
background:    transparent;
color:         var(--color-text-secondary);
hover:         color var(--color-text-primary), background var(--color-bg-elevated);
```

#### Inputs

```css
background:    var(--color-bg-elevated);
border:        1px solid var(--color-border-default);
border-radius: var(--radius-md);
padding:       10px 14px;
caret-color:   var(--color-accent);
focus:         border-color var(--color-accent-border);
               box-shadow 0 0 0 3px rgba(0,212,255,0.08);
error:         border-color var(--color-danger);
               box-shadow 0 0 0 3px rgba(255,68,68,0.08);
```

#### Domain badges

```css
/* Base */
padding:       3px 10px;
border-radius: var(--radius-sm);
font:          11px/500 'DM Sans';
text-transform: uppercase;
letter-spacing: 0.03em;

/* DSA */      background rgba(124,58,237,0.12); color #A78BFA;
/* SysDesign */background rgba(14,165,233,0.12); color #38BDF8;
/* Backend */  background rgba(16,185,129,0.12); color #34D399;
/* Conceptual */background rgba(245,158,11,0.12); color #FCD34D;
/* Behavioural */background rgba(236,72,153,0.12); color #F9A8D4;
```

#### Score ring

```
SVG circle progress ring
Score number: 42px/500 JetBrains Mono, centered inside ring
Color by score: 0–39 = danger, 40–59 = warning, 60–79 = text-primary, 80–100 = accent
Ring track: var(--color-border-subtle)
Ring fill:  stroke color matches score color above
Animation:  stroke-dashoffset animates from 251 to computed value on mount, 800ms ease
```

#### Readiness bar

```
height:     4px
track:      var(--color-border-subtle)
fill:       linear-gradient(90deg, var(--color-accent), #00A8CC)
transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

### 5.7 Page Layouts

#### Landing page

```
Hero section:
  Background: --color-bg-base with CSS grid pattern
    background-image: linear-gradient(var(--color-border-subtle) 1px, transparent 1px),
                      linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px);
    background-size: 40px 40px;
  Content (centered):
    Overline: "Interview simulation platform" — 11px, accent, uppercase
    H1: 52px/600 DM Sans — "Get interview-ready. Not just LeetCode-ready."
    Subtext: 17px, secondary color, 2 sentences max
    CTAs: "Start for free" (primary) + "See how it works →" (ghost)
    Below CTAs: "No credit card. No setup. Start in 60 seconds." — 12px, muted
    Hero mockup: rotated card with radial glow behind it

Feature strip: 3 columns, icon + heading + 2-line description

Footer: logo left, links right, border-top only
```

#### Auth pages (Login / Signup / Reset / OTP)

```
Layout: full-screen split
  Left (60%): form area, max-width 420px, centered
  Right (40%): dark decorative panel
    Background: var(--color-bg-surface)
    Border-left: 1px solid var(--color-border-subtle)
    Content: animated terminal showing a mock AI evaluation report
             text appears character by character via CSS keyframe animation
             this communicates the product without any marketing copy
```

#### Dashboard

```
Layout: fixed sidebar (240px) + scrollable main content

Sidebar:
  Background:   var(--color-bg-surface)
  Border-right: 1px solid var(--color-border-subtle)
  Top:          PrepSync logo + wordmark
  Below logo:   User avatar + name + overall readiness score (compact)
  Nav items:    Dashboard · AI Interview · Peer Room · Domain Groups · DMs · History · Settings
  Active state: 3px accent left border + accent text + dim accent background
  Bottom:       "New Session" button (full width, primary)

Main content:
  Background: var(--color-bg-base)
  Padding:    32px
  Max-width:  1100px

  Grid layout (top to bottom):
    Row 1: 4 metric cards — Overall readiness, Sessions this week, Peer percentile, Streak
    Row 2: Weakness radar chart (left 2/3) + Weekly goals ring (right 1/3)
    Row 3: Readiness bars per domain (full width)
    Row 4: Recent sessions table (full width)
```

#### AI Interview Room

```
Layout: two-panel split

Left panel (400px, fixed):
  AI "interviewer" avatar — minimal pulsing ring in accent color when AI is generating
  Conversation thread (scrollable) — question + follow-ups + user text responses
  Text input or voice toggle at bottom
  Session timer (top right, JetBrains Mono)
    At 80% time: transitions to warning color
    At 95% time: transitions to danger + subtle pulse

Right panel (fills width):
  Tabs: Code Editor | Whiteboard | Notes
  Code Editor:
    Monaco editor, dark theme matching app
    Language selector dropdown (top right)
    Run button (top right, primary)
    Output console (bottom, collapsible, 150px)
  Whiteboard tab: Fabric.js canvas with toolbar
  Notes tab: plain textarea for scratch notes

Bottom bar (full width):
  Left: domain badge + difficulty badge
  Center: session progress bar
  Right: "End Session" button (danger)
```

#### Peer Interview Room

```
Layout: three-area split

Top bar (48px):
  Left:  Room name + invite code (copy icon) + share button
  Right: Mic toggle, camera toggle, screen share, end room

Main area:
  Left panel (360px):
    Video tiles: 2 participants stacked
    Role indicator: "You: Interviewer / Candidate" + switch button
    Room chat below video (Socket.io)
    File attach button at bottom of chat

  Right panel (fills):
    Tabs: Code Editor | Whiteboard
    Same editor and whiteboard as AI room
```

#### Domain Groups

```
Layout: two-panel (group list + active group)

Left panel (280px):
  5 group rows:
    Each: domain color avatar + group name + last message preview + unread count
    Active group has accent left border

Right panel (fills):
  Header:
    Domain avatar + name + member count + online count
    Action buttons: Audio Call · Video Call · Study Lounge (persistent drop-in)
    "Create Poll" button

  Message stream (scrollable):
    Text messages: avatar + name + timestamp + message
    File messages: inline image previews, PDF icon + filename for documents
    Poll cards: question + live bar chart options + vote count + expiry
    System messages: "[Name] started a study lounge" etc.

  Input bar:
    File attach (📎) · Poll create (📊) · Emoji
    Text input
    Send button
```

#### Personal DMs

```
Layout: two-panel (DM list + active conversation)

Left panel (280px):
  DM threads list
  Each: avatar + name + last message + timestamp + unread count
  Search input at top

Right panel (fills):
  Header:
    Avatar + name + readiness score badge
    Action buttons: Audio Call · Video Call · "Create Peer Room" (primary button)

  Message stream:
    Same as domain groups but 1-on-1
    File sharing inline
    No polls (DMs only)

  Input bar:
    File attach · text input · send
```

#### Session history + report

```
Full-width table: Date | Domain | Type | Duration | Score | Actions
Row click: opens slide-in detail panel (480px from right)
  Detail panel:
    Session metadata
    Score ring (animated on open)
    Per-dimension breakdown with bars
    Evaluation report text
    Improvement suggestions (numbered)
    Session summary
    "Practice this next: [topic]" suggestion
```

---

### 5.8 Motion

```css
/* Page enter */
opacity: 0 → 1; translateY: 8px → 0; duration: 200ms;

/* Score ring fill */
stroke-dashoffset animates on mount; duration: 800ms; ease-in-out

/* Readiness bar */
width: 0 → value; duration: 600ms; delay: 200ms; cubic-bezier(0.4,0,0.2,1)

/* AI pulse ring */
scale: 1→1.15→1; opacity: 1→0.6→1; duration: 2000ms; infinite
Plays only when AI is generating a response

/* Modal enter */
opacity: 0→1; scale: 0.96→1; duration: 180ms
Backdrop: rgba(0,0,0,0.6); duration: 180ms

/* Toast */
Enter from right: translateX(100%)→0; duration: 250ms
Auto-dismiss: 4000ms, reverse animation

/* Session timer warning */
At 80%: color transitions to warning; duration: 1000ms
At 95%: color transitions to danger + pulse

/* All easing default: cubic-bezier(0.4, 0, 0.2, 1) */

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { all animations disabled }
```

---

### 5.9 Responsive

PrepSync is desktop-first. Mobile is explicitly out of MVP scope.

```
900px–1200px: sidebar collapses to icon-only (64px). Tooltips on hover show labels.
Below 900px:  "PrepSync works best on desktop" banner. Room layouts do not reflow.
```

---

## 6. Access Model

PrepSync has three types of users. Each has a clearly defined set of permissions.

### User types and access

| User type | How they got in | Domain Groups | AI Interview | Peer Room | DMs |
|-----------|----------------|---------------|-------------|-----------|-----|
| **Signed-up** | Email/Google signup | ✓ All 5, auto-joined | ✓ Full access | ✓ Full + history saved | ✓ After connection |
| **Guest** | Room invite link only | ✗ No access | ✗ No access | ✓ Room session only, no history | ✗ No access |
| **Not logged in** | Landed on site | ✗ No access | ✗ No access | ✗ No access | ✗ No access |

### Domain groups access

Domain groups are **open communities**. Every signed-up user automatically gets access to all 5 groups on account creation. No invite code. No approval. No friction.

During onboarding, users pick which domains they are focusing on — this controls which groups appear first in their sidebar. All 5 remain accessible regardless.

### Peer room joining

Peer rooms are created by one user and joined by another via a **6-character alphanumeric invite code** or a **direct shareable link**.

```
Room link format:   prepsync.app/room/AB3K9X
Room code format:   AB3K9X  (can be typed manually on the join screen)
```

- Anyone with the link or code can join — including guests without an account.
- Guests get full in-room functionality (video, editor, whiteboard, chat).
- Guests do not get session history, readiness tracking, or access to any other part of the platform.
- After the session, guests see: "Sign up to save your progress and track your improvement."

### Personal DM access

DMs can only be initiated after a **real interaction**. There are exactly two ways to start a DM thread:

**Path 1 — After a peer room session**
The session end screen shows your partner's profile with a "Message [name]" button. One click opens a DM thread. Natural, contextual.

**Path 2 — From a domain group**
Tap any member's name or avatar in a group → mini profile card appears (name, readiness score, domains) → "Send message" button → opens a DM thread.

There is no user search. You cannot DM a stranger who you have not interacted with. This keeps the platform purposeful and safe.

---

## 7. Feature Modules

---

### 7.1 AI Interview Room

**What it is:** A solo session where the AI is the interviewer and you are the candidate.

**Session configuration:**

| Setting | Options |
|---------|---------|
| Domain | DSA · System Design · Backend · Conceptual · Behavioural |
| Difficulty | Easy · Medium · Hard · FAANG-level |
| Duration | 20 min · 40 min · 60 min |

**How a session works:**

1. User configures and starts the session.
2. AI opens with a calibrated question based on domain and difficulty.
3. User answers via the code editor (DSA), whiteboard (system design), or text input (conceptual/behavioural).
4. AI generates contextual follow-up questions based on the user's actual response — probing edge cases, time/space complexity, alternative approaches, communication gaps.
5. Follow-up rounds: 1–3 depending on answer quality and time remaining.
6. User clicks "End Session" or timer expires.
7. Evaluation report generated in under 10 seconds.
8. Session summariser runs asynchronously.

**Evaluation report — 6 dimensions:**

| Dimension | What it measures |
|-----------|-----------------|
| Correctness | Is the solution correct? Does it handle all cases? |
| Approach quality | Is the approach optimal? Were better alternatives considered? |
| Time/space efficiency | Correct complexity analysis? Trade-offs understood? |
| Communication clarity | Can the user explain their thinking clearly while coding? |
| Problem decomposition | Did the user break the problem down before jumping in? |
| Edge case handling | Were edge cases identified and addressed proactively? |

**Report contents:**

- Overall score (0–100), displayed as animated score ring
- Per-dimension scores with bar visualization
- Domain readiness score updated to user profile
- Specific mistakes identified with explanations
- What a strong answer would have looked like
- 3–5 concrete improvement suggestions
- Topics to review before next session

**Acceptance criteria:**

- Session starts in under 60 seconds from the dashboard
- AI follow-up references the user's actual prior answer, not a generic script
- Report generated within 10 seconds of session end
- Report persists in session history indefinitely

---

### 7.2 Peer Interview Room

**What it is:** A real-time 1-on-1 room. Two students. Full toolset. One tab. Joined via 6-char code or link.

**In-room features:**

- WebRTC video + audio (with OpenRelayProject TURN fallback for college NAT)
- Collaborative code editor (Monaco + Yjs CRDT, real-time sync)
- Canvas whiteboard (Fabric.js + WebSocket sync)
- Room chat (Socket.io, persistent for session duration)
- In-session file sharing (images + PDFs via Cloudinary)
- Role switcher — interviewer or candidate, switchable anytime
- Post-session rating — 1–5 stars shown on end screen, saved to session data

**Room lifecycle:**

```
User A creates room
  → Gets code AB3K9X + link prepsync.app/room/AB3K9X
  → Shares with User B (via WhatsApp, Discord, anywhere)
User B opens link
  → If no account: enter display name → join as guest
  → If has account: join directly (logged in)
Session runs
Either user clicks "End Session"
  → Session summariser runs on transcript
  → Both users' histories updated (if signed in)
  → End screen: partner profile + "Message" button + post-session rating
```

---

### 7.3 Collaborative Code Editor

- Monaco Editor + Yjs CRDT
- Real-time sync — conflict-free, works through reconnects
- Cursor and selection awareness (see where partner is typing)
- Language support: Python · JavaScript · TypeScript · Java · C++ · Go (Judge0 CE supports 60+)
- Syntax highlighting, autocomplete, bracket matching
- Integrated Run button → executes in sandbox inline
- Output console (collapsible, 150px) — stdout, stderr, exit code, execution time

---

### 7.4 Canvas Whiteboard

- Fabric.js + WebSocket sync
- Tools: freehand, rectangle, circle, diamond, arrow, line, text label, eraser
- Real-time sync — all participants see changes instantly
- Undo/redo per user
- Color picker (8 presets + custom hex)
- Export to PNG

---

### 7.5 Execution Sandbox

- Judge0 CE self-hosted via Docker on Render free VM
- 60+ languages (Python, JavaScript, TypeScript, Java, C++, Go by default)
- Security: network access disabled, 256MB memory cap, 5s CPU cap, seccomp profile
- Result: stdout, stderr, exit code, execution time, memory used

---

### 7.6 Performance Intelligence Dashboard

**Metric cards (top row):**

| Card | What it shows |
|------|--------------|
| Overall readiness | Composite 0–100 score, updated after every session |
| Sessions this week | Count vs weekly goal |
| Peer percentile | "Top X%" among all users in your primary domain |
| Current streak | Consecutive days with at least one session |

**Weakness radar chart:**
Hexagonal SVG chart with 6 axes — one per evaluation dimension. Shows where you consistently underperform across all sessions. Built with D3.js.

**Activity heatmap:**
GitHub-style 52×7 calendar. Color intensity scales with sessions completed per day. Built with SVG.

**Readiness bars per domain:**
Animated horizontal bars showing 0–100 readiness per domain with gradient fill.

**Session history table:**
All past sessions. Columns: date, domain badge, type (AI/Peer), duration, score, actions. Filterable by domain, type, date range. Row click opens slide-in report panel.

**Weekly goals:**
User sets a weekly session target during onboarding. Progress ring on dashboard. Editable in settings.

---

### 7.7 Session Summariser

AI-generated summary produced after every session (AI and peer).

**Contents:**
- Topics covered in the session
- Key decisions or approaches discussed (system design) / attempted (coding)
- Strongest moments and weakest moments
- 2–3 action items for the next session

**Implementation:** One structured LLM call (Groq, Llama 3.3 70B) fired after session end using the full session transcript as context. Async — does not block the session end response. Result saved to session record.

---

### 7.8 Peer Percentile System

- Daily batch job at 2 AM recomputes percentile rankings across all users per domain
- MongoDB aggregation pipeline — runs as a background job, never on request path
- Result cached in `UserPercentile` collection
- Dashboard reads from cache — zero latency impact
- Displayed as "Top X% in [Domain]" cards on the dashboard
- Updates once per day — not real-time (intentional, prevents gaming)

---

### 7.9 Domain Groups

Five WhatsApp-style group chats, one per domain. Open to all signed-up users. Auto-joined on account creation.

**The five groups:**
- DSA Group
- System Design Group
- Backend Group
- Conceptual Group
- Behavioural Group

**What's inside each group (everything in one screen):**

**Text chat:**
- Real-time messages via Socket.io, persisted to MongoDB
- All messages public to all PrepSync users
- Tap any member's name → mini profile card → "Send message" button → opens DM

**File sharing (inline in chat):**
- Images: previewed inline in the message stream
- PDFs: icon + filename + download link
- Storage: Cloudinary free tier (10GB, 25GB bandwidth/month)
- Client uploads directly to Cloudinary via signed upload preset — no file passes through PrepSync server

**Polls (as message cards):**
- Any member can create a poll from the input bar
- Poll appears inline in the message stream as a card
- Options: up to 4 choices, optional expiry time
- Real-time vote updates via Socket.io
- One vote per user enforced (userId stored in votes array)
- After expiry: poll closes, final results locked and displayed

**Group audio/video call:**
- Triggered from the call button in the group header
- Uses LiveKit Cloud (SFU) — required for 3+ person group calls
- Any member can start a call; others see a "Join call" notification in the group
- In-call: video tiles grid, mute/camera toggle, leave button

**Study Lounge (persistent drop-in video room):**
- Always-on room per domain group — not started by anyone, always exists
- "Study Lounge" button in group header shows live count: "3 in lounge"
- Click → join instantly, no setup, no notifications to others
- Drop in, drop out freely — like a Discord voice channel
- Uses LiveKit Cloud (same SFU as group calls)
- Visible in the header when empty: "Study Lounge — Join"
- Visible when occupied: "Study Lounge — 3 studying →"

---

### 7.10 Personal DMs

One-on-one private chat between two users. Only accessible after a real interaction.

**How to start a DM (two paths only):**

Path 1 — After peer room session: end screen shows partner's profile card with a "Message [name]" button.

Path 2 — From domain group: tap any member's name or avatar → mini profile card (name, domains, readiness score) → "Send message" button.

**What's inside a DM thread:**

- Text chat (Socket.io, persisted to MongoDB)
- File sharing — images + PDFs (Cloudinary, same as groups)
- Audio call — 1-on-1 WebRTC (same as peer room video, no SFU needed)
- Video call — 1-on-1 WebRTC
- **"Create Peer Room" button** (in DM header) — one click creates a room and automatically sends the invite link as a message in the DM thread. No copy-pasting.

**What DMs do not have:**
- No group DMs — 1-on-1 only
- No polls — groups only
- No cold DMs — connection must come from a real interaction

---

## 8. Authentication System

### 8.1 Methods

| Method | When used |
|--------|-----------|
| Email + Password | Primary method |
| Google OAuth 2.0 | One-click sign-in/up |
| Magic Link (email) | Passwordless option |
| Guest join | Peer room only, no account |

---

### 8.2 Registration — Email + Password

**Step 1 — Form**

Fields: Full name · Email · Password · Confirm password

Validation (real-time, on blur):
```
Name:     2–60 characters
Email:    RFC 5322 compliant format
Password: min 8 chars, 1 uppercase, 1 number, 1 special character
          strength meter: zxcvbn library (0 cost, browser-side)
          Too weak / Weak / Fair / Strong / Very strong
          Visual: animated bar that fills and color-shifts
Confirm:  must match password, validated on change after first touch
```

**Step 2 — Email OTP verification**

- 6-digit OTP sent via Resend (free tier, 3000 emails/month)
- OTP expires in 10 minutes
- Resend available after 60-second countdown
- After 3 failed attempts: 15-minute lockout

OTP input UI:
```
6 individual single-character input boxes
Auto-advance on each digit entry
Paste detection: pasting "123456" fills all 6 boxes automatically
Backspace: moves focus to previous box
Auto-submit when all 6 digits entered
```

**Step 3 — Onboarding (3 screens)**

Screen 1: "What are you preparing for?"
Options: On-campus placements / Off-campus applications / Job switch

Screen 2: "Which domains are you focusing on?"
Multi-select: DSA · System Design · Backend · Conceptual · Behavioural

Screen 3: "Set your weekly session goal"
Slider: 1–14 sessions/week. Default: 5.
Labels: 1–3 casual · 4–7 focused · 8+ intensive

After onboarding → Dashboard with welcome toast + first session prompt.

---

### 8.3 Google OAuth 2.0 — Full Flow

```
1. User clicks "Continue with Google"
2. Client calls GET /auth/google
3. Server redirects to Google OAuth consent screen
   Scopes: openid, email, profile
4. User selects Google account + grants permission
5. Google redirects to /auth/google/callback?code=...
6. Server POSTs to https://oauth2.googleapis.com/token:
   { code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" }
7. Server receives { access_token, id_token, refresh_token }
8. Server decodes id_token JWT → extracts: sub, email, name, picture
9. Account lookup:
   - Email exists with googleId → sign in (update last login)
   - Email exists without googleId → link Google to existing account
   - Email does not exist → create account (emailVerified: true, skip OTP)
10. Server generates PrepSync JWT pair (access + refresh tokens)
11. Redirect to /auth/callback?token=<access_token>
12. Client stores access token in memory, refresh token in httpOnly cookie
13. Redirect to:
    - /onboarding if new user
    - /dashboard if returning user
```

**Environment variables required:**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
```

**Google Cloud Console setup:**
1. console.cloud.google.com → New project "PrepSync"
2. APIs & Services → OAuth consent screen → External
3. Credentials → Create OAuth 2.0 Client ID → Web application
4. Authorized redirect URIs: `http://localhost:3000/auth/google/callback` (dev) + production URL
5. Copy Client ID + Secret to `.env`

**Server implementation (passport-google-oauth20):**
```javascript
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name: profile.displayName,
      googleId: profile.id,
      avatarUrl: profile.photos[0].value,
      emailVerified: true,
      onboardingComplete: false
    });
  } else if (!user.googleId) {
    user.googleId = profile.id;
    await user.save();
  }
  return done(null, user);
}));
```

---

### 8.4 Login Flow — Email + Password

Fields: Email + Password + "Remember me" checkbox.

Error handling:
```
Wrong email:         "No account found with this email"
Wrong password:      "Incorrect password"
5 failed attempts:   "Too many attempts. Try again in 15 minutes."
Unverified email:    "Please verify your email. [Resend verification]"
```

Remember me:
```
Checked:   refresh token TTL = 30 days
Unchecked: refresh token TTL = 7 days
```

---

### 8.5 Magic Link — Passwordless

```
1. User clicks "Sign in with magic link"
2. Enter email address
3. Server sends signed JWT link to email:
   https://prepsync.app/auth/magic?token=<jwt>
   Payload: { userId, email, purpose: "magic_login" }
   Expiry: 15 minutes, single-use
4. User clicks link
5. Server validates JWT → issues PrepSync access/refresh tokens
6. Redirect to dashboard
```

---

### 8.6 Password Reset

```
1. "Forgot password?" → enter email
2. If email exists: reset link sent. If not: same success message (no enumeration).
3. Link: /auth/reset-password?token=<jwt>
   Payload: { userId, purpose: "password_reset" }
   Expiry: 30 minutes, single-use
4. User lands on reset form: new password + confirm + strength meter
5. On submit: token validated → password hashed → all refresh tokens invalidated → redirect to login
```

---

### 8.7 Guest Join

```
1. User opens: prepsync.app/room/AB3K9X
2. Screen: "You're joining [Room Name]"
   Option A: "Sign in to save your history" → auth flow → return to room
   Option B: "Join as guest" → enter display name → enter room
3. Guest: full room functionality (video, editor, whiteboard, chat)
4. Session NOT saved to history
5. After session: "Sign up to save your progress" prompt
```

---

### 8.8 Token Architecture

**Access token:**
```
Type:    JWT signed with HS256
Payload: { userId, email, role }
Expiry:  15 minutes
Storage: JavaScript memory variable — never localStorage, never sessionStorage
Usage:   Authorization: Bearer <token> on every API request
```

**Refresh token:**
```
Type:    Opaque 64 hex chars (crypto.randomBytes(32).toString('hex'))
Expiry:  7 days (30 days with "remember me")
Storage: httpOnly, Secure, SameSite=Strict cookie
Usage:   POST /auth/refresh → returns new access token
DB:      Stored as bcrypt hash in user.refreshTokens[] array
         Supports multiple devices. Supports selective revocation.
Rotation: Old token invalidated on every refresh. New token issued.
```

**Auto-refresh flow (axios interceptor):**
```
1. API request returns 401 { code: "TOKEN_EXPIRED" }
2. Axios interceptor catches 401
3. Calls POST /auth/refresh (cookie sent automatically)
4. Server validates refresh token → issues new access token
5. Interceptor retries original request with new token
6. If refresh also expired → redirect to /login
```

---

### 8.9 Session Management

Users can view and revoke active sessions in Settings → Security.

Each session shows: device/browser, IP geolocation (country + city), last active time.

- "Revoke" button per session
- "Revoke all other sessions" button
- Current session highlighted, cannot be revoked from this screen

---

### 8.10 Security Details

```
Passwords:         bcrypt, 12 rounds minimum

Rate limits (per IP, via express-rate-limit):
  POST /auth/login:           5 requests / 15 min
  POST /auth/register:        3 requests / hour
  POST /auth/forgot-password: 3 requests / hour
  POST /auth/refresh:         20 requests / min

Account lockout:
  5 consecutive failed logins → locked 15 minutes
  Per-account lockout (not per-IP — prevents distributed lockout attacks)

CSRF:
  Access token in Authorization header for all state-changing requests
  SameSite=Strict on refresh token cookie

Email enumeration:
  /auth/forgot-password always returns 200 regardless of whether email exists

HTTPS:
  Enforced in production
  HSTS: max-age=31536000; includeSubDomains

Content Security Policy:
  default-src 'self'
  script-src 'self' https://accounts.google.com
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline'
  img-src 'self' data: https://lh3.googleusercontent.com https://res.cloudinary.com
  connect-src 'self' https://api.groq.com wss://your-livekit-domain.com
```

---

## 9. User Flows

### Flow 1 — AI interview (primary)

```
Dashboard → "New Session" → "AI Interview"
  → Select domain + difficulty + duration
  → AI opens with question
  → Answer in editor / whiteboard / text
  → AI follows up (1–3 rounds)
  → "End Session"
  → Evaluation report (< 10s, animated)
  → Summariser runs async
  → Dashboard readiness index updates
  → "Practice this next: [topic]" prompt
```

### Flow 2 — Peer room

```
Dashboard → "New Session" → "Peer Room"
  → Room created → code AB3K9X + link generated
  → Share link/code with partner (WhatsApp, Discord, anywhere)
  → Partner opens link → joins (guest or signed in)
  → Role assignment (who interviews first)
  → Session runs: video + editor + whiteboard + chat
  → Either user ends session
  → End screen: partner profile + "Message" button + rating
  → Summariser runs on transcript
  → Both users' histories updated (if signed in)
```

### Flow 3 — New user (email)

```
/signup
  → Name + email + password
  → OTP sent → /verify-email
  → OTP confirmed
  → Onboarding screen 1: goal type
  → Onboarding screen 2: domains
  → Onboarding screen 3: weekly goal
  → /dashboard — welcome toast + first session prompt
```

### Flow 4 — New user (Google)

```
/signup → "Continue with Google"
  → Google consent screen
  → /auth/google/callback
  → Account created (no OTP — Google verified email)
  → Onboarding (same 3 screens)
  → /dashboard
```

### Flow 5 — Domain group

```
Sidebar → "Domain Groups" → select group
  → See message stream
  → Type and send a message
  → Tap "Study Lounge" → join drop-in video room
  → Tap member name → mini profile card → "Send message" → DM opens
  → Tap poll icon → create a poll → poll appears in stream
  → Tap call icon → start group audio/video call
```

### Flow 6 — Starting a DM

```
Path A (from peer room):
  Session ends → end screen → "Message Rahul" → DM thread opens

Path B (from domain group):
  Tap member name → profile card → "Send message" → DM thread opens

Inside DM:
  Chat + files + audio/video call
  "Create Peer Room" button → room created → invite link sent as message automatically
```

---

## 10. Technical Architecture

### Service map

```
┌────────────────────────────────────────────────────────────┐
│                       Client                                │
│         React + TypeScript + Zustand + TanStack Query       │
└──────────────┬──────────────────┬──────────────────────────┘
               │ HTTP/REST        │ WebSocket (Socket.io)
               ▼                  ▼
┌──────────────────────┐   ┌────────────────────────────┐
│     API Service      │   │      Realtime Service      │
│  Node.js + Express   │   │  Socket.io + Yjs + Redis   │
│  Auth · Users        │   │  Editor sync               │
│  Sessions · Rooms    │   │  Whiteboard sync           │
│  Groups · DMs        │   │  All chat (room/group/DM)  │
│  Files · Channels    │   │  WebRTC 1-on-1 signalling  │
│                      │   │  Presence + typing         │
└──────────┬───────────┘   └──────────────┬─────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐       ┌──────────────────────┐
│   MongoDB Atlas M0  │       │    Upstash Redis      │
│   Primary database  │       │  Pub/sub · Cache      │
└──────────┬──────────┘       └──────────────────────┘
           │
    ┌──────┴───────────────────────────────────────┐
    │                                              │
    ▼                                              ▼
┌──────────────────┐                  ┌─────────────────────┐
│   AI Service     │                  │  Execution Service  │
│  Groq API        │                  │   Judge0 CE         │
│  Llama 3.3 70B   │                  │   Docker sandbox    │
│  Evaluator       │                  │   60+ languages     │
│  Summariser      │                  └─────────────────────┘
│  Question gen    │
└──────────────────┘
           │
    ┌──────┴───────────────────────────────────────┐
    │                                              │
    ▼                                              ▼
┌──────────────────────┐              ┌────────────────────────┐
│  Analytics Service   │              │    Media Service       │
│  Readiness index     │              │  LiveKit Cloud (SFU)   │
│  Peer percentile     │              │  Group video calls     │
│  Background cron     │              │  Study lounges         │
└──────────────────────┘              │                        │
                                      │  Cloudinary            │
                                      │  File storage          │
                                      └────────────────────────┘
```

### Key architectural decisions

**Two video implementations — intentional:**

| Use case | Technology | Why |
|----------|-----------|-----|
| 1-on-1 video (peer room, DM calls) | Native WebRTC + simple-peer | Direct P2P connection, zero server cost |
| Group video (domain study lounge, group calls) | LiveKit Cloud | SFU required for 3+ people — WebRTC mesh collapses at 4+ participants |

**WebSocket + Yjs CRDT for editor:**
Yjs provides conflict-free replicated data type semantics — each user holds a local copy, changes are operations not diffs, works through reconnections. Same approach as Notion and Figma. Do not build CRDT from scratch.

**Redis pub/sub for horizontal scaling:**
All real-time events flow through Upstash Redis as the event bus. Allows multiple Realtime Service instances to communicate. Enables horizontal scaling post-MVP with no architecture changes.

**AI pipeline — structured, not freeform:**
The evaluation rubric is embedded as a structured schema in the system prompt. User input is passed as a data field, never interpolated into the system prompt (injection prevention). Response is parsed into a typed TypeScript schema before storage. Groq Llama 3.3 70B for production. Ollama locally during development.

**Cloudinary direct upload:**
Client requests a signed upload preset from the API. Client uploads directly to Cloudinary — the file never passes through PrepSync servers. Reduces bandwidth cost and server load to zero for file handling.

---

## 11. Data Models

### User

```typescript
{
  _id: ObjectId,
  email: string,
  passwordHash?: string,           // undefined for Google-only accounts
  googleId?: string,
  name: string,
  avatarUrl?: string,
  emailVerified: boolean,
  onboardingComplete: boolean,
  goal: "placement" | "switch" | "practice",
  targetDomains: Domain[],
  weeklyGoal: number,
  streak: number,
  lastActiveDate: Date,
  createdAt: Date,
  refreshTokens: {
    tokenHash: string,             // bcrypt hash of raw token
    expiresAt: Date,
    deviceInfo: string,
    ipAddress: string,
    createdAt: Date
  }[],
  readinessIndex: {
    overall: number,               // 0–100
    dsa: number,
    systemDesign: number,
    backend: number,
    conceptual: number,
    behavioural: number,
    lastUpdated: Date
  }
}
```

### Session

```typescript
{
  _id: ObjectId,
  type: "ai" | "peer",
  userId: ObjectId,
  peerId?: ObjectId,
  domain: Domain,
  difficulty: "easy" | "medium" | "hard" | "faang",
  durationMinutes: number,
  startedAt: Date,
  endedAt?: Date,
  status: "active" | "completed" | "abandoned",
  peerRating?: number,             // 1–5 post-session rating
  transcript: {
    role: "ai" | "user" | "system",
    content: string,
    timestamp: Date,
    type: "text" | "code" | "whiteboard_snapshot"
  }[],
  evaluationReport?: EvaluationReport,
  summary?: {
    topicsCovered: string[],
    strongMoments: string[],
    weakMoments: string[],
    actionItems: string[],
    generatedAt: Date
  }
}
```

### EvaluationReport

```typescript
{
  overallScore: number,
  dimensions: {
    correctness: number,
    approachQuality: number,
    timeEfficiency: number,
    communicationClarity: number,
    problemDecomposition: number,
    edgeCaseHandling: number
  },
  mistakesIdentified: string[],
  strongAnswerExample: string,
  improvementSuggestions: string[],
  topicsToReview: string[],
  generatedAt: Date
}
```

### Room

```typescript
{
  _id: ObjectId,
  inviteCode: string,              // 6 uppercase alphanumeric chars, e.g. "AB3K9X"
  createdBy: ObjectId,
  participants: {
    userId?: ObjectId,             // undefined for guests
    displayName: string,
    role: "interviewer" | "candidate",
    isGuest: boolean,
    joinedAt: Date
  }[],
  status: "waiting" | "active" | "ended",
  createdAt: Date,
  endedAt?: Date,
  sessionId?: ObjectId
}
```

### GroupMessage

```typescript
{
  _id: ObjectId,
  groupId: string,                 // "dsa" | "system-design" | "backend" | "conceptual" | "behavioural"
  userId: ObjectId,
  type: "text" | "file" | "poll" | "system",
  content?: string,
  attachments?: {
    type: "image" | "pdf",
    url: string,                   // Cloudinary URL
    filename: string,
    filesize: number
  }[],
  poll?: {
    question: string,
    options: {
      text: string,
      votes: ObjectId[]            // userIds who voted for this option
    }[],
    expiresAt?: Date,
    closed: boolean
  },
  createdAt: Date,
  editedAt?: Date
}
```

### DirectMessage

```typescript
{
  _id: ObjectId,
  threadId: string,                // sorted concat of both userIds: "userId1_userId2"
  senderId: ObjectId,
  type: "text" | "file",
  content?: string,
  attachments?: {
    type: "image" | "pdf",
    url: string,
    filename: string,
    filesize: number
  }[],
  readAt?: Date,
  createdAt: Date
}
```

### UserPercentile

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  computedAt: Date,
  percentiles: {
    overall: number,
    dsa: number,
    systemDesign: number,
    backend: number,
    conceptual: number,
    behavioural: number
  }
}
```

### AuthToken (OTP / magic link / password reset)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: string,               // SHA-256 hash of raw token
  purpose: "email_verification" | "password_reset" | "magic_login",
  expiresAt: Date,
  usedAt?: Date                    // single-use enforcement
}
```

---

## 12. API Outline

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create account → returns `{ message: "OTP sent" }` |
| POST | `/auth/verify-email` | Verify 6-digit OTP → returns tokens |
| POST | `/auth/resend-verification` | Resend OTP (rate limited) |
| POST | `/auth/login` | Email + password → returns tokens |
| POST | `/auth/refresh` | Refresh access token via httpOnly cookie |
| POST | `/auth/logout` | Invalidate refresh token |
| GET | `/auth/google` | Redirect to Google consent screen |
| GET | `/auth/google/callback` | OAuth callback → issue tokens |
| POST | `/auth/forgot-password` | Send reset link (always 200) |
| POST | `/auth/reset-password` | Validate token + update password |
| POST | `/auth/magic-link` | Send magic link to email |
| GET | `/auth/magic` | Validate magic link token → issue tokens |

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users/me` | Profile + readiness index |
| PATCH | `/users/me` | Update name, goal, weekly target, domains |
| GET | `/users/me/dashboard` | Full dashboard payload (readiness + sessions + percentile + heatmap) |
| GET | `/users/me/sessions` | Paginated session history |
| GET | `/users/me/sessions/:id` | Single session with report + summary |
| GET | `/users/me/security` | Active refresh token sessions |
| DELETE | `/users/me/security/:tokenId` | Revoke specific session |
| DELETE | `/users/me/security` | Revoke all other sessions |
| GET | `/users/:id/profile` | Public mini-profile (name, domains, readiness) — for DM initiation |

### Sessions

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/sessions` | Create session |
| PATCH | `/sessions/:id/end` | End session → trigger AI pipeline |
| GET | `/sessions/:id/report` | Evaluation report |
| GET | `/sessions/:id/summary` | Session summary |
| PATCH | `/sessions/:id/rating` | Submit post-session peer rating (1–5) |

### Rooms

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/rooms` | Create peer room → returns `{ inviteCode, link }` |
| GET | `/rooms/:inviteCode` | Get room details by invite code |
| POST | `/rooms/:id/join` | Join room (authenticated or guest) |
| PATCH | `/rooms/:id/end` | End room |
| PATCH | `/rooms/:id/role` | Switch interviewer/candidate role |

### Groups

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/groups` | List all 5 groups with unread counts + study lounge status |
| GET | `/groups/:id/messages` | Paginated message history |
| POST | `/groups/:id/messages` | Send text or file message |
| POST | `/groups/:id/polls` | Create poll |
| POST | `/groups/:id/polls/:pollId/vote` | Vote on poll option |
| DELETE | `/groups/:id/messages/:msgId` | Delete own message |
| POST | `/groups/:id/lounge/join` | Join study lounge (returns LiveKit token) |
| POST | `/groups/:id/call/start` | Start group call (returns LiveKit token) |
| POST | `/groups/:id/call/join` | Join active group call (returns LiveKit token) |

### DMs

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dms` | List all DM threads with last message + unread count |
| GET | `/dms/:threadId/messages` | Paginated message history |
| POST | `/dms/:threadId/messages` | Send text or file message |
| POST | `/dms/threads` | Create or get DM thread with a user |
| POST | `/dms/:threadId/room` | Create peer room from DM → returns invite link + sends as message |
| POST | `/dms/:threadId/call` | Start 1-on-1 WebRTC call |

### Execution

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/execute` | Submit code → returns submission token |
| GET | `/execute/:token` | Poll for execution result |

### Files

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/files/upload-signature` | Get Cloudinary signed upload preset for direct client upload |
| DELETE | `/files/:publicId` | Delete a file (own files only) |

---

## 13. WebSocket Events

All real-time events flow through Socket.io with Upstash Redis as the pub/sub bus.

### Peer room events

| Event | Direction | Payload |
|-------|-----------|---------|
| `room:join` | C→S | `{ roomId, userId?, displayName }` |
| `room:leave` | C→S | `{ roomId }` |
| `room:participant_joined` | S→C | `{ userId, displayName }` |
| `room:participant_left` | S→C | `{ userId }` |
| `room:ended` | S→C | — |
| `editor:update` | C↔S | Yjs binary update |
| `whiteboard:update` | C↔S | Fabric.js delta JSON |
| `room:chat:send` | C→S | `{ roomId, content, attachments? }` |
| `room:chat:message` | S→C | `{ userId, displayName, content, timestamp }` |
| `webrtc:offer` | C↔S | `{ to, sdp }` |
| `webrtc:answer` | C↔S | `{ to, sdp }` |
| `webrtc:ice` | C↔S | `{ to, candidate }` |
| `room:role_changed` | S→C | `{ userId, newRole }` |

### Group events

| Event | Direction | Payload |
|-------|-----------|---------|
| `group:message` | C↔S | `{ groupId, type, content, attachments? }` |
| `group:poll_vote` | C↔S | `{ groupId, pollId, optionIndex }` |
| `group:poll_update` | S→C | `{ pollId, options (with updated counts) }` |
| `group:typing` | C→S | `{ groupId }` |
| `group:typing` | S→C | `{ groupId, userId, displayName }` |
| `group:lounge_update` | S→C | `{ groupId, count }` — study lounge participant count |
| `group:call_started` | S→C | `{ groupId, startedBy }` |

### DM events

| Event | Direction | Payload |
|-------|-----------|---------|
| `dm:message` | C↔S | `{ threadId, type, content, attachments? }` |
| `dm:typing` | C→S | `{ threadId }` |
| `dm:typing` | S→C | `{ threadId, userId }` |
| `dm:read` | C→S | `{ threadId, messageId }` |
| `dm:peer_room_created` | S→C | `{ threadId, inviteCode, link }` |

### Presence events

| Event | Direction | Payload |
|-------|-----------|---------|
| `presence:online` | S→C | `{ userId }` |
| `presence:offline` | S→C | `{ userId }` |

---

## 14. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| Editor sync latency (p95) | < 200ms |
| AI evaluation report | < 10 seconds |
| Dashboard load | < 2 seconds |
| Code execution | < 6 seconds including queue |
| API response (p95) | < 300ms |
| Auth response | < 500ms (includes bcrypt) |
| Group message delivery | < 100ms |

### Security

- Passwords: bcrypt 12 rounds minimum
- Tokens: JWT HS256 (access, 15 min) + opaque hex (refresh, 7/30 days)
- Refresh tokens stored as bcrypt hashes, rotated on every use
- Rate limiting on all auth endpoints (express-rate-limit)
- Account lockout after 5 failed attempts (per account, not per IP)
- No user enumeration on forgot-password
- HTTPS enforced in production. HSTS header set.
- httpOnly + Secure + SameSite=Strict on refresh token cookie
- Content Security Policy headers
- Cloudinary: direct upload via signed preset — no files through PrepSync server
- Execution sandbox: network off, 256MB memory, 5s CPU, seccomp
- LiveKit: room tokens are short-lived JWTs issued per session

### Reliability

- Session state persisted on every significant event (not just on end)
- Yjs document recovered on WebSocket reconnect
- Evaluation and summariser pipelines are async (session end not blocked on AI)
- Refresh token rotation limits blast radius of stolen token
- Render free tier sleeps after 15 min inactivity → cron-job.org pings every 10 min

### Scalability path (post-MVP)

- Realtime service designed for horizontal scaling via Redis pub/sub event bus
- Analytics batch job runs independently, never on request path
- Cloudinary handles all file bandwidth — zero PrepSync server load for media
- LiveKit Cloud scales group video independently — no PrepSync infrastructure for video

---

## 15. Build Plan

### Phase 1 — Core practice (Weeks 1–3)

Phase 1 must be demo-ready before Phase 2 begins. No exceptions.

| Feature | Owner A | Owner B |
|---------|---------|---------|
| Auth: register, OTP, login, JWT, Google OAuth | ✓ | |
| Room creation + invite code/link join | ✓ | |
| WebRTC 1-on-1 video + TURN fallback | ✓ | |
| Collaborative code editor (Monaco + Yjs) | ✓ | |
| Canvas whiteboard (Fabric.js + WebSocket) | ✓ | |
| Code execution sandbox (Judge0 CE, Docker) | | ✓ |
| AI Interview Room (question → follow-up → end) | | ✓ |
| AI Evaluation Report (all 6 dimensions) | | ✓ |
| Session Summariser | | ✓ |
| Performance Dashboard (readiness + history) | | ✓ |

**Phase 1 exit criteria:**
- Complete AI interview session end-to-end (start → follow-ups → report → dashboard update)
- Complete peer room end-to-end (create → join via code → video + editor + whiteboard → end)
- Auth with Google OAuth working on a real device
- Dashboard reflecting real session data

---

### Phase 2 — Community layer (Weeks 4–6)

| Feature | Owner A | Owner B |
|---------|---------|---------|
| Domain Groups — WhatsApp-style text chat (5 groups) | ✓ | |
| Group audio/video call (LiveKit Cloud) | ✓ | |
| Persistent Study Lounge per group (LiveKit) | ✓ | |
| File sharing in groups (Cloudinary) | ✓ | |
| Polls as message type | ✓ | |
| Peer percentile batch job | | ✓ |
| Activity heatmap | | ✓ |
| Weakness radar chart (D3.js) | | ✓ |
| Weekly goals widget | | ✓ |
| Post-session peer rating | | ✓ |
| Session history search + filter | | ✓ |
| Magic link auth | | ✓ |

---

### Phase 3 — Connections + polish (Weeks 7–8)

| Feature | Owner A | Owner B |
|---------|---------|---------|
| Personal DMs — 1-on-1 chat | ✓ | |
| DM audio/video call (WebRTC) | ✓ | |
| "Create peer room" button inside DM | ✓ | |
| File sharing in DMs (Cloudinary) | ✓ | |
| Mini profile cards (for DM initiation) | ✓ | |
| Session management (revoke devices) | | ✓ |
| Readiness trend charts | | ✓ |
| AI prompt quality improvements (iterate) | | ✓ |
| Load testing + performance pass | ✓ | ✓ |

---

## 16. Free Stack

**Total monthly cost: ₹0**

### Core

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | React + TypeScript + Tailwind CSS | Free (open source) |
| State | Zustand + TanStack Query | Free (open source) |
| Charts | D3.js | Free (open source) |
| Backend | Node.js + Express | Free (open source) |
| Real-time | Socket.io | Free (open source) |
| 1-on-1 video | Native WebRTC + simple-peer | Free (browser API + open source) |
| Collaborative editor | Monaco Editor + Yjs | Free (MIT) |
| Whiteboard | Fabric.js | Free (MIT) |
| Auth library | Passport.js + bcrypt + jsonwebtoken | Free (open source) |
| Fonts | DM Sans + JetBrains Mono | Free (Google Fonts) |

### Infrastructure

| Service | Purpose | Free tier details |
|---------|---------|------------------|
| **Vercel** | Frontend hosting | Free forever — global CDN, auto-deploys from GitHub |
| **Render** | Backend services | 750 hrs/month free. Sleeps after 15 min inactivity — use cron-job.org to keep alive. |
| **MongoDB Atlas M0** | Primary database | Free forever — 512MB, no credit card |
| **Upstash Redis** | Pub/sub, session cache | Free forever — 500K commands/month |
| **Judge0 CE** | Code execution sandbox | Free — GPL-3.0 open source, self-hosted on Render free VM via Docker |
| **OpenRelayProject** | WebRTC TURN server | Free — 20GB/month relay bandwidth |
| **LiveKit Cloud** | Group video SFU | Free — 25 concurrent participants |
| **Cloudinary** | File storage (groups + rooms + DMs) | Free — 10GB storage, 25GB bandwidth/month |
| **Resend** | Transactional email (OTP, magic link, reset) | Free — 3000 emails/month |
| **GitHub Actions** | CI/CD | Free — 2000 min/month |
| **cron-job.org** | Keep Render backend awake | Free |

### AI API

| Option | Details | Use for |
|--------|---------|---------|
| **Groq API** | Free forever — 30 req/min, Llama 3.3 70B, very fast inference. console.groq.com | **Production deployment** |
| **Google Gemini 2.0 Flash** | Free — 15 req/min, 1M tokens/day. ai.google.dev | Backup / overflow |
| **Ollama** | Run Llama 3/Mistral locally — zero API calls, zero cost | **Local development** |

**Development workflow:** Use Ollama locally during development (zero API calls, zero rate limits). Switch to Groq only for deployment. You will never receive a bill.

---

## 17. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| WebRTC fails through college/corporate NAT | High | High | OpenRelayProject TURN integrated in Week 1. Test on college network immediately — not on home WiFi. |
| AI evaluation output is too generic | Medium | High | Evaluation rubric embedded in system prompt as structured schema. Manual quality testing with real users in Week 2. Iterate prompts before Phase 2. |
| CRDT editor complexity delays build | Medium | Medium | Use Yjs — do not implement CRDT from scratch. Direct Monaco integration. Document the CRDT model in architecture write-up (counts as signal). |
| Execution sandbox security | Low | High | Judge0 CE + Docker + seccomp. Network disabled, resource caps enforced. Document isolation model. |
| LiveKit Cloud group video complexity | Medium | Medium | LiveKit has excellent React SDK + documentation. Start with basic video tiles. Add advanced features (recording, layout options) only if time allows. |
| Render backend sleeps during demo | Medium | Medium | cron-job.org pings every 10 minutes. 30-second wake time if it does sleep — acceptable. |
| Scope creep kills deadline | High | High | Phase 1 freeze is strict. Nothing from Phase 2 begins until Phase 1 exit criteria are fully met. |
| Google OAuth misconfiguration | Medium | High | Test OAuth on localhost in Week 1. Authorized redirect URIs must match exactly. Test both new account and existing account flows. |
| Cloudinary free tier exceeded | Low | Low | 10GB storage + 25GB bandwidth. At student scale this takes months to approach. |
| Resend email limit exceeded | Low | Low | 3000 emails/month = ~100 new users/day. Sufficient for MVP. |
| MongoDB 512MB limit reached | Low | Low | Messages and transcripts are the biggest consumers. Add TTL index on old messages (90-day cleanup) if approaching limit. |
| Both team members blocked on same dependency | Low | High | Clear service ownership from Week 1. API contracts defined before implementation. Person B never needs to touch WebRTC. Person A never needs to touch the AI pipeline. |

---

## 18. Why this is a top-tier project

PrepSync is not a CRUD app. It is not a tutorial with a new skin. It is a distributed real-time system that requires genuine engineering decisions at every layer:

**WebRTC** — Peer-to-peer video through NAT using STUN/TURN, custom signalling server over Socket.io. Most engineers have never shipped production WebRTC. This alone is a strong interview talking point.

**CRDT (Yjs)** — Conflict-free replicated data type for real-time collaborative editing. The same data structure used in Notion, Figma, and Linear. Understanding why it exists, how it works, and what problems it solves demonstrates distributed systems knowledge.

**SFU architecture (LiveKit)** — Group video requires a Selective Forwarding Unit. Understanding the difference between peer-to-peer mesh (WebRTC) and SFU topology, and why the latter is required for 3+ participants, is the kind of architectural reasoning that impresses senior engineers.

**AI evaluation pipeline** — Not a chatbot. A structured evaluation system with typed schemas, rubric-embedded prompts, async pipeline architecture, and session context management. Demonstrates prompt engineering and AI systems thinking.

**Secure execution sandbox** — Isolated code execution with network isolation, memory caps, and CPU limits via Judge0 CE + Docker. Understanding sandboxing and resource isolation is directly applicable to cloud infrastructure work.

**OAuth 2.0 implementation** — Full Google OAuth with token exchange, account linking, rotation, httpOnly cookies, and rate limiting. Not just calling a library — understanding the full flow.

**Real-time analytics pipeline** — Session event ingestion, background aggregation jobs, percentile computation. Not vanity metrics. Demonstrates ability to design for eventual consistency and background processing.

**The design** — "Terminal Intelligence" aesthetic. Dark, precise, opinionated. Shows that this team thinks about product experience, not just functionality. Rare in student projects, memorable to evaluators.

Every one of these maps directly to production systems at top-tier companies. Every one is a genuine talking point in a technical interview. The combination makes PrepSync a standout portfolio project.

---

*PrepSync PRD v4.0 — built for students, by students. ₹0 to build and ship.*
