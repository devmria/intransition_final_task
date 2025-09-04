# Intransition Project

## Project Structure

The project is organized as a monorepo with shared types:

```
intransition_final/
├── packages/
│   └── shared-types/          # Common TypeScript types
├── server/                    # Backend (Node.js + Express + Prisma)
├── client/                    # Frontend (React + Vite)
└── package.json              # Root workspace config
```