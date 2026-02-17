# Forge - Enterprise Task Management Platform

> A production-grade, multi-tenant SaaS task management system built with modern web technologies. Designed for teams that need Microsoft Planner/Linear/Jira-level functionality with premium UX.

[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🚀 Features

### Core Functionality
- ✅ **Multi-Tenant Architecture** - Organization → Project → Task hierarchy
- ✅ **Smart Task Management** - Priority, type, tags, due dates, subtasks
- ✅ **Real-Time Collaboration** - Comments, activity streams, WebSocket updates
- ✅ **Multiple Views** - Kanban Board, List, Analytics Dashboard, Workload View
- ✅ **Advanced Analytics** - Project metrics, team workload, completion rates
- ✅ **Role-Based Access Control (RBAC)** - Admin, Manager, Member, Observer roles

### Enterprise Features
- 🔐 **Security** - API rate limiting, soft deletes, audit logs
- 🎨 **Premium UI/UX** - Command palette (Ctrl+K), keyboard shortcuts, optimistic UI
- 📊 **Team Intelligence** - Workload balancing, overdue tracking, stale task detection
- 🔔 **Real-Time Updates** - WebSocket-powered live collaboration
- 🌙 **Modern Design** - Clean Slate/Indigo color system, responsive layout
- ⚡ **Performance** - Optimistic updates, skeleton loading, instant perceived feedback

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Features Deep Dive](#features-deep-dive)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nexus-task-manager.git
cd nexus-task-manager
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

**Server** (`server/.env`):
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Start MongoDB

```bash
# Windows (if installed as service)
net start MongoDB

# macOS/Linux
mongod --dbpath /path/to/data/db
```

### 5. Run the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Client:**
```bash
cd client
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

**Default Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 🛠️ Installation

### Detailed Setup

#### 1. Server Setup

```bash
cd server
npm install
```

**Dependencies:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `socket.io` - Real-time communication
- `express-rate-limit` - API rate limiting
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

#### 2. Client Setup

```bash
cd client
npm install
```

**Dependencies:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `@reduxjs/toolkit` - State management
- `react-redux` - Redux bindings
- `@hello-pangea/dnd` - Drag and drop
- `recharts` - Data visualization
- `framer-motion` - Animations
- `lucide-react` - Icons
- `tailwindcss` - Styling

#### 3. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath /path/to/data/db
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `server/.env`

---

## ⚙️ Configuration

### Environment Variables

#### Server Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `4000` | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret for JWT tokens | - | Yes |
| `NODE_ENV` | Environment mode | `development` | No |
| `RATE_LIMIT_MAX` | Max requests per window | `1000` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` | No |

#### Client Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` | Yes |

### Customization

#### Tailwind Colors

Edit `client/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          500: '#6366f1', // Primary brand color
          600: '#4f46e5',
          // ... other shades
        }
      }
    }
  }
}
```

#### API Rate Limiting

Edit `server/src/index.js`:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
});
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │  Redux Store │  │
│  │  (Routes)    │  │   (UI)       │  │   (State)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│                   Server (Express)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes     │  │  Middleware  │  │  Socket.io   │  │
│  │   (API)      │  │  (Auth/RBAC) │  │  (Real-time) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ Mongoose
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                     │
│  Organizations → Projects → Tasks → Comments/Logs       │
└─────────────────────────────────────────────────────────┘
```

### Data Model

```
Organization (Multi-Tenant Root)
├── members: [{ userId, role }]
├── projects: [Project]
└── settings: { ... }

Project
├── organizationId: ObjectId
├── name, key, description
├── workflowStatuses: [{ label, color }]
└── tasks: [Task]

Task
├── projectId: ObjectId
├── title, description, status
├── priority, type, tags
├── assignees: [User]
├── dueDate, createdAt, updatedAt
├── subtasks: [{ text, completed }]
├── deletedAt: Date (soft delete)
└── history: [{ field, oldValue, newValue }]

Comment
├── taskId: ObjectId
├── userId: ObjectId
├── text
└── createdAt

