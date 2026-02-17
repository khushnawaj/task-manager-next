# UI Testing Guide - New Features

This guide will walk you through testing all the new enterprise features we've implemented.

---

## 🚀 Getting Started

### 1. Verify Servers Are Running

**Check Terminal 1 (Backend):**
```
Server listening 4000
Mongo connected
```

**Check Terminal 2 (Frontend):**
```
ready - started server on 0.0.0.0:3000
```

### 2. Open the Application

Navigate to: **http://localhost:3000**

---

## ✅ Feature Testing Checklist

### 1. **Command Palette (Ctrl+K)** ⌨️

**Test Steps:**

1. **Open the app** (any page)
2. **Press `Ctrl+K`** (Windows/Linux) or `Cmd+K` (Mac)
3. **Verify:**
   - ✅ Modal appears with search input
   - ✅ Input is auto-focused (you can type immediately)
   - ✅ See actions: "My Tasks", "Dashboard", "Projects"

4. **Test Search:**
   - Type "my" → Should highlight "My Tasks"
   - Press `Enter` → Should navigate to My Tasks page

5. **Test Keyboard Navigation:**
   - Press `Ctrl+K` again
   - Use `↓` arrow key → Selection moves down
   - Use `↑` arrow key → Selection moves up
   - Press `Enter` → Navigates to selected item

6. **Test Close:**
   - Press `Ctrl+K` to open
   - Press `Esc` → Modal closes

**Expected Result:** ✅ Smooth, instant modal with keyboard navigation

---

### 2. **Keyboard Shortcuts Help (Ctrl+/)** 📖

**Test Steps:**

1. **Press `Ctrl+/`** (Windows/Linux) or `Cmd+/` (Mac)
2. **Verify:**
   - ✅ Modal appears with keyboard shortcuts list
   - ✅ Shortcuts are grouped by category:
     - Navigation
     - Task Actions
     - Views
   - ✅ Visual `<kbd>` tags for keys (e.g., `Ctrl`, `K`)

3. **Test Close:**
   - Click outside modal → Closes
   - Press `Esc` → Closes
   - Click X button → Closes

**Expected Result:** ✅ Professional shortcuts reference modal

---

### 3. **Workload Balancing Dashboard** 📊

**Test Steps:**

1. **Navigate to any project:**
   - Go to Dashboard → Click a project
   - Or use URL: `http://localhost:3000/organizations/{orgId}/projects/{projectId}`

2. **Switch to Workload View:**
   - Look for view switcher buttons (top right)
   - Click the **User icon** button (4th button)

3. **Verify Dashboard Elements:**
   - ✅ **Header:** "Team Workload" title
   - ✅ **Summary Cards (4 cards):**
     - Team Size (number of members)
     - Avg Load (average tasks per person)
     - Total Tasks
     - Overloaded (members with 12+ tasks)
   
   - ✅ **Task Distribution Section:**
     - Horizontal bars per team member
     - Color coding:
       - Green (Light: 1-3 tasks)
       - Blue (Balanced: 4-7 tasks)
       - Amber (Heavy: 8-12 tasks)
       - Red (Overloaded: 12+ tasks)
     - Task count on the right
     - Capacity badge (e.g., "Balanced")

4. **Test Hover Interaction:**
   - Hover over a team member's bar
   - **Verify:** Task breakdown appears below
     - "In Progress: X"
     - "Overdue: X" (in red if any)
     - "Completed: X"

5. **Test Alert Banner:**
   - If any member has 12+ tasks:
   - **Verify:** Red alert banner at bottom
     - "X team member(s) are overloaded..."

**Expected Result:** ✅ Clean, professional workload visualization

---

### 4. **Optimistic UI Updates** ⚡

**Test Steps:**

1. **Go to Board View:**
   - Navigate to a project
   - Click "Board" view (Kanban icon)

2. **Drag a Task:**
   - Drag a task from "To Do" to "In Progress"
   - **Verify:**
     - ✅ Task moves **instantly** (no delay)
     - ✅ Column counts update immediately
     - ✅ No loading spinner

3. **Update Task Status:**
   - Click a task to open modal
   - Change status dropdown
   - **Verify:**
     - ✅ Modal closes instantly
     - ✅ Task appears in new column immediately
     - ✅ Feels "native-app fast"

4. **Test Network Failure (Optional):**
   - Open DevTools (F12) → Network tab
   - Set throttling to "Offline"
   - Try to update a task
   - **Verify:**
     - ✅ UI updates optimistically
     - ✅ After ~2 seconds, changes revert (API failed)
     - ✅ Error toast appears

**Expected Result:** ✅ Zero perceived latency on task updates

---

### 5. **Enhanced Analytics Dashboard** 📈

**Test Steps:**

1. **Navigate to Dashboard View:**
   - Go to any project
   - Click "Dashboard" view (BarChart icon)

2. **Verify KPI Cards:**
   - ✅ **Total Tasks** (with icon)
   - ✅ **Completion Rate** (percentage)
   - ✅ **Overdue Tasks** (red if >0)
   - ✅ **Stale Tasks** (tasks not updated in 7+ days)

3. **Verify Charts:**
   - ✅ **Status Distribution** (Pie chart)
     - Shows breakdown: To Do, In Progress, Done
   - ✅ **Priority Breakdown** (Bar chart)
     - Shows: Low, Medium, High, Critical

