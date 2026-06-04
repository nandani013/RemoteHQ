# RemoteHQ is a modern **CRM + ERP** SaaS platform built on a **React/Vite** frontend and an **Express** backend. Recent updates wire up all sales‑automation action buttons (Add to CRM, Execute Recommendation, Send/Discard Email) and finalize the CRM API endpoints, providing a fully functional end‑to‑end workflow.

## Key Features
- **CRM Module**: Leads, Customers, Deals Kanban, Support Tickets, Activity Log.
- **Sales Automation**: Pre‑Call Summary, Conversation Insights, Task Automation (adds tasks to CRM), Recommendations (execute actions), Email Generator (send & discard drafts).
- **ERP Module**: Employees, Projects, Attendance (clock‑in/out), Finance (budget/revenue), ERP Dashboard.
- **Automation**: When a lead is marked **WON**, a customer, ERP project, finance record, and related notifications are created automatically.
- **Role‑Based Access Control**: Admin, Manager, Employee, Client roles with protected API routes and frontend routes.
- **Real‑time Notifications** via Socket.io.
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
- **Socket.io**: `io` attached to express app for real‑time events.
- **Prisma Models**: `Lead`, `Customer`, `Deal`, `Ticket`, `Employee`, `Project`, `FinanceRecord`, `ActivityLog`, `Notification`.
- **Frontend Routing**: Protected routes based on user role, using the `ProtectedRoute` component.

## Contributing
1. Fork the repo.
2. Create a feature branch.
3. Ensure the code follows existing style (Tailwind, glassmorphism, etc.).
4. Submit a PR.

## License
MIT © RemoteHQ Team
