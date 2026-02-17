# Enterprise SaaS Product Upgrade Blueprint
## Microsoft/Google/Linear-Level Architecture

**Role:** Principal Product Designer + Senior SaaS Architect + Staff Engineer  
**Context:** Transforming Task Manager into Production-Grade Enterprise Platform  
**Standard:** Microsoft Planner / Linear / Jira / Google Workspace

---

## 1️⃣ COMMAND CENTER DASHBOARD REDESIGN

### Role-Based Dashboard Strategy

#### **A. Executive Dashboard (C-Suite / VP-Level)**

**Primary Goal:** Strategic oversight and risk identification

**Layout:** 12-column grid, 4-row layout, high information density

**Widgets (Priority Order):**

1. **Portfolio Health Matrix** (Full width, Row 1)
   - Table view: Project | Health Score | % Complete | At Risk Tasks | Owner | Trend
   - Color coding: 🟢 Green (>80%), 🟡 Amber (50-80%), 🔴 Red (<50%)
   - Sortable columns with sticky header
   - Click project → drill into details
   - **Why:** Executives need to see everything at once, not drill down

2. **Risk Alerts Panel** (Left column, Rows 2-3)
   - Card: "5 projects have >10 overdue tasks"
   - Card: "Team velocity down 18% this sprint"
   - Card: "3 critical blockers unresolved >5 days"
   - Red/Amber color coding with action buttons
   - **Why:** Proactive problem identification

3. **Organizational Velocity** (Right column, Row 2)
   - Line chart: Tasks completed per week (last 12 weeks)
   - Trend indicator: ↑ 12% vs last month
   - Benchmark line showing target velocity
   - **Why:** Shows if org is accelerating or slowing

4. **Resource Allocation** (Right column, Row 3)
   - Stacked bar chart: Hours allocated vs available per team
   - Identifies overcommitment
   - **Why:** Prevents burnout at scale

5. **Key Metrics Bar** (Row 4, 4 cards)
   - Total Active Projects
   - Avg Cycle Time (days)
   - On-Time Delivery Rate (%)
   - Team Utilization (%)
   - **Why:** At-a-glance health check

**Visual Hierarchy:**
- Large numbers (48px) for KPIs
- Muted grays (Slate-400) for non-critical data
- Red only for alerts (never decorative)
- White space between cards (24px gap)

**Empty State:**
```
"No projects in your portfolio yet."
[Create First Project] button
Illustration: Minimalist line art of a rocket
```

**Loading State:**
- Skeleton cards with shimmer animation (1.5s loop)
- Exact shape of final content (prevents layout shift)

---

#### **B. Manager Dashboard (Team Lead / Project Manager)**

**Primary Goal:** Team performance and bottleneck identification

**Layout:** 2-column, 5-row layout, medium density

**Widgets:**

1. **Team Workload Heatmap** (Top left, 2 rows)
   - Horizontal bars per person
   - Color: Green (1-3 tasks), Blue (4-7), Amber (8-12), Red (12+)
   - Hover → see task breakdown
   - **Why:** Prevents burnout, enables rebalancing

2. **Blocked & Stale Tasks** (Top right, 2 rows)
   - List: Task Title | Days Stale | Assignee | Action
   - Click → open task modal
   - **Why:** Managers need to unblock immediately

3. **Sprint Burndown** (Bottom left)
   - Line chart: Ideal (straight diagonal) vs Actual (jagged)
   - Only if project uses sprints
   - **Why:** Agile teams need velocity tracking

4. **Cycle Time Distribution** (Bottom center)
   - Histogram: How long tasks stay in each status
   - Identifies bottlenecks (e.g., "Review" takes 5 days avg)
   - **Why:** Process optimization

5. **Recent Activity Feed** (Bottom right)
   - "Alice completed Task X"
   - "Bob commented on Y"
   - Last 10 events, real-time updates
   - **Why:** Awareness without micromanagement

**Micro-Animations:**
- Workload bars: Width transition 300ms ease-out
- New activity: Slide in from right, 200ms
- Blocked task alert: Pulse effect (scale 1.0 → 1.02 → 1.0), 400ms

---

#### **C. Contributor Dashboard ("My Focus")**

**Primary Goal:** Personal productivity and clarity