AuditLog
├── organizationId: ObjectId
├── actor: User
├── action: String
├── meta: Object
└── createdAt
```

### Tech Stack

**Frontend:**
- **Framework:** Next.js 13 (React 18)
- **State Management:** Redux Toolkit + RTK Query
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Drag & Drop:** @hello-pangea/dnd
- **Charts:** Recharts
- **Icons:** Lucide React

**Backend:**
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB 6+ (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken)
- **Real-time:** Socket.io
- **Security:** express-rate-limit, bcryptjs

---

## 🎯 Features Deep Dive

### 1. Command Palette (Ctrl+K)

Global keyboard navigation inspired by Linear/Notion.

**Usage:**
- Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
- Type to search: "my tasks", "dashboard", "projects"
- Arrow keys to navigate, Enter to select
- Esc to close

**Implementation:**
- Component: `client/components/CommandPalette.jsx`
- Fuzzy search through actions
- Keyboard-first navigation

### 2. Workload Balancing Dashboard

Manager-focused view showing team task distribution.

**Features:**
- Color-coded capacity indicators:
  - 🟢 **Light** (1-3 tasks)
  - 🔵 **Balanced** (4-7 tasks)
  - 🟡 **Heavy** (8-12 tasks)
  - 🔴 **Overloaded** (12+ tasks)
- Real-time alerts for overloaded members
- Hover to see task breakdown (In Progress, Overdue, Completed)

**Access:**
Project View → Click "Workload" tab (User icon)

### 3. Optimistic UI Updates

Instant perceived performance for task operations.

**How it works:**
1. User updates a task (e.g., changes status)
2. UI updates immediately (before API response)
3. API request sent in background
4. If API fails, changes are automatically reverted

**Implementation:**
- RTK Query `onQueryStarted` lifecycle
- Patches Redux cache optimistically
- Automatic rollback on error

### 4. Soft Deletes

Enterprise-grade data safety and audit compliance.

**Features:**
- Tasks are marked as deleted (not permanently removed)
- `deletedAt` timestamp field
- Filtered out from all queries automatically
- Can be restored if needed

**Schema:**
```javascript
{
  deletedAt: { type: Date, default: null, index: true }
}
```

### 5. Real-Time Collaboration

WebSocket-powered live updates.

**Features:**
- Task updates broadcast to all viewers
- Comment notifications
- Presence indicators (who's viewing)

**Implementation:**
- Socket.io rooms per project
- `useSocket` custom hook
- Automatic reconnection

### 6. Keyboard Shortcuts

Power-user productivity features.

**Global Shortcuts:**
- `Ctrl+K` - Command palette
- `Ctrl+N` - New task
- `Ctrl+/` - Keyboard shortcuts help
- `Esc` - Close modal

**Task Shortcuts (when selected):**
- `E` - Edit
- `D` - Mark as done
- `A` - Assign to me
- `Delete` - Archive

**View Shortcuts:**
- `1` - Board view
- `2` - List view
- `3` - Dashboard view
- `4` - Workload view

---

## 📡 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Tasks

#### Get Project Tasks
```http
GET /api/projects/:projectId/tasks
Authorization: Bearer <token>

Response:
[
  {
    "_id": "...",
    "title": "Implement login",
    "status": "inprogress",
    "priority": "high",
    "assignees": [...],
    "dueDate": "2026-02-20T00:00:00.000Z"
  }
]
```

#### Create Task
```http
POST /api/projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fix bug in dashboard",
  "description": "Users report blank screen",
  "status": "todo",
  "priority": "critical",
  "type": "bug",
  "assignees": ["userId1", "userId2"],
  "dueDate": "2026-02-25"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done",
  "priority": "medium"
}
```

#### Delete Task (Soft Delete)
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response:
{ "ok": true }
```

### Full API Reference

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint list.

---

## 🚢 Deployment

### Production Build

#### 1. Build Client

```bash
cd client
npm run build
npm start # Runs production server on port 3000
```

#### 2. Run Server in Production

```bash
cd server
NODE_ENV=production npm start
```

### Environment Variables (Production)

**Server:**
```env
PORT=4000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexus
JWT_SECRET=your-production-secret-key-min-32-chars
NODE_ENV=production
```

**Client:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Platforms

#### Vercel (Client)

```bash
cd client
vercel --prod
```

#### Railway/Render (Server)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### Docker

```dockerfile
# Server Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

```dockerfile
# Client Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  server:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/nexus
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:4000
    depends_on:
      - server

volumes:
  mongo-data:
