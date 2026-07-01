# RemoteHQ

RemoteHQ is a modern **CRM + ERP** SaaS platform built with a **React/Vite** frontend and an **Express** backend. The latest release resolves critical bugs in the Deals Pipeline, automatically creates customers when a lead is marked **WON**, and fixes real‑time chat broadcasting so messages appear for all participants.

## Key Features
- **CRM Module**: Leads, Customers, Deals Kanban, Support Tickets, Activity Log.
- **Sales Automation**: Pre‑Call Summary, Conversation Insights, Task Automation (adds tasks to CRM), Recommendations (execute actions), Email Generator (send & discard drafts).
- **ERP Module**: Employees, Projects, Attendance (clock‑in/out), Finance (budget/revenue), ERP Dashboard.
- **Automation**: When a lead is marked **WON**, a customer, ERP project, finance record, and related notifications are created automatically.
- **Role‑Based Access Control**: Admin, Manager, Employee, Client roles with protected API routes and frontend routes.
- **Real‑time Notifications** via Socket.io (chat now broadcasts to all users in a channel).
- **Design System**: Dark theme, glassmorphism, purple gradient, Tailwind CSS, Framer Motion animations.
- **PostgreSQL + Prisma**: Strongly‑typed data layer.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Socket.io, Prisma, PostgreSQL
- **Auth**: JWT, middleware, RBAC

## Getting Started
```bash
# Clone the repository
git clone https://github.com/nandani013/RemoteHQ.git
cd RemoteHQ

# Install dependencies
cd backend && npm install && cd ../frontend && npm install

# Set up .env (example values)
cp backend/.env.example backend/.env   # edit DATABASE_URL, JWT_SECRET, etc.

# Run PostgreSQL (default on localhost:5432)
# Apply migrations
cd backend && npx prisma migrate dev --name init

# Start development servers
# Backend (port 5000)
npm run dev   # from backend folder
# Frontend (port 5173)
npm run dev   # from frontend folder
```

## Architecture Overview
- **API**: `/api/auth`, `/api/crm`, `/api/erp`
- **Socket.io**: `io` attached to Express app for real‑time events.
- **Prisma Models**: `Lead`, `Customer`, `Deal`, `Ticket`, `Employee`, `Project`, `FinanceRecord`, `ActivityLog`, `Notification`.
- **Frontend Routing**: Protected routes based on user role, using the `ProtectedRoute` component.

## Recent Updates (2026‑06‑04)
- Fixed **Deals Pipeline** drag‑and‑drop so status changes persist after moving a lead.
- Added automatic **Customer creation** when a lead reaches the **WON** stage.
- Corrected **Socket.io chat broadcasting** to emit messages to all participants.
- Updated **Email Generator** UI with proper Send/Discard actions.

## Contributing
1. Fork the repo.
2. Create a feature branch.
3. Ensure the code follows existing style (Tailwind, glassmorphism, etc.).
4. Submit a PR.

## License
MIT © RemoteHQ Team