**Layout:** Single column, focused, minimal distractions

**Widgets:**

1. **Today's Commitments** (Hero section)
   - Manually curated list (drag tasks here)
   - Large checkboxes (satisfying to complete)
   - Max 5 tasks (forces prioritization)
   - **Why:** Prevents overwhelm

2. **Upcoming Deadlines** (Secondary)
   - Tasks due in next 7 days
   - Sorted by due date
   - Visual urgency indicator (red for <24hrs)
   - **Why:** Proactive planning

3. **Blocked on Me** (Tertiary)
   - Tasks waiting for my input
   - Shows who's blocked
   - **Why:** Accountability

4. **Mentions & Notifications** (Bottom)
   - "@You: Can you review this?"
   - Click → jump to comment
   - **Why:** Collaboration

**Visual Hierarchy:**
- Today's tasks: Large (18px font), bold
- Upcoming: Medium (14px), regular
- Mentions: Small (12px), italic

**Empty State:**
```
"You're all caught up! 🎉"
Subtle confetti animation (plays once, 2s duration)
```

---

### Advanced Visualizations to Add

#### **1. Cumulative Flow Diagram (CFD)**
**What:** Stacked area chart showing task count per status over time  
**Why:** Identifies bottlenecks (e.g., "Review" column growing)  
**Where:** Manager Dashboard  
**Implementation:** Query tasks grouped by status + date, render with Recharts AreaChart

#### **2. Gantt Timeline View**
**What:** Horizontal bars showing task duration + dependencies  
**Why:** Project planning and critical path analysis  
**Where:** Dedicated "Timeline" view (new tab)  
**Implementation:** Use `react-gantt-chart` or custom SVG rendering

#### **3. Task Aging Heatmap**
**What:** Calendar-style grid showing how long tasks have been open  
**Why:** Identifies stale work  
**Where:** Manager Dashboard  
**Implementation:** Color cells by age (0-7 days = green, 7-14 = amber, 14+ = red)

#### **4. Risk Indicators**
**What:** Automated flags for:
- Tasks overdue >7 days
- Tasks with no activity in 14 days
- Tasks blocked by external dependencies
- Tasks assigned to overloaded team members  
**Why:** Proactive intervention  
**Where:** Executive + Manager dashboards  
**Implementation:** Backend cron job (runs every 15 mins) calculates risk scores

---

### Layout Grid System

**12-Column Grid (Desktop):**
- Container max-width: 1440px
- Column width: (1440px - 11×24px gaps) / 12 = 98px
- Gutter: 24px
- Margin: 32px

**Responsive Breakpoints:**
- Mobile (<640px): 4-column grid, stack all widgets
- Tablet (640-1024px): 8-column grid, 2-column layout
- Desktop (>1024px): 12-column grid, full layout

**Card Sizing:**
- Small widget: 3 columns (294px)
- Medium widget: 6 columns (612px)
- Large widget: 12 columns (full width)

---

### Information Density Strategy

**Principle:** "Dense, not cluttered"

**Rules:**
1. **Compact Mode Toggle:** Allow users to switch between "Comfortable" (default) and "Compact" (high density)
2. **Progressive Disclosure:** Show essentials first, hide details until hover/click
3. **Tabular Numbers:** Use `font-variant-numeric: tabular-nums` for alignment
4. **Truncate Long Text:** Use ellipsis with tooltip on hover
5. **Icon-First Labels:** Use icons + text for status (not just text)

**Example (Task List):**
- Comfortable: 56px row height, 16px font, 12px padding
- Compact: 36px row height, 14px font, 8px padding

---

### Making It Feel Calm, Powerful, and Premium

**Calm:**
- Muted color palette (Slate grays, not vibrant)
- Generous white space (24px gaps minimum)
- Smooth animations (200-300ms, ease-out)
- No auto-playing animations (user-triggered only)

**Powerful:**
- High information density (show more data, less chrome)
- Keyboard shortcuts everywhere
- Bulk operations (multi-select)
- Customizable views (save filters)

**Premium:**
- Crisp 1px borders (not heavy shadows)
- Consistent spacing (8px grid)
- Professional typography (Inter, tight tracking)
- Subtle micro-interactions (hover states, transitions)

---