4. **Test Alert Banner:**
   - If overdue or stale tasks exist:
   - **Verify:** Amber/Red banner appears
     - "Action Required: X overdue tasks"

**Expected Result:** ✅ Actionable metrics, not just vanity numbers

---

### 6. **Design System Improvements** 🎨

**Visual Inspection:**

1. **Color Palette:**
   - ✅ Neutral grays (Slate) for backgrounds
   - ✅ Blue/Indigo for primary buttons
   - ✅ Emerald (green) for success
   - ✅ Amber (yellow) for warnings
   - ✅ Rose (red) for errors/danger

2. **Borders vs Shadows:**
   - ✅ Cards have crisp 1px borders
   - ✅ Minimal shadows (only on hover)
   - ✅ Clean, not blurry

3. **Typography:**
   - ✅ Consistent font sizes
   - ✅ Proper hierarchy (H1 > H2 > Body)
   - ✅ Tabular numbers in metrics (aligned)

4. **Spacing:**
   - ✅ Consistent gaps (8px, 16px, 24px)
   - ✅ Not cramped, not too loose

**Expected Result:** ✅ Professional, calm, intentional design

---

### 7. **View Switching** 🔄

**Test Steps:**

1. **Navigate to a project**

2. **Test All Views:**
   - Click **Board** (Kanban icon) → Kanban board appears
   - Click **List** (List icon) → Table view appears
   - Click **Dashboard** (BarChart icon) → Analytics appear
   - Click **Workload** (User icon) → Team workload appears

3. **Verify Smooth Transitions:**
   - ✅ No page reload
   - ✅ Instant view switch
   - ✅ Active view is highlighted (white background)

**Expected Result:** ✅ Seamless view switching

---

### 8. **Micro-Interactions** ✨

**Test Animations:**

1. **Button Hover:**
   - Hover over primary button (e.g., "Add Task")
   - **Verify:**
     - ✅ Button lifts slightly (translateY)
     - ✅ Subtle shadow appears
     - ✅ Smooth transition (~150ms)

2. **Card Hover:**
   - Hover over task card
   - **Verify:**
     - ✅ Shadow increases
     - ✅ Smooth transition

3. **Modal Entrance:**
   - Open task details modal
   - **Verify:**
     - ✅ Scales from 0.95 to 1.0
     - ✅ Fades in smoothly
     - ✅ Backdrop darkens

4. **Drag Animation:**
   - Drag a task card
   - **Verify:**
     - ✅ Card scales up slightly (1.05)
     - ✅ Rotates 2 degrees
     - ✅ Shadow increases
     - ✅ On drop: Springs back smoothly

**Expected Result:** ✅ Polished, premium feel

---

## 🐛 Common Issues & Solutions

### Issue 1: "Command Palette doesn't open"

**Solution:**
- Make sure you're pressing `Ctrl+K` (not just `K`)
- Try refreshing the page (F5)
- Check browser console for errors

### Issue 2: "Workload view is blank"

**Possible Causes:**
- No team members in the organization
- No tasks assigned to anyone

**Solution:**
1. Go to "Team" page
2. Invite a team member
3. Assign some tasks to them
4. Return to Workload view

### Issue 3: "Optimistic UI not working"

**Solution:**
- Check if backend is running (port 4000)
- Open Network tab in DevTools
- Verify API calls are succeeding

### Issue 4: "Animations are laggy"

**Solution:**
- Close other browser tabs
- Disable browser extensions
- Check CPU usage

---

## 📊 Performance Testing

### Test Perceived Speed:

1. **Task Update Speed:**
   - Change task status
   - **Target:** Feels instant (<50ms perceived)

2. **View Switch Speed:**
   - Switch between Board/List/Dashboard
   - **Target:** No loading spinner, instant

3. **Command Palette:**
   - Press Ctrl+K
   - **Target:** Opens in <100ms

4. **Page Load:**
   - Navigate to project page
   - **Target:** Content visible in <2 seconds

---

## ✅ Final Checklist

Go through each feature and mark as tested:

- [ ] Command Palette (Ctrl+K) opens and works
- [ ] Keyboard Shortcuts Help (Ctrl+/) displays
- [ ] Workload Dashboard shows team distribution
- [ ] Optimistic UI updates feel instant
- [ ] Analytics Dashboard shows metrics
- [ ] All 4 views (Board/List/Dashboard/Workload) work
- [ ] Buttons have hover effects
- [ ] Modals animate smoothly
- [ ] Drag-and-drop has physics
- [ ] Colors follow Slate/Indigo palette
- [ ] No console errors in browser

---

## 🎯 Success Criteria

**Your application is production-ready if:**

✅ All features work without errors  
✅ UI feels fast and responsive  
✅ Design looks professional and consistent  
✅ Animations are smooth (not janky)  
✅ No blank screens or crashes  
✅ Command palette enhances productivity  
✅ Workload view provides actionable insights  

---

## 📸 Screenshot Checklist

Take screenshots of these views for documentation:

1. Command Palette open
2. Keyboard Shortcuts modal
3. Workload Dashboard (with data)
4. Analytics Dashboard
5. Board view with tasks
6. Task details modal

---

**Happy Testing! 🚀**

If you encounter any issues, check the browser console (F12) for error messages and refer to the troubleshooting section in the main README.