```

---

## 💻 Development

### Project Structure

```
nexus-task-manager/
├── client/                 # Next.js frontend
│   ├── components/         # React components
│   │   ├── CommandPalette.jsx
│   │   ├── KeyboardShortcutsModal.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectDashboard.jsx
│   │   ├── TaskDetailsModal.jsx
│   │   ├── TaskListView.jsx
│   │   └── WorkloadDashboard.jsx
│   ├── pages/              # Next.js routes
│   │   ├── organizations/
│   │   │   └── [id]/
│   │   │       ├── index.js
│   │   │       ├── projects/
│   │   │       │   └── [projectId].js
│   │   │       ├── team.js
│   │   │       └── billing.js
│   │   ├── dashboard.js
│   │   ├── login.js
│   │   └── my-tasks.js
│   ├── store/              # Redux store
│   │   └── services/       # RTK Query APIs
│   │       ├── api.js
│   │       ├── authApi.js
│   │       ├── tasksApi.js
│   │       └── projectsApi.js
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   └── public/             # Static assets
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Organization.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Comment.js
│   │   │   └── AuditLog.js
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   ├── projects.js
│   │   │   └── organizations.js
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.js
│   │   │   └── rbac.js
│   │   └── index.js        # Server entry point
│   └── package.json
│
├── docs/                   # Documentation
│   ├── ENTERPRISE_DESIGN_BLUEPRINT.md
│   ├── ENTERPRISE_UPGRADE_BLUEPRINT.md
│   ├── PHASE_3_IMPLEMENTATION_SUMMARY.md
│   └── FULL_PROJECT_SUMMARY.md
│
└── README.md               # This file
```

### Development Workflow

#### 1. Create a Feature Branch

```bash
git checkout -b feature/task-dependencies
```

#### 2. Make Changes

```bash
# Edit files
code client/components/NewComponent.jsx
```

#### 3. Test Locally

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

#### 4. Commit and Push

```bash
git add .
git commit -m "feat: add task dependencies feature"
git push origin feature/task-dependencies
```

### Code Style

**ESLint Configuration:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

**Prettier Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Testing

```bash
# Run tests (if configured)
npm test

# Run linter
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"

**Problem:** Server can't connect to database.

**Solution:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod --dbpath /path/to/data/db

# Or if using MongoDB Atlas, verify connection string
```

#### 2. "Port 3000 already in use"

**Problem:** Another process is using port 3000.

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### 3. "getStaticPaths is not a function"

**Problem:** Next.js trying to statically generate dynamic routes.

**Solution:** Already fixed! All dynamic routes have `getServerSideProps`.

#### 4. Blank Screen After Login

**Problem:** Next.js still compiling pages.

**Solution:**
- Wait 10-15 seconds for compilation
- Refresh browser (F5)
- Check browser console for errors

#### 5. "Abort fetching component" Error

**Problem:** Navigating while Next.js is compiling.

**Solution:**
- This is normal during development
- Wait for compilation to finish
- Refresh the page

### Debug Mode

**Enable verbose logging:**

Server (`server/src/index.js`):
```javascript
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
```

Client (Browser Console):
```javascript
localStorage.setItem('debug', 'nexus:*');
```

### Performance Issues

**If the app feels slow:**

1. **Clear Next.js cache:**
```bash
cd client
rm -rf .next
npm run dev
```

2. **Check MongoDB indexes:**
```javascript
// In MongoDB shell
db.tasks.getIndexes()
```

3. **Enable React DevTools Profiler:**
- Install React DevTools extension
- Record performance
- Identify slow components

---

## 📚 Additional Resources

### Documentation

- [Enterprise Design Blueprint](./ENTERPRISE_DESIGN_BLUEPRINT.md) - Complete design system
- [Enterprise Upgrade Blueprint](./ENTERPRISE_UPGRADE_BLUEPRINT.md) - Advanced features roadmap
- [Phase 3 Summary](./PHASE_3_IMPLEMENTATION_SUMMARY.md) - Recent improvements
- [Full Project Summary](./FULL_PROJECT_SUMMARY.md) - Evolution history

### External Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Socket.io Docs](https://socket.io/docs/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Inspired by Microsoft Planner, Linear, Notion, and Jira
- Built with modern web technologies and best practices
- Designed for enterprise-grade performance and scalability

---

## 📞 Support

For support, email support@nexus.com or join our [Discord community](https://discord.gg/nexus).

---

**Made with ❤️ for teams that build great products**