## 2️⃣ ELITE FEATURE UPGRADES

### Feature 1: **Custom Workflow Pipelines**

**What:** Allow teams to define custom statuses per project (e.g., "QA", "UAT", "Deployed")

**Why It Increases Industry Perception:**
- Shows the platform adapts to *their* process, not forces a rigid workflow
- Enterprises have unique processes (Dev vs Marketing vs Sales)
- Signals "serious software" that respects organizational complexity

**Backend Changes:**
```javascript
// Project schema
{
  workflowStatuses: [{
    id: String,
    label: String,
    color: String,
    order: Number,
    isDefault: Boolean // "todo", "done" can't be deleted
  }]
}
```
- Add `PUT /projects/:id/workflow` endpoint
- Validate task status transitions (can't move to non-existent status)

**UI/UX Impact:**
- Workflow builder modal (drag-and-drop state nodes)
- Board view dynamically renders columns based on `workflowStatuses`
- Visual editor with color picker

**Scalability:**
- Indexed queries on `task.status` (already exists)
- No performance impact (statuses stored per project, not globally)

---

### Feature 2: **Task Dependencies (Blocking Logic)**

**What:** Mark tasks as "blocked by" or "blocking" other tasks

**Why:**
- Critical for project planning (Gantt charts, critical path)
- Prevents starting work on tasks that can't be completed yet
- Shows system understands complex project orchestration

**Backend Changes:**
```javascript
// Task schema
{
  predecessors: [{ type: ObjectId, ref: 'Task' }], // Must complete before this
  successors: [{ type: ObjectId, ref: 'Task' }]    // Blocked by this
}
```
- Add `POST /tasks/:id/dependencies` endpoint
- Validation: Prevent circular dependencies (graph cycle detection)

**UI/UX Impact:**
- "Add Dependency" button in task modal
- Search/select other tasks
- Visual indicator on task card: "🔒 Blocked by 2 tasks"
- Gantt view shows dependency arrows

**Scalability:**
- Graph traversal for cycle detection (O(n) complexity)
- Limit max dependencies per task (e.g., 20) to prevent abuse

---

### Feature 3: **Recurring Tasks**

**What:** Auto-create tasks on a schedule (daily, weekly, monthly)

**Why:**
- Essential for operations teams (daily standups, weekly reports)
- Reduces manual repetitive work
- Shows platform handles long-term workflows

**Backend Changes:**
```javascript
// Task schema
{
  recurrence: {
    enabled: Boolean,
    frequency: String, // 'daily', 'weekly', 'monthly'
    interval: Number,  // Every N days/weeks/months
    endDate: Date,
    lastCreated: Date
  }
}
```
- Background cron job (runs every hour) checks `recurrence.lastCreated`
- Creates new task if interval elapsed

**UI/UX Impact:**
- "Repeat" toggle in task modal
- Frequency picker (dropdown)
- Visual badge: "🔁 Repeats weekly"

**Scalability:**
- Index on `recurrence.enabled` + `recurrence.lastCreated`
- Limit: Max 100 active recurring tasks per project

---

### Feature 4: **Advanced Filter Builder**

**What:** Visual query builder (e.g., "Status = Done AND Priority = High AND Assignee = Me")

**Why:**
- Power users need custom views
- Reduces support requests ("How do I find X?")
- Shows platform handles complexity

**Backend Changes:**
- `POST /tasks/search` endpoint with query DSL
```javascript
{
  filters: [
    { field: 'status', operator: 'eq', value: 'done' },
    { field: 'priority', operator: 'in', value: ['high', 'critical'] }
  ],
  logic: 'AND' // or 'OR'
}
```

**UI/UX Impact:**
- Filter builder modal (add/remove conditions)
- Save filters as "Smart Views" (sidebar)
- Visual chips showing active filters

**Scalability:**
- MongoDB compound indexes on common filter combinations
- Limit: Max 10 filter conditions per query

---

### Feature 5: **Bulk Task Operations**

**What:** Select multiple tasks → Change status, assignee, priority, etc.

**Why:**
- Essential for managing volume (100+ tasks)
- Reduces repetitive clicks
- Shows platform respects user's time

**Backend Changes:**
- `PUT /tasks/bulk` endpoint
```javascript
{
  taskIds: [String],
  updates: { status: 'done', assignee: 'userId' }
}
```
- Validate user has permission for all tasks

**UI/UX Impact:**
- Shift+Click to multi-select
- Floating action bar appears: "5 tasks selected"
- Dropdown: "Change Status", "Assign", "Delete"

**Scalability:**
- Limit: Max 50 tasks per bulk operation
- Use MongoDB `bulkWrite` for performance

---

### Feature 6: **Watchers / Subscribers**

**What:** Users can "watch" tasks they're not assigned to (get notifications)

**Why:**
- Stakeholders need visibility without being assignees
- Reduces "Can you keep me updated?" emails
- Shows platform supports collaboration at scale

**Backend Changes:**
```javascript
// Task schema
{
  watchers: [{ type: ObjectId, ref: 'User' }]
}
```
- `POST /tasks/:id/watch` endpoint
- Send notifications to watchers on task updates

**UI/UX Impact:**
- "Watch" button in task modal (eye icon)
- Badge: "👁️ 3 watchers"
- Watchers list in task details

**Scalability:**
- Limit: Max 20 watchers per task
- Index on `watchers` array for notification queries

---

### Feature 7: **In-App Notification Center**

**What:** Persistent inbox for @mentions, task updates, comments

**Why:**
- Reduces email noise
- Keeps users in the app (increases engagement)
- Shows platform is a "system of record"

**Backend Changes:**
```javascript
// Notification schema
{
  userId: ObjectId,
  type: String, // 'mention', 'task_assigned', 'comment'
  taskId: ObjectId,
  message: String,
  read: Boolean,
  createdAt: Date
}
```
- `GET /notifications` endpoint (paginated)
- `PUT /notifications/:id/read` endpoint
- WebSocket for real-time delivery

**UI/UX Impact:**
- Bell icon in navbar with unread count badge
- Dropdown panel (max height 400px, scrollable)
- Click notification → navigate to task + highlight comment

**Scalability:**
- TTL index: Auto-delete notifications >30 days
- Limit: Show last 50 notifications

---

### Feature 8: **Timeline View (Gantt Chart)**

**What:** Horizontal bars showing task duration + dependencies

**Why:**
- Essential for project planning
- Shows critical path
- Industry-standard view (MS Project, Jira)

**Backend Changes:**
- No schema changes (uses existing `dueDate` + `dependencies`)
- `GET /projects/:id/timeline` endpoint returns tasks with date ranges

**UI/UX Impact:**
- New view tab: "Timeline"
- Drag bars to adjust dates
- Zoom controls (day/week/month granularity)

**Scalability:**
- Render max 200 tasks in timeline (pagination)
- Use virtualization for large projects

---

### Feature 9: **Advanced Analytics (Cycle Time, Throughput)**

**What:** Metrics like:
- Avg cycle time per status
- Throughput (tasks completed per week)
- Lead time (idea → done)

**Why:**
- Agile/Lean teams need these metrics
- Shows platform supports continuous improvement
- Differentiates from basic tools

**Backend Changes:**
- Aggregate queries on `task.history` (track time in each status)
- `GET /projects/:id/analytics` endpoint

**UI/UX Impact:**
- "Analytics" tab in project view
- Line charts, histograms
- Export to CSV

**Scalability:**
- Pre-calculate metrics (background job runs nightly)
- Store in `ProjectMetrics` collection

---

### Feature 10: **Audit Retention Policies**

**What:** Auto-delete audit logs >90 days (configurable)

**Why:**
- Compliance (GDPR, SOC2)
- Reduces database size
- Shows platform is "enterprise-ready"

**Backend Changes:**
```javascript
// AuditLog schema
{
  createdAt: Date,
  expiresAt: Date // TTL index
}
```
- MongoDB TTL index on `expiresAt`

**UI/UX Impact:**
- Settings page: "Audit Retention: 90 days"
- Admin can configure (30/60/90/365 days)

**Scalability:**
- Automatic cleanup (no manual intervention)

---

### Feature 11: **Saved Views (Smart Filters)**

**What:** Save complex filter queries as sidebar items

**Why:**
- Power users create custom lenses ("My Overdue Bugs")
- Reduces repetitive filtering
- Shows platform adapts to user workflow

**Backend Changes:**
```javascript
// SavedView schema
{
  userId: ObjectId,
  name: String,
  filters: Object, // Same as Advanced Filter Builder
  projectId: ObjectId
}
```

**UI/UX Impact:**
- "Save View" button after applying filters
- Sidebar: "My Views" section
- Click → apply filters instantly

**Scalability:**
- Limit: Max 20 saved views per user

---

### Feature 12: **Role-Aware UI Personalization**

**What:** Show/hide features based on user role (e.g., "Analytics" only for managers)

**Why:**
- Reduces clutter for contributors
- Shows platform respects organizational hierarchy
- Improves onboarding (simpler UI for new users)

**Backend Changes:**
- No schema changes (uses existing RBAC)
- Frontend checks `user.role` before rendering

**UI/UX Impact:**
- Contributors: See "My Tasks", "Board", "List"
- Managers: Also see "Analytics", "Workload", "Timeline"
- Admins: Also see "Settings", "Team", "Billing"

**Scalability:**
- No performance impact (client-side logic)

---

## 3️⃣ DESIGN SYSTEM & VISUAL UPGRADE

### Color Philosophy: "Enterprise Neutral + Accent"

**Base Palette (Slate):**
```css
--gray-50:  #f8fafc  /* App background */
--gray-100: #f1f5f9  /* Card background */
--gray-200: #e2e8f0  /* Borders */
--gray-300: #cbd5e1  /* Disabled borders */
--gray-400: #94a3b8  /* Disabled text */
--gray-500: #64748b  /* Secondary text */
--gray-600: #475569  /* Primary text (body) */
--gray-700: #334155  /* Headings */
--gray-800: #1e293b  /* Strong emphasis */
--gray-900: #0f172a  /* Maximum contrast */
```

**Brand Accent (Indigo):**
```css
--brand-50:  #eef2ff
--brand-100: #e0e7ff
--brand-500: #6366f1  /* Primary buttons */
--brand-600: #4f46e5  /* Hover state */
--brand-700: #4338ca  /* Active state */
```

**Semantic Colors:**
```css
--success-500: #10b981  /* Emerald */
--warning-500: #f59e0b  /* Amber */
--danger-500:  #ef4444  /* Rose */
--info-500:    #3b82f6  /* Blue */
```

**Usage Rules:**
- Use `gray-600` for 90% of text
- Use `brand-500` only for primary actions (buttons, links)
- Never use pure black (#000) or pure white (#fff) for text
- Use semantic colors only for status, not decoration

---

### Status Color System

**Task Status:**
```css
--status-backlog:    #64748b  /* Slate-500 (passive) */
--status-todo:       #3b82f6  /* Blue-500 (planned) */
--status-inprogress: #6366f1  /* Indigo-500 (active) */
--status-review:     #f59e0b  /* Amber-500 (attention) */
--status-done:       #10b981  /* Emerald-500 (complete) */
--status-canceled:   #94a3b8  /* Gray-400 (muted) */
```

**Priority:**
```css
--priority-low:      #10b981  /* Emerald */
--priority-medium:   #3b82f6  /* Blue */
--priority-high:     #f59e0b  /* Amber */
--priority-critical: #ef4444  /* Rose */
```

---

### Typography Scale

**Font Family:** Inter (fallback: -apple-system, Segoe UI)

**Scale:**
```css
--text-xs:   10px / 14px  /* Micro labels */
--text-sm:   12px / 16px  /* Small text */
--text-base: 14px / 20px  /* Body (default) */
--text-lg:   16px / 24px  /* Large body */
--text-xl:   20px / 28px  /* H5 */
--text-2xl:  24px / 32px  /* H4 */
--text-3xl:  30px / 36px  /* H3 */
--text-4xl:  36px / 40px  /* H2 */
--text-5xl:  48px / 1     /* H1 */
```

**Font Weights:**
```css
--font-normal:   400  /* Body text */
--font-medium:   500  /* Emphasis */
--font-semibold: 600  /* Headings */
--font-bold:     700  /* Strong headings */
```

**Letter Spacing:**
```css
--tracking-tight:  -0.02em  /* Headings */
--tracking-normal:  0       /* Body */
--tracking-wide:    0.05em  /* Uppercase labels */
```

---

### Spacing System (8px Grid)

**Base Unit:** 8px

**Scale:**
```css
--space-1:  4px   /* Tight */
--space-2:  8px   /* Default gap */
--space-3:  12px  /* Comfortable */
--space-4:  16px  /* Section spacing */
--space-6:  24px  /* Card padding */
--space-8:  32px  /* Page margins */
--space-12: 48px  /* Hero spacing */
--space-16: 64px  /* Large sections */
```

**Layout Constraints:**
- Max content width: 1440px (centered)
- Sidebar width: 240px (collapsed: 64px)
- Card padding: 24px (desktop), 16px (mobile)
- Minimum touch target: 44×44px

---

### Elevation & Shadow System

**Philosophy:** Borders > Shadows (crisp, not blurry)

**Levels:**
```css
--elevation-0: border: 1px solid var(--gray-200);
--elevation-1: border: 1px solid var(--gray-200); box-shadow: 0 1px 2px rgba(0,0,0,0.05);
--elevation-2: border: 1px solid var(--gray-300); box-shadow: 0 4px 6px rgba(0,0,0,0.07);
--elevation-3: border: 1px solid var(--gray-200); box-shadow: 0 20px 25px rgba(0,0,0,0.10);
```

**Usage:**
- Level 0: Flat cards (default)
- Level 1: Hover state
- Level 2: Active/focused state
- Level 3: Modals, dropdowns

---

### Border Radius Rules

```css
--radius-sm:   4px   /* Buttons, badges */
--radius-md:   8px   /* Cards, inputs */
--radius-lg:   12px  /* Modals */
--radius-full: 9999px /* Avatars, pills */
```

**Rule:** Never mix radii within the same component

---

### Icon Style Consistency

**Library:** Lucide React

**Rules:**
- Default size: 20px (compact UI: 16px)
- Stroke width: 2px (consistent across all icons)
- Color: Inherit from parent text color
- Never use filled icons (except for active states)

**Usage:**
- Always pair icon with text label (accessibility)
- Use 16px icons for inline text (e.g., "📅 Due: Tomorrow")

---

### Data Visualization Styling

**Philosophy:** Muted, not vibrant. Data should be readable, not distracting.

**Chart Colors:**
```css
--chart-primary:   #6366f1  /* Indigo */
--chart-secondary: #64748b  /* Slate */
--chart-tertiary:  #f59e0b  /* Amber */
--chart-grid:      #e2e8f0  /* Gray-200 */
```

**Bar Charts:**
- Rounded corners: 4px
- Gap between bars: 8px

**Pie Charts:**
- Gap between slices: 2px
- Inner radius: 50% (donut style)

**Line Charts:**
- Stroke width: 2px
- No fill (transparent)
- Smooth curves (not jagged)

**Axis Labels:**
- Color: `gray-600`
- Font size: 12px

---

### Dark Mode Strategy

**Approach:** Invert grays, keep semantic colors

**Dark Palette:**
```css
--dark-bg:      #0f172a  /* gray-900 */
--dark-surface: #1e293b  /* gray-800 */
--dark-border:  #334155  /* gray-700 */
--dark-text:    #f1f5f9  /* gray-100 */
```

**Implementation:**
- Use CSS variables: `--color-bg`, `--color-text`
- Toggle via `<html class="dark">`
- Persist preference in localStorage

**Rule:** Reduce contrast slightly in dark mode (easier on eyes)

---

### Component Consistency Guidelines

**Buttons:**
```css
/* Primary */
background: var(--brand-500);
color: white;
padding: 8px 16px;
border-radius: var(--radius-sm);
font-weight: var(--font-medium);

/* Hover */
background: var(--brand-600);
transform: translateY(-1px);
box-shadow: var(--elevation-1);
transition: 150ms ease-out;
```

**Inputs:**
```css
border: 1px solid var(--gray-200);
border-radius: var(--radius-md);
padding: 8px 12px;
font-size: var(--text-base);

/* Focus */
border-color: var(--brand-500);
box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
```

**Cards:**
```css
background: white;
border: 1px solid var(--gray-200);
border-radius: var(--radius-md);
padding: var(--space-6);

/* Hover */
box-shadow: var(--elevation-1);
transition: 200ms ease-out;
```

---

## 4️⃣ UX & MICRO-INTERACTION PERFECTION

### Navigation Structure

**Hybrid: Sidebar + Contextual Top Bar**

**Sidebar (Left, 240px):**
- Logo (top)
- Search / Command Palette trigger (`Ctrl+K`)
- Favorites (starred projects)
- "My Tasks"
- "Projects" (collapsible tree)
- "Settings" (bottom)

**Behavior:**
- Collapses to 64px on narrow screens (icons only)
- Hover → expand to show labels
- Sticky (stays visible on scroll)

**Top Bar (Contextual):**
- Breadcrumbs: "Organization > Project > Board"
- View switcher: Board | List | Dashboard | Timeline
- Filters (if applicable)
- User avatar + notifications (right)

**Behavior:**
- Sticky (stays visible on scroll)
- Changes based on current page

---

### Progressive Disclosure Strategy

**Principle:** Show essentials first. Hide complexity until needed.

**Examples:**

1. **Task Card:**
   - Show: Title, assignee, due date
   - Hide until hover: Tags, description, subtask count

2. **Filters:**
   - Show: Status, Assignee (most common)
   - Hide: "Advanced Filters" button reveals Priority, Tags, Date Range

3. **Settings:**
   - Group into tabs: General, Notifications, Security
   - Don't overwhelm with one long page

---

### Command Palette Interaction Design

**Trigger:** `Ctrl+K` (Windows/Linux), `Cmd+K` (Mac)

**Features:**
- Fuzzy search: "my tasks" → "Go to My Tasks"
- Recent items: Last 5 visited projects
- Quick actions: "Create Task", "Invite User"
- Keyboard navigation: Arrow keys + Enter

**Design:**
- Modal: 600px wide, centered
- Input: Large (18px font), autofocus
- Results: Grouped by type (Projects, Tasks, Actions)
- Footer: Keyboard hints ("↑↓ to navigate, ⏎ to select")

**Animation:**
```css
/* Entrance */
opacity: 0 → 1;
scale: 0.95 → 1.0;
duration: 150ms;
easing: ease-out;

/* Exit */
opacity: 1 → 0;
scale: 1.0 → 0.95;
duration: 100ms;
easing: ease-in;
```

---

### Quick-Create Experience

**Trigger:** `Ctrl+N` or "+" button in topbar

**Design:**
- Floating modal (400px wide)
- Fields: Title (required), Project (dropdown), Assignee, Due Date
- Primary button: "Create Task" (brand-500)
- Secondary button: "Create & Add Another" (gray-600)

**Behavior:**
- Autofocus on Title input
- Press `Enter` → Create & close
- Press `Ctrl+Enter` → Create & add another

**Animation:**
```css
/* Slide down from top */
translateY: -20px → 0;
opacity: 0 → 1;
duration: 200ms;
easing: ease-out;
```

---

### Drag-and-Drop Animation Timing

**On Grab:**
```css
scale: 1.0 → 1.05;
rotate: 0deg → 2deg;
box-shadow: var(--elevation-2);
duration: 100ms;
easing: ease-out;
```

**While Dragging:**
```css
cursor: grabbing;
opacity: 0.9;
```

**On Drop:**
```css
scale: 1.05 → 1.0;
rotate: 2deg → 0deg;
duration: 300ms;
easing: spring(300, 20); /* stiffness, damping */
```

**Drop Zone Highlight:**
```css
background: var(--brand-50);
border: 2px dashed var(--brand-300);
transition: 150ms ease-out;
```

---

### Modal Animation Curves

**Entrance:**
```css
backdrop:
  opacity: 0 → 1;
  duration: 150ms;

modal:
  opacity: 0 → 1;
  scale: 0.95 → 1.0;
  duration: 200ms;
  easing: cubic-bezier(0.16, 1, 0.3, 1); /* ease-out-expo */
  
/* Stagger: Backdrop starts 50ms before modal */
```

**Exit:**
```css
modal:
  opacity: 1 → 0;
  scale: 1.0 → 0.95;
  duration: 150ms;
  easing: ease-in;

backdrop:
  opacity: 1 → 0;
  duration: 150ms;
  
/* Simultaneous (no stagger) */
```

---

### Button Hover Behavior

**Primary Button:**
```css
default:
  background: var(--brand-500);

hover:
  background: var(--brand-600);
  transform: translateY(-1px);
  box-shadow: var(--elevation-1);
  duration: 150ms;
  easing: ease-out;

active (click):
  background: var(--brand-700);
  transform: translateY(0);
  box-shadow: var(--elevation-0);
  duration: 100ms;
```

**Secondary Button:**
```css
default:
  background: var(--gray-100);
  color: var(--gray-700);

hover:
  background: var(--gray-200);
  duration: 100ms;
```

---

### Status Transition Effects

**Scenario:** Task moves from "Todo" → "In Progress"

**Visual:**
```css
badge background:
  color: blue → indigo;
  duration: 300ms;
  easing: ease-in-out;

pulse effect:
  scale: 1.0 → 1.1 → 1.0;
  duration: 400ms;
```

---

### Notification Dropdown Interaction

**Trigger:** Click bell icon

**Animation:**
```css
dropdown:
  scale: 0.95 → 1.0;
  opacity: 0 → 1;
  transform-origin: top-right;
  duration: 150ms;
  easing: ease-out;
```

**Interaction:**
- Unread: Bold text, `brand-50` background
- Read: Regular text, white background
- Hover: `gray-50` background
- Click → Mark as read + navigate to task

**Dismiss:**
- Click outside → Close
- Press `Esc` → Close

---

### Skeleton Loading Philosophy

**Rule:** Never show a blank screen or spinner.

**Implementation:**
- Render gray rectangles in exact shape of content
- Animate with shimmer effect (gradient moves left→right)
- Duration: 1.5s loop

**Example (Task List):**
```
┌─────────────────────────────┐
│ ████████░░░░░░░░░░░░░░░░░░░ │ ← Title skeleton
│ ██████░░░░░░░░░░░░░░░░░░░░░ │ ← Metadata skeleton
│ ████████░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────┘
```

---

### Perceived Performance Strategies

1. **Optimistic UI:** Update UI before API confirms. Revert on error.
2. **Prefetching:** On hover over "Projects" link, prefetch project list.
3. **Pagination:** Load 50 items initially. Infinite scroll for more.
4. **Debouncing:** Search input waits 300ms before firing API call.
5. **Caching:** Use Redux Toolkit Query cache. Stale data > no data.

---

### Role-Aware UI Personalization

**Contributor:**
- See: "My Tasks", "Board", "List"
- Hide: "Analytics", "Workload", "Settings"

**Manager:**
- See: Everything Contributors see + "Analytics", "Workload", "Timeline"
- Hide: "Billing", "Team Management"

**Admin:**
- See: Everything

**Implementation:**
```javascript
const canSeeAnalytics = ['manager', 'admin'].includes(user.role);
const canSeeBilling = user.role === 'admin';
```

---

## FINAL CHECKLIST: Production-Grade Criteria

✅ **Functionality:**
- [ ] Custom workflows
- [ ] Task dependencies
- [ ] Recurring tasks
- [ ] Advanced filters
- [ ] Bulk operations
- [ ] Notification center
- [ ] Timeline view
- [ ] Audit retention

✅ **Design:**
- [ ] Consistent color system (Slate + Indigo)
- [ ] Typography scale (Inter, 10px-48px)
- [ ] 8px spacing grid
- [ ] Crisp borders (not heavy shadows)
- [ ] Dark mode support

✅ **UX:**
- [ ] Command palette (Ctrl+K)
- [ ] Keyboard shortcuts
- [ ] Optimistic UI
- [ ] Skeleton loading
- [ ] Role-aware UI
- [ ] Progressive disclosure

✅ **Performance:**
- [ ] API rate limiting (1000 req/15m)
- [ ] Soft deletes (data recovery)
- [ ] Indexed queries (fast reads)
- [ ] Background jobs (offload heavy tasks)

✅ **Authority:**
- [ ] Audit logs (compliance)
- [ ] RBAC (security)
- [ ] Multi-tenancy (isolation)
- [ ] Scalability (handles 1000+ users)

---

**Status:** Blueprint Complete  
**Next Step:** Implement features in priority order (Custom Workflows → Dependencies → Recurring Tasks)  
**Quality Standard:** Microsoft/Google/Linear-level
