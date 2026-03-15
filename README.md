# Yard Sync - Horse & Yard Management MVP

Complete full-stack web application for centralized task tracking, horse records, and real-time notes.

---

## 📋 Quick Start

### 1. Environment Setup

```bash
cd app
cp .env.example .env.local
# Edit .env.local with your database URL and API keys
```

### 2. Database Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Seed test data (optional)
pnpm run db:seed
```

### 3. Development Server

```bash
pnpm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── horses/         # Horse endpoints
│   │   │   ├── tasks/          # Task endpoints
│   │   │   ├── notes/          # Notes endpoints
│   │   │   └── dashboard/      # Dashboard endpoints
│   │   ├── auth/               # Auth pages (login, register)
│   │   ├── dashboard/          # Manager dashboard
│   │   ├── horses/             # Horse management
│   │   ├── tasks/              # Task management
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   │   ├── db.ts               # Prisma client instance
│   │   ├── validations.ts      # Zod schemas
│   │   ├── errors.ts           # Error handling
│   │   ├── api-helpers.ts      # API utilities
│   │   ├── date-utils.ts       # Date formatting
│   │   └── client.ts           # Client API wrapper
│   └── middleware.ts           # Next.js middleware
├── prisma/
│   ├── schema.prisma           # Prisma data model
│   └── seed.js                 # Seed script
├── public/                     # Static assets
├── .env.example                # Environment template
├── .gitignore
├── .eslintrc.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗄️ Database

**PostgreSQL** with **Prisma ORM**

### Key Models:
- **User** - Managers, grooms, owners, professionals
- **Horse** - Core horse profiles with medical history
- **Task** - Daily/weekly/monthly recurring tasks
- **Note** - Activity feed with tags (health, training, behavior, etc)
- **Expense** - Cost tracking (feed, vet, farrier, etc)
- **Attachment** - Files linked to horses, notes, expenses

See [DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md) for full schema details.

---

## 🔐 Authentication & Authorization

**NextAuth.js** with role-based access control (RBAC)

### Roles:
- **YARD_MANAGER** - Full system access
- **GROOM** - View assigned horses, complete tasks, add notes
- **OWNER** - Read-only horse data
- **VET / FARRIER** - Temporary access to specific horses

---

## 🛣️ API Routes

### REST Endpoints:

**Horses**
- `GET /api/horses` - List horses
- `POST /api/horses` - Create horse
- `GET /api/horses/:id` - Get horse details
- `PATCH /api/horses/:id` - Update horse
- `DELETE /api/horses/:id` - Delete horse

**Tasks**
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `POST /api/tasks/:id/complete` - Mark complete

**Notes**
- `GET /api/notes` - Get notes feed
- `POST /api/notes` - Create note
- `GET /api/notes/search` - Search notes

**Dashboard**
- `GET /api/dashboard/overview` - Manager overview

See [API_ROUTES.md](../docs/API_ROUTES.md) for complete API documentation.

---

## 📱 Features

### ✅ Phase 1: Foundation
- [x] Project scaffolding
- [x] Database schema
- [x] API route structure
- [x] Authentication boilerplate
- [x] Home & auth pages
- [ ] Full NextAuth implementation
- [ ] Database connection
- [ ] API route completion

### ⏳ Phase 2: Horse Management
- [ ] Horse list & detail pages
- [ ] Medical history tracking
- [ ] Vaccination records
- [ ] Owner view (read-only)

### ⏳ Phase 3: Task System
- [ ] Daily task generation
- [ ] Task completion tracking
- [ ] Compliance dashboard
- [ ] Offline task caching

### ⏳ Phase 4: Notes & Activity
- [ ] Activity feed per horse
- [ ] Note tagging (health, training, behavior, etc)
- [ ] Photo attachments
- [ ] Note search & filtering

### ⏳ Phase 5: Manager Dashboard
- [ ] Traffic light status (🟢 🟠 🔴)
- [ ] Today's compliance %
- [ ] Alert horses
- [ ] Real-time notifications

### ⏳ Phase 6: Expense Logging
- [ ] Expense tracking
- [ ] Category breakdown
- [ ] Excel/PDF export

### ⏳ Phase 7: External Professionals
- [ ] Temporary vet/farrier access
- [ ] Report uploads
- [ ] Read-only horse data

See [BUILD_ROADMAP.md](../docs/BUILD_ROADMAP.md) for detailed timeline.

---

## 📚 Documentation

- **[TECH_STACK.md](../docs/TECH_STACK.md)** - Technology choices & architecture
- **[DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md)** - Complete Prisma schema
- **[API_ROUTES.md](../docs/API_ROUTES.md)** - REST API documentation
- **[BUILD_ROADMAP.md](../docs/BUILD_ROADMAP.md)** - 15-week implementation plan

---

## 🚀 Deployment

### Development
```bash
pnpm run dev
```

### Production Build
```bash
pnpm run build
pnpm run start
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

**Environment:**
1. Set environment variables in Vercel dashboard
2. Connect PostgreSQL database
3. Run migrations: `pnpm run db:push --skip-generate`

See [TECH_STACK.md](../docs/TECH_STACK.md#deployment-checklist) for full deployment guide.

---

## 💡 Key Architectural Decisions

### 1. Full-Stack Next.js
- Unified frontend + API in single deployment
- Reduced complexity vs separate repos
- Easy to add realtime features later

### 2. Prisma + PostgreSQL
- Type-safe database queries
- Built-in migrations
- Excellent developer experience

### 3. Mobile-First Design
- TailwindCSS responsive utilities
- Service Workers for offline mode
- Large touch targets for groom app

### 4. Minimal Dependencies
- Single Next.js framework
- Zustand for lightweight state
- Zod for validation
- No heavy UI libraries (use raw HTML + Tailwind)

---

## 🔧 Development Workflow

### Running Tests
```bash
pnpm run test          # (Coming Phase 8)
pnpm run test:e2e      # (Coming Phase 8)
```

### Database Commands
```bash
pnpm run db:studio    # Open Prisma Studio
pnpm run db:seed      # Seed test data
pnpm run db:migrate   # Interactive migration
```

### Code Quality
```bash
pnpm run lint         # ESLint
pnpm run type-check   # TypeScript check
```

---

## 📊 MVP Metrics

### Success Criteria
✅ 7 horses visible in app  
✅ Grooms complete tasks offline  
✅ Manager dashboard real-time  
✅ 80% adoption by grooms  
✅ Zero missed medication alerts  

### Performance Targets
- Page load: < 2 seconds
- API response: < 500ms
- Offline sync: < 5 seconds
- 99.5% uptime

---

## 🤝 Contributing

### Starting a New Feature
1. Create feature branch: `git checkout -b feature/horse-profiles`
2. Make changes
3. Test locally: `pnpm run dev`
4. Commit with clear messages
5. Submit pull request

### Code Standards
- TypeScript throughout
- Zod validation for inputs
- Error handling on all API routes
- Responsive design (mobile-first)

---

## 📞 Support & Questions

For implementation details, see the `/docs` folder:
- Architecture decisions
- Database design
- API specifications
- Build timeline

---

## 📄 License

Proprietary - Horse & Yard Management MVP

**Built 2026**
