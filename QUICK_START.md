# Quick Start Guide - Fresh Database Setup

## 🚀 Step-by-Step Setup (5 minutes)

### Step 1: Clear Browser Data

1. **Open your browser** at `http://localhost:3000`
2. **Open DevTools** (Press `F12`)
3. **Go to Console tab**
4. **Run this command:**
   ```javascript
   localStorage.clear();
   window.location.reload();
   ```

This will:
- ✅ Clear old auth tokens
- ✅ Refresh the page
- ✅ Redirect you to login

---

### Step 2: Create Your Account

1. **Click "Sign Up"** (or go to `http://localhost:3000/signup`)
2. **Fill in the form:**
   - Name: `Your Name`
   - Email: `your@email.com`
   - Password: `password123`
3. **Click "Sign Up"**
4. ✅ You'll be automatically logged in

---

### Step 3: Create an Organization

1. After signup, you'll see the **Dashboard**
2. **Click "Create Organization"** button
3. **Fill in:**
   - Name: `My Company`
   - Description: `Our awesome task management workspace`
4. **Click "Create"**
5. ✅ Organization created!

---

### Step 4: Create a Project

1. **Click "New Project"** button
2. **Fill in:**
   - Name: `Website Redesign`
   - Key: `WEB` (short identifier)
   - Description: `Redesign company website`
3. **Click "Create Project"**
4. ✅ Project created!

---

### Step 5: Create Some Tasks

1. **Click the project** you just created
2. **Click "+ Add Task"** button
3. **Create 3-5 tasks:**
   
   **Task 1:**
   - Title: `Design homepage mockup`
   - Priority: `High`
   - Status: `To Do`
   - Assign to yourself
   
   **Task 2:**
   - Title: `Implement navigation bar`
   - Priority: `Medium`
   - Status: `In Progress`
   - Assign to yourself
   
   **Task 3:**
   - Title: `Write homepage copy`
   - Priority: `Low`
   - Status: `To Do`
   - Assign to yourself

4. ✅ Tasks created!

---

### Step 6: Test New Features

#### A. Test Command Palette
- Press `Ctrl+K` (or `Cmd+K` on Mac)
- ✅ Modal should appear
- Type "my" and press Enter
- ✅ Should navigate to "My Tasks"

#### B. Test Workload View
- Go to your project
- Click the **User icon** (4th view button)
- ✅ Should see workload bars with your tasks

#### C. Test Optimistic UI
- Drag a task from "To Do" to "In Progress"
- ✅ Should move instantly (no delay)
- ✅ Toast notification: "Task completed! 🎉" (if moved to Done)

#### D. Test Keyboard Shortcuts
- Press `Ctrl+/`
- ✅ Should see shortcuts modal

---

## ✅ What You Should See Now

### 1. **No Console Errors**
- Open DevTools (F12) → Console tab
- ✅ Should be clean (no red errors)

### 2. **Toast Notifications**
- Create a task → ✅ "Task created successfully"
- Mark task as done → ✅ "Task completed! 🎉"
- Delete a task → ✅ "Task archived"

### 3. **Auto-Redirect on Logout**
- If you manually clear localStorage again
- ✅ Should see: "Session expired. Please login again."
- ✅ Auto-redirects to `/login` after 1 second

---

## 🎯 Testing Checklist

- [ ] Signup works
- [ ] Login works
- [ ] Create organization works
- [ ] Create project works
- [ ] Create task works
- [ ] Command Palette (Ctrl+K) works
- [ ] Workload view shows data
- [ ] Drag-and-drop is instant
- [ ] Toast notifications appear (bottom-right)
- [ ] No console errors
- [ ] Keyboard shortcuts modal (Ctrl+/) works

---

## 🐛 If You See Errors

### "401 Unauthorized" in console
**Solution:** Run in browser console:
```javascript
localStorage.clear();
window.location.reload();
```

### "Session expired" toast appears
**Solution:** This is correct! Just login again.

### Blank screen
**Solution:**
1. Check if both servers are running
2. Refresh page (F5)
3. Check console for errors

---

## 📸 Expected UI

### Toast Notifications (Bottom-Right)
```
┌─────────────────────────────┐
│ ✓ Task created successfully │
└─────────────────────────────┘
```

### Command Palette (Ctrl+K)
```
┌─────────────────────────────┐
│ Search...                   │
├─────────────────────────────┤
│ → My Tasks                  │
│   Dashboard                 │
│   Projects                  │
└─────────────────────────────┘
```

### Workload View
```
┌─────────────────────────────┐
│ Team Size: 1  Avg Load: 3.0 │
├─────────────────────────────┤
│ Your Name                   │
│ ████████░░░░░░░░ 3 (Balanced)│
└─────────────────────────────┘
```

---

**You're all set! 🎉**

Now you have a clean database with:
- ✅ Your user account
- ✅ An organization
- ✅ A project with tasks
- ✅ All new features working
- ✅ Toast notifications
- ✅ No console errors
