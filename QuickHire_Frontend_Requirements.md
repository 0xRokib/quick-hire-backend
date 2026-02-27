# QuickHire — Frontend Technical Requirements Specification

> **Stack:** React 19 · Vite 6 · Tailwind CSS 4 · React Router 7 · Axios · Zod · React Hook Form · Zustand 5
> **Version:** 2.0.0 | **Design Source:** Figma — QSL QuickHire | **Status:** Draft

---

## Table of Contents

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Technology Stack](#2-technology-stack)
3. [Design System & Tokens](#3-design-system--tokens)
4. [Folder Structure](#4-folder-structure)
5. [Environment Configuration](#5-environment-configuration)
6. [Routing Structure](#6-routing-structure)
7. [Pages Specification](#7-pages-specification)
   - 7.1 [Landing Page (Homepage)](#71-landing-page-homepage)
   - 7.2 [Job Listings Page](#72-job-listings-page)
   - 7.3 [Job Detail Page](#73-job-detail-page)
   - 7.4 [User Login Page](#74-user-login-page)
   - 7.5 [User Register Page](#75-user-register-page)
   - 7.6 [Admin Login Page](#76-admin-login-page)
   - 7.7 [Admin Register Page](#77-admin-register-page)
   - 7.8 [Admin Dashboard Page](#78-admin-dashboard-page)
   - 7.9 [Admin Create Job Page](#79-admin-create-job-page)
   - 7.10 [Not Found Page](#710-not-found-page)
8. [Component Architecture](#8-component-architecture)
9. [State Management](#9-state-management)
10. [API Integration Layer](#10-api-integration-layer)
11. [Form Handling & Validation](#11-form-handling--validation)
12. [Authentication Flow](#12-authentication-flow)
13. [Responsive Design Requirements](#13-responsive-design-requirements)
14. [Error Handling & UX States](#14-error-handling--ux-states)
15. [Code Quality & Conventions](#15-code-quality--conventions)
16. [Git Workflow & Commit Standards](#16-git-workflow--commit-standards)
17. [README Requirements](#17-readme-requirements)
18. [Deployment Checklist](#18-deployment-checklist)

---

## 1. Project Overview & Goals

QuickHire is a modern job board web application. The frontend is a React 19 SPA that serves two distinct user types:

- **Public users** — browse and search job listings, view job details, and submit applications.
- **Admin users** — register/login, manage job listings (create, update, delete), and review applications via a protected dashboard.

The UI must closely follow the provided Figma design, replicating its layout structure, typography, colour scheme, spacing, and overall visual feel including the landing page sections (Hero, Categories, Featured Jobs, Latest Jobs, Footer).

> **React 19 note:** Targets React 19 — `ref` as a plain prop (no `forwardRef`), improved `useTransition` for async states, `use()` hook for promise-based data.

---

## 2. Technology Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React.js | ^19.x |
| Build Tool | Vite | ^6.x |
| Routing | React Router DOM | ^7.x |
| Styling | Tailwind CSS | ^4.x — CSS-first config, no `tailwind.config.js` |
| HTTP Client | Axios | ^1.7.x |
| Server State | TanStack Query (React Query) | ^5.x |
| Form Handling | React Hook Form | ^7.54.x |
| Validation | Zod + @hookform/resolvers | ^3.24.x / ^3.9.x |
| Global State | Zustand | ^5.x — auth state only |
| Icons | Lucide React | ^0.469.x |
| Notifications | React Hot Toast | ^2.5.x |
| Date Formatting | date-fns | ^4.x |
| Linting | ESLint | ^9.x — flat config `eslint.config.js` |
| Formatting | Prettier | ^3.x |

---

## 3. Design System & Tokens

Extracted directly from the Figma design and landing page screenshot. All tokens are defined once in `src/index.css` using Tailwind v4's `@theme` directive — no separate config file.

### 3.1 Colour Palette

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* ── Brand / Primary (CTA buttons, active states, highlighted cards) ── */
  --color-primary:          #3D39D4;
  --color-primary-hover:    #322EC0;
  --color-primary-light:    #EEEEFF;

  /* ── Accent (hero "5000+ Jobs" text, links, section heading accent words) ── */
  --color-accent:           #2563EB;

  /* ── Neutrals ── */
  --color-neutral-900:      #13123A;   /* Page headings, dark nav text */
  --color-neutral-700:      #2D2D5A;   /* Sub-headings */
  --color-neutral-500:      #6B7280;   /* Body / secondary text */
  --color-neutral-300:      #D1D5DB;   /* Borders, dividers */
  --color-neutral-100:      #F3F4F6;   /* Input bg, tag fills */
  --color-neutral-50:       #FAFAFA;   /* Page background */

  /* ── Semantic ── */
  --color-success:          #16A34A;
  --color-warning:          #D97706;
  --color-danger:           #DC2626;
  --color-info:             #0284C7;

  /* ── Surface ── */
  --color-surface:          #FFFFFF;   /* Card / form backgrounds */
  --color-footer-bg:        #13123A;   /* Dark footer */

  /* ── Job Type Badge Colours ── */
  --color-badge-fulltime-bg:     #EEF2FF;
  --color-badge-fulltime-text:   #3730A3;
  --color-badge-parttime-bg:     #FFF7ED;
  --color-badge-parttime-text:   #C2410C;
  --color-badge-contract-bg:     #F0FDF4;
  --color-badge-contract-text:   #15803D;
  --color-badge-internship-bg:   #FDF4FF;
  --color-badge-internship-text: #7E22CE;

  /* ── Category Badge Colours ── */
  --color-cat-design-bg:      #EDE9FE;  /* text: #6D28D9 */
  --color-cat-engineering-bg: #DBEAFE;  /* text: #1D4ED8 */
  --color-cat-marketing-bg:   #FEF3C7;  /* text: #B45309 */
  --color-cat-finance-bg:     #DCFCE7;  /* text: #15803D */
  --color-cat-sales-bg:       #FFE4E6;  /* text: #BE123C */
  --color-cat-hr-bg:          #FEF9C3;  /* text: #854D0E */
  --color-cat-data-bg:        #CCFBF1;  /* text: #0F766E */
  --color-cat-default-bg:     #F3F4F6;  /* text: #374151 */

  /* ── Typography ── */
  --font-family-sans:    'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui;
  --font-family-display: 'Plus Jakarta Sans', ui-sans-serif;

  /* ── Shadows ── */
  --shadow-card:   0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --shadow-hover:  0 8px 24px 0 rgb(61 57 212 / 0.12);
  --shadow-modal:  0 20px 60px 0 rgb(0 0 0 / 0.18);

  /* ── Border Radius ── */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;
}
```

### 3.2 Typography

| Element | Font | Size | Weight | Colour |
|---|---|---|---|---|
| Hero H1 main | Plus Jakarta Sans | 3rem (48px) | 800 | `neutral-900` |
| Hero H1 accent ("5000+ Jobs") | Plus Jakarta Sans | 3rem (48px) | 800 | `accent` — with underline SVG decoration |
| Section H2 | Plus Jakarta Sans | 1.875rem (30px) | 700 | `neutral-900` |
| Section H2 accent word | Plus Jakarta Sans | 1.875rem (30px) | 700 | `primary` |
| Card title | Plus Jakarta Sans | 1rem (16px) | 600 | `neutral-900` |
| Card meta (company, location) | Plus Jakarta Sans | 0.875rem (14px) | 400 | `neutral-500` |
| Body / description | Plus Jakarta Sans | 0.875rem (14px) | 400 | `neutral-500` |
| Nav links | Plus Jakarta Sans | 0.875rem (14px) | 500 | `neutral-700` |
| Badge / tag | Plus Jakarta Sans | 0.75rem (12px) | 500 | varies per category |
| Button label | Plus Jakarta Sans | 0.875rem (14px) | 600 | white or varies |
| Footer body | Plus Jakarta Sans | 0.875rem (14px) | 400 | `neutral-300` |
| Footer heading | Plus Jakarta Sans | 0.875rem (14px) | 600 | white |
| Input label | Plus Jakarta Sans | 0.875rem (14px) | 500 | `neutral-700` |
| Error text | Plus Jakarta Sans | 0.75rem (12px) | 400 | `danger` |

> **Font loading** — add to `index.html`:
> ```html
> <link rel="preconnect" href="https://fonts.googleapis.com" />
> <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
> ```

### 3.3 Spacing & Layout

- **Page max-width:** `max-w-7xl mx-auto` (1280px)
- **Page horizontal padding:** `px-4 sm:px-6 lg:px-8`
- **Section vertical padding:** `py-16 lg:py-20`
- **Card padding:** `p-5 md:p-6`
- **Card grid gap:** `gap-5 md:gap-6`
- **Minimum touch target height:** `h-11` (44px) on mobile

### 3.4 Component Visual Tokens

| Component | Border | Shadow | Radius |
|---|---|---|---|
| Job card | `border border-neutral-200` | `shadow-card` → `shadow-hover` on hover | `rounded-xl` |
| Category card | `border border-neutral-200` → `border-primary` on hover | `shadow-card` | `rounded-xl` |
| Input field | `border border-neutral-300` focus `ring-2 ring-primary` | none | `rounded-lg` |
| Primary button | none | none | `rounded-lg` |
| Modal overlay | none | `shadow-modal` | `rounded-2xl` |
| Badge / tag | none | none | `rounded-full` |
| Navbar | bottom `border-b border-neutral-100` on scroll | none | none |
| Search bar container | `border border-neutral-200` | `shadow-card` | `rounded-xl` |

---

## 4. Folder Structure

Feature-first modular structure, mirroring the backend's module pattern exactly.

```
quickhire-frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── hero-person.png          # Hero illustration
│   │   └── logos/                       # Partner company SVGs
│   │
│   ├── components/                      # Shared reusable components
│   │   ├── ui/                          # Primitive UI atoms
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Modal.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx               # Public navbar
│   │   │   ├── AdminNavbar.jsx          # Admin panel navbar
│   │   │   ├── Footer.jsx               # Full 4-col footer with newsletter
│   │   │   └── AdminLayout.jsx          # Wrapper for admin pages
│   │   └── common/
│   │       ├── JobCard.jsx              # grid + list variants
│   │       ├── CategoryCard.jsx         # Explore by category card
│   │       ├── CompanyLogoStrip.jsx     # Partner logos row
│   │       ├── SearchBar.jsx            # Title + location + search button
│   │       ├── JobFilters.jsx           # Category, location, type dropdowns
│   │       ├── Pagination.jsx
│   │       ├── ProtectedRoute.jsx       # JWT guard wrapper
│   │       └── NotFoundPage.jsx
│   │
│   ├── features/
│   │   ├── landing/
│   │   │   ├── pages/
│   │   │   │   └── LandingPage.jsx
│   │   │   └── components/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── CategorySection.jsx
│   │   │       ├── PostJobsBanner.jsx
│   │   │       ├── FeaturedJobsSection.jsx
│   │   │       └── LatestJobsSection.jsx
│   │   │
│   │   ├── jobs/
│   │   │   ├── pages/
│   │   │   │   ├── JobListingsPage.jsx
│   │   │   │   └── JobDetailPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── JobList.jsx
│   │   │   │   ├── JobDetailCard.jsx
│   │   │   │   └── ApplyForm.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useJobs.js
│   │   │   │   └── useJobDetail.js
│   │   │   └── api/
│   │   │       └── jobs.api.js
│   │   │
│   │   ├── admin/
│   │   │   ├── pages/
│   │   │   │   ├── AdminLoginPage.jsx
│   │   │   │   ├── AdminRegisterPage.jsx
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   └── AdminCreateJobPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── AdminJobTable.jsx
│   │   │   │   ├── CreateJobForm.jsx
│   │   │   │   ├── DeleteJobModal.jsx
│   │   │   │   └── AdminStatsBar.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAdminJobs.js
│   │   │   └── api/
│   │   │       └── admin.api.js
│   │   │
│   │   └── auth/
│   │       ├── pages/
│   │       │   ├── LoginPage.jsx        # Public user login
│   │       │   └── RegisterPage.jsx     # Public user register
│   │       ├── hooks/
│   │       │   └── useAuth.js
│   │       ├── api/
│   │       │   └── auth.api.js
│   │       └── store/
│   │           └── authStore.js         # Zustand store (accessToken + refreshToken + user)
│   │
│   ├── lib/
│   │   ├── axios.js                     # Axios instance + interceptors
│   │   ├── queryKeys.js                 # TanStack Query key factory constants
│   │   └── utils.js                     # formatDate, formatSalary, cn()
│   │
│   ├── schemas/
│   │   ├── applyForm.schema.js
│   │   ├── createJob.schema.js
│   │   └── auth.schema.js
│   │
│   ├── hooks/
│   │   └── useDebounce.js               # Only generic hooks here — data fetching moved to TanStack Query
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                        # @import "tailwindcss" + @theme tokens
│
├── .env.example
├── eslint.config.js                     # ESLint v9 flat config
├── .prettierrc
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 5. Environment Configuration

```env
# .env.example
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

All Vite env vars must be prefixed `VITE_`. Access via `import.meta.env.VITE_API_BASE_URL`. Never commit `.env`.

### TanStack Query v5 Setup

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        1000 * 60 * 2,   // 2 min — jobs data is relatively stable
      gcTime:           1000 * 60 * 10,  // 10 min — keep unused cache for back navigation
      retry:            2,               // retry failed requests twice
      refetchOnWindowFocus: false,       // don't refetch when tab regains focus
    },
    mutations: {
      onError: () => {},                 // handled per-mutation in components
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);
```

> **TanStack Query v5 breaking changes vs v4:**
> - `cacheTime` renamed to `gcTime`.
> - `useQuery` result no longer has `isLoading` when `enabled: false` — use `isPending` instead.
> - `onSuccess` / `onError` / `onSettled` callbacks removed from `useQuery` — handle in the component or in a `useEffect` watching the result.
> - Mutations: use `mutateAsync` for promise-based flows with `try/catch`; use `mutate` for fire-and-forget.
> - `status === 'loading'` → now `status === 'pending'`.

### Query Keys Convention

All query keys are defined as constants to ensure consistency across hooks and cache invalidation:

```js
// src/lib/queryKeys.js
export const queryKeys = {
  jobs: {
    all:    () => ['jobs'],
    list:   (params) => ['jobs', 'list', params],
    detail: (id)     => ['jobs', 'detail', id],
  },
  applications: {
    all:        () => ['applications'],
    byJob:      (jobId) => ['applications', 'byJob', jobId],
  },
  auth: {
    me: () => ['auth', 'me'],
  },
};
```



---

## 6. Routing Structure

| Path | Page Component | Auth | Role | Notes |
|---|---|---|---|---|
| `/` | `LandingPage` | No | Public | Hero, categories, featured, latest jobs |
| `/jobs` | `JobListingsPage` | No | Public | Full job board with search + filters |
| `/jobs/:id` | `JobDetailPage` | No | Public | Job detail + apply form |
| `/login` | `LoginPage` | No* | Public user | Redirects to `/` if logged in |
| `/register` | `RegisterPage` | No* | Public user | Redirects to `/` if logged in |
| `/admin/login` | `AdminLoginPage` | No* | Admin | Redirects to `/admin/dashboard` if logged in |
| `/admin/register` | `AdminRegisterPage` | No* | Admin | Redirects to `/admin/dashboard` if logged in |
| `/admin/dashboard` | `AdminDashboardPage` | ✅ JWT | Admin | Job management table |
| `/admin/jobs/create` | `AdminCreateJobPage` | ✅ JWT | Admin | Create new job listing |
| `*` | `NotFoundPage` | No | — | 404 fallback |

```jsx
// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage        from '@/features/landing/pages/LandingPage';
import JobListingsPage    from '@/features/jobs/pages/JobListingsPage';
import JobDetailPage      from '@/features/jobs/pages/JobDetailPage';
import LoginPage          from '@/features/auth/pages/LoginPage';
import RegisterPage       from '@/features/auth/pages/RegisterPage';
import AdminLoginPage     from '@/features/admin/pages/AdminLoginPage';
import AdminRegisterPage  from '@/features/admin/pages/AdminRegisterPage';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AdminCreateJobPage from '@/features/admin/pages/AdminCreateJobPage';
import NotFoundPage       from '@/components/common/NotFoundPage';
import ProtectedRoute     from '@/components/common/ProtectedRoute';

const router = createBrowserRouter([
  { path: '/',                    element: <LandingPage /> },
  { path: '/jobs',                element: <JobListingsPage /> },
  { path: '/jobs/:id',            element: <JobDetailPage /> },
  { path: '/login',               element: <LoginPage /> },
  { path: '/register',            element: <RegisterPage /> },
  { path: '/admin/login',         element: <AdminLoginPage /> },
  { path: '/admin/register',      element: <AdminRegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/admin/dashboard',   element: <AdminDashboardPage /> },
      { path: '/admin/jobs/create', element: <AdminCreateJobPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

## 7. Pages Specification

### 7.1 Landing Page (Homepage)

**Route:** `/` | **Access:** Public

The main marketing and discovery page. Must faithfully replicate the Figma design sections in order.

---

#### Section A — Navbar

- **Left:** QuickHire logo (icon + wordmark).
- **Centre:** `Find Jobs` (→ `/jobs`), `Browse Companies` (static).
- **Right:** `Login` ghost button (→ `/login`), `Sign Up` filled primary button (→ `/register`).
- **Behaviour:** Sticky. On scroll > 10px add `bg-white/90 backdrop-blur-sm shadow-sm` transition.
- **Mobile:** Hamburger icon collapses centre + right links into a slide-down drawer.

---

#### Section B — Hero

Two-column layout (desktop). Left column is content, right column is decorative illustration.

**Left column content:**
- Eyebrow label: `"Discover more than"` in `text-4xl font-bold text-neutral-900`.
- Accent line: `"5000+ Jobs"` in `text-4xl font-extrabold text-accent` with a curvy SVG underline decoration below the text.
- Subtagline: `"Great platform for the job seeker that searching for new career heights and passionate about startups."` in `text-neutral-500`.
- **Search bar** component (see `SearchBar.jsx`):
  - Left input: job title / keyword with search icon.
  - Middle input: location dropdown (shows "Florence, Italy" as placeholder).
  - Right: `"Search my job"` primary button.
- Popular tags row: `"Popular:"` label + clickable pill chips: `UI Designer`, `UX Researcher`, `Android`, `Admin`. Clicking navigates to `/jobs?q=<term>`.

**Right column:** Hero person illustration + decorative geometric shapes/lines in brand colour.

**Mobile:** Stacked — text + search above image, image hidden on very small screens.

---

#### Section C — Companies Strip

- Label: `"Companies we helped grow"` in small caps, `text-neutral-400`.
- 5 company logos in a horizontal row: **Vodafone, Intel, Tesla, AMD, Talkit**.
- Rendered as grayscale (`filter: grayscale(1) opacity(0.5)`).
- Evenly spaced with `justify-between` or `gap-8`.

---

#### Section D — Explore by Category

- **Heading:** `"Explore by "` + `"category"` (in `text-primary`). `"Show all jobs →"` link on the right → `/jobs`.
- **Grid:** `grid-cols-2 md:grid-cols-4 gap-5` of `CategoryCard` components.
- **8 categories shown:** Design, Sales, Marketing, Finance, Engineering, Operations, HR, Data.
- Each `CategoryCard`: category icon (SVG/Lucide), category name (bold), `"X jobs available →"` count.
- **Highlighted state:** One card (Marketing, or whichever has most jobs) renders with `bg-primary text-white` and white icon.
- Clicking a card navigates to `/jobs?category=<category>`.
- Job counts fetched from `GET /api/v1/jobs?limit=1&category=<category>` → `pagination.total`.

---

#### Section E — Post Jobs CTA Banner

Full-width banner with `bg-primary` background and right-side decorative dashboard illustration.

- **Left:** `"Start posting jobs today"` `h2` in white + subtitle + `"Sign Up For Free"` white outline button → `/register`.
- **Right:** Dashboard screenshot mockup image.
- Rounded corners `rounded-2xl`, contained within page max-width.

---

#### Section F — Featured Jobs

- **Heading:** `"Featured "` + `"jobs"` (in `text-primary`). `"Show all jobs →"` → `/jobs`.
- **Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`.
- Fetch: `GET /api/v1/jobs?limit=8&sortBy=createdAt&order=desc`.
- Renders `JobCard` with `variant="grid"`.
- Show 8 skeleton cards while loading.

---

#### Section G — Latest Jobs Open

- **Heading:** `"Latest "` + `"jobs open"` (in `text-primary`). `"Show all jobs →"` → `/jobs`.
- **Grid:** `grid-cols-1 md:grid-cols-2 gap-4`.
- Fetch: `GET /api/v1/jobs?limit=6&sortBy=createdAt&order=desc`.
- Renders `JobCard` with `variant="list"`.

---

#### Section H — Footer

Dark background (`bg-footer-bg`), 4-column desktop grid.

| Column | Content |
|---|---|
| 1 — Brand | QuickHire logo (white), tagline, social icons (LinkedIn, Twitter, Facebook, Instagram) |
| 2 — About | Companies, Pricing, Terms, Advice, Privacy Policy |
| 3 — Resources | Help Docs, Guide, Updates, Contact Us |
| 4 — Newsletter | `"Get job notifications"` heading + subtitle + email input + `"Subscribe"` primary button |

- Bottom bar: `"© 2025 QuickHire. All rights reserved."` + social icon row.
- Link colours: `text-neutral-400 hover:text-white`.

---

### 7.2 Job Listings Page

**Route:** `/jobs` | **Access:** Public

#### Layout

Navbar → page header → sticky filter bar → job grid → pagination → footer.

#### Filter Bar

| Control | URL Param | Input Type |
|---|---|---|
| Keyword search (debounced 300ms) | `q` | text input |
| Category | `category` | select dropdown |
| Location | `location` | text input |
| Job Type | `type` | select dropdown |
| Sort | `sortBy` + `order` | select dropdown |

- All filters are URL-driven via `useSearchParams` — shareable and bookmarkable.
- Changing any filter resets `page` to `1`.
- `"Clear all filters"` button resets all params.

#### Behaviour

- Fetch `GET /api/v1/jobs` with all current URL params on every param change.
- Display skeleton cards (4×) while fetching.
- Show `EmptyState` when result array is empty.
- Show error card with `"Try Again"` on API failure.
- Pagination from `pagination.pages` response field.
- Page title: `"Find Jobs — QuickHire"`.

---

### 7.3 Job Detail Page

**Route:** `/jobs/:id` | **Access:** Public

#### Desktop Layout (3-column grid)

```
┌──────────────────────────────┬─────────────────────┐
│  Job Header                  │                     │
│  (company logo, title,       │   Apply Now Card    │
│   badges, salary, posted)    │   (sticky top-24)   │
├──────────────────────────────│                     │
│  Full Job Description        │                     │
│  (preserved whitespace)      │                     │
└──────────────────────────────┴─────────────────────┘
  col-span-2                       col-span-1
```

On mobile: description then apply form, stacked.

#### Job Header Fields

Company logo (avatar placeholder if none) · Job title `h1` · Company name · Location · `Badge` (category) · `Badge` (type) · Salary range (formatted `$80k – $120k USD`, hidden if not set) · `"Posted 3 days ago"` (via `date-fns formatDistanceToNow`).

`"← Back to jobs"` button navigates to `/jobs` preserving previous filter state.

#### Apply Now Form

| Field | Type | Validation |
|---|---|---|
| Full Name | text | Required, min 2 chars |
| Email Address | email | Required, valid email |
| Resume Link | url | Required, valid http/https URL |
| Cover Note | textarea (4 rows) | Optional, max 2000 chars + live char counter |

**Submit behaviour:**
- `POST /api/v1/applications` with `{ job: id, name, email, resumeLink, coverNote }`.
- `201` → toast success + form reset.
- `409` → toast `"You have already applied to this job."`.
- `422` → per-field inline errors from `details[]`.
- Button disabled + spinner while submitting.

**Page behaviour:**
- Fetch `GET /api/v1/jobs/:id` on mount.
- Full-page `Spinner` while loading.
- `404` from API → redirect to `NotFoundPage`.

---

### 7.4 User Login Page

**Route:** `/login` | **Access:** Public (redirect to `/` if already logged in)

- Centred card layout on `bg-neutral-50`.
- QuickHire logo at top of card.
- Heading: `"Welcome back"`, sub: `"Don't have an account?"` → link to `/register`.

| Field | Type | Validation |
|---|---|---|
| Email | email | Required, valid email |
| Password | password | Required |

**Behaviour:**
- `POST /api/v1/auth/login`.
- `200` → read `data.accessToken`, `data.refreshToken`, `data.user` from response and call `setAuth({ accessToken, refreshToken, user })` → redirect `/`.
- `401` → inline error `"Invalid email or password."`.
- Show/hide password toggle inside input.

---

### 7.5 User Register Page

**Route:** `/register` | **Access:** Public (redirect to `/` if already logged in)

| Field | Type | Validation |
|---|---|---|
| Full Name | text | Required, min 2 chars |
| Email | email | Required, valid email |
| Password | password | Required, min 8 chars |
| Confirm Password | password | Must match Password |

**Behaviour:**
- `POST /api/v1/auth/register`.
- `201` → read `data.accessToken`, `data.refreshToken`, `data.user` and call `setAuth({ accessToken, refreshToken, user })` → redirect `/`.
- `409` → inline `"An account with this email already exists."`.
- `422` → per-field errors from `details[]`.
- `"Already have an account? Login"` link → `/login`.

---

### 7.6 Admin Login Page

**Route:** `/admin/login` | **Access:** Public (redirect to `/admin/dashboard` if already logged in as admin)

- **Layout:** Split screen — left panel (brand gradient, illustration, quote), right panel (login form).
- Clearly labelled `"Admin Portal"` in the heading.
- `"← Back to site"` link → `/`.

| Field | Type | Validation |
|---|---|---|
| Email | email | Required, valid email |
| Password | password | Required |

**Behaviour:**
- `POST /api/v1/auth/login`.
- `200` → call `setAuth({ accessToken, refreshToken, user })`; allow `/admin/dashboard` only when `user.role === 'admin'`.
- `401` → inline `"Invalid credentials."`.
- `403` → show `"Admin access required."` and keep user on admin login page.
- Link to `/admin/register`.

---

### 7.7 Admin Register Page

**Route:** `/admin/register` | **Access:** Public (redirect to `/admin/dashboard` if logged in)

- Same split layout as Admin Login.
- Labelled `"Create Admin Account"`.

| Field | Type | Validation |
|---|---|---|
| Full Name | text | Required, min 2 chars |
| Email | email | Required, valid email |
| Password | password | Required, min 8 chars |
| Confirm Password | password | Must match Password |

**Behaviour:**
- `POST /api/v1/auth/register` with `{ role: "admin" }`.
- `201` → auto-login → redirect `/admin/dashboard` (only possible when creating the first account in an empty DB).
- `403` → `"Admin self-registration is disabled."` (after first user exists).
- `409` → `"An account with this email already exists."`.
- `"Already have an account? Login"` → `/admin/login`.

---

### 7.8 Admin Dashboard Page

**Route:** `/admin/dashboard` | **Access:** Protected (JWT) | **Layout:** `AdminLayout`

#### Admin Navbar
- Logo (links to `/`).
- Nav: `Dashboard` (active), `Create Job` (→ `/admin/jobs/create`).
- Right: admin name + role badge + `"Logout"` button.

#### Stats Bar (3 cards)

| Card | Data Source |
|---|---|
| Active Jobs (total) | `GET /api/v1/jobs` → `pagination.total` |
| Jobs On Current Page | `GET /api/v1/jobs` → `count` |
| Total Applications | `GET /api/v1/applications` → `pagination.total` |

#### Jobs Table

Columns: `#` · `Title` · `Company` · `Category` · `Location` · `Type` · `Status` · `Created At` · `Actions`

| Action Button | API Call | Behaviour |
|---|---|---|
| 👁 View | — | Open `/jobs/:id` in new tab |
| 🗑 Delete | Opens `DeleteJobModal` → on confirm: `DELETE /api/v1/jobs/:id` | Remove row, success toast |

- Table scrolls horizontally on mobile (`overflow-x-auto`).
- Skeleton rows while loading.
- `"+ Create New Job"` button top-right → `/admin/jobs/create`.
- Logout: `clearAuth()` → redirect `/admin/login`.

---

### 7.9 Admin Create Job Page

**Route:** `/admin/jobs/create` | **Access:** Protected | **Layout:** `AdminLayout`

| Field | Input Type | Validation |
|---|---|---|
| Job Title | text | Required, 3–100 chars |
| Company Name | text | Required, 2–100 chars |
| Location | text | Required |
| Category | select | Required, valid enum value |
| Job Type | select | Optional, default Full-Time |
| Description | textarea (6 rows min) | Required, 20–5000 chars + char counter |
| Salary Min | number | Optional, >= 0 |
| Salary Max | number | Optional, >= Salary Min |
| Currency | text | Optional, default USD |

**Behaviour:**
- `POST /api/v1/jobs` with `Authorization: Bearer <token>` (attached automatically via Axios interceptor).
- `201` → toast `"Job created successfully!"` → redirect `/admin/dashboard`.
- `422` → per-field inline errors from `details[]`.
- `401` → redirect `/admin/login` (token expired).
- `"Cancel"` button → back to `/admin/dashboard` without saving.

---

### 7.10 Not Found Page

**Route:** `*`

- Centred layout, large `"404"` in brand colour, `"Page not found"` message.
- `"Go back home"` button → `/`.
- Consistent with brand typography and colours.

---

## 8. Component Architecture

### 8.1 Principles

- **Single Responsibility** — data-fetching hooks are separate from display components.
- **Composition over configuration** — use `children` props and slot patterns.
- **No prop drilling beyond 2 levels** — use Zustand or React Context.
- **Accessibility** — `aria-label` on icon buttons, focus ring styles, keyboard navigation.

### 8.2 Key Shared Components

#### `Button.jsx`

```jsx
// src/components/ui/Button.jsx
const variants = {
  primary:   'bg-[#3D39D4] hover:bg-[#322EC0] text-white',
  secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
  outline:   'border border-[#3D39D4] text-[#3D39D4] hover:bg-[#EEEEFF]',
  ghost:     'bg-transparent hover:bg-neutral-100 text-neutral-700',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  white:     'bg-white text-[#3D39D4] hover:bg-neutral-50 border border-white',
};
const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

export default function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                  ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
```

#### `Badge.jsx` — Job Type & Category Variants

```jsx
// src/components/ui/Badge.jsx
const typeMap = {
  'Full-Time':  'bg-[#EEF2FF] text-[#3730A3]',
  'Part-Time':  'bg-[#FFF7ED] text-[#C2410C]',
  'Contract':   'bg-[#F0FDF4] text-[#15803D]',
  'Internship': 'bg-[#FDF4FF] text-[#7E22CE]',
};
const categoryMap = {
  'Design':           'bg-[#EDE9FE] text-[#6D28D9]',
  'Engineering':      'bg-[#DBEAFE] text-[#1D4ED8]',
  'Marketing':        'bg-[#FEF3C7] text-[#B45309]',
  'Finance':          'bg-[#DCFCE7] text-[#15803D]',
  'Sales':            'bg-[#FFE4E6] text-[#BE123C]',
  'HR':               'bg-[#FEF9C3] text-[#854D0E]',
  'Data':             'bg-[#CCFBF1] text-[#0F766E]',
  'Operations':       'bg-[#EEF2FF] text-[#3730A3]',
  'Legal':            'bg-[#FCE7F3] text-[#9D174D]',
  'Customer Support': 'bg-[#E0F2FE] text-[#0369A1]',
  'Product':          'bg-[#ECFCCB] text-[#3F6212]',
  'Other':            'bg-neutral-100 text-neutral-600',
};

export default function Badge({ label, variant = 'category' }) {
  const map = variant === 'type' ? typeMap : categoryMap;
  const style = map[label] || 'bg-neutral-100 text-neutral-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
```

#### `JobCard.jsx` — Grid & List Variants

```jsx
// Props: job (object), variant = "grid" | "list"
// grid  → vertical card used in Featured Jobs and Job Listings grid
// list  → horizontal row used in Latest Jobs Open
export default function JobCard({ job, variant = 'grid' }) {
  const navigate = useNavigate();
  // ... renders based on variant
}
```

**Grid card displays:** type badge (top-right pill), company logo avatar, job title, `company · location`, 2-line description snippet, category tags row, `"X days ago"`.

**List card displays (horizontal):** company logo (40px), title + `company · location` stacked, type badge + category tags row — all in a single horizontal flex row.

#### `SearchBar.jsx`

```jsx
// Props: defaultValues?, onSearch?(q, location), size="lg"|"sm"
// Used in: HeroSection (lg), JobListingsPage (sm)
```

Two inputs in a rounded container: keyword text input (left, with 🔍 icon) + location input (centre, with 📍 icon) + `"Search my job"` primary button (right). On submit navigates to `/jobs?q=...&location=...` or calls `onSearch` callback.

#### `ProtectedRoute.jsx`

```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function ProtectedRoute() {
  const { accessToken, user } = useAuthStore((s) => ({ accessToken: s.accessToken, user: s.user }));
  if (!accessToken) return <Navigate to="/admin/login" replace />;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}
```

---

## 9. State Management

Use **Zustand 5** for global auth state only. All other state is local (`useState`) or URL-driven (`useSearchParams`).

### Auth Store

```js
// src/features/auth/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user, isAuthenticated: !!accessToken }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'qh-auth',
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
```

> **Zustand v5 — multi-field selection without re-render churn:**
> ```js
> import { useShallow } from 'zustand/react/shallow';
> const { accessToken, user } = useAuthStore(
>   useShallow((s) => ({ accessToken: s.accessToken, user: s.user }))
> );
> ```

### State Ownership Table

| State | Owner | Reason |
|---|---|---|
| Access token + refresh token + user object | Zustand `authStore` (persisted) | Must survive page refresh, shared across app |
| Server data (jobs, applications) | **TanStack Query cache** | Automatic caching, deduplication, background refetch |
| Mutation loading states | TanStack Query `isPending` | Per-mutation, automatic — no `useState` needed |
| Active search/filter params | URL (`useSearchParams`) | Shareable, bookmarkable, back-button compatible |
| Modal open/close | `useState` in parent | Component-scoped UI only |
| Form data | React Hook Form `useForm` | Isolated to form lifecycle |
| Toast notifications | React Hot Toast | Imperative API, no store needed |

---

## 10. API Integration Layer

### Axios Instance

```js
// src/lib/axios.js
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT on every request automatically
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Global 401 handler — clear auth and redirect
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      const isAdminPath = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPath ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Feature API Modules (pure async functions — no state)

```js
// src/features/jobs/api/jobs.api.js
import api from '@/lib/axios';
export const getJobs            = (params)  => api.get('/jobs', { params }).then(r => r.data);
export const getJobById         = (id)      => api.get(`/jobs/${id}`).then(r => r.data);
export const submitApplication  = (data)    => api.post('/applications', data).then(r => r.data);
```

```js
// src/features/admin/api/admin.api.js
import api from '@/lib/axios';
export const adminGetJobs        = (params)     => api.get('/jobs', { params }).then(r => r.data);
export const createJob           = (data)       => api.post('/jobs', data).then(r => r.data);
export const updateJob           = (id, data)   => api.patch(`/jobs/${id}`, data).then(r => r.data);
export const deleteJob           = (id)         => api.delete(`/jobs/${id}`).then(r => r.data);
export const getApplications     = (params)     => api.get('/applications', { params }).then(r => r.data);
export const getJobApplications  = (jobId)      => api.get(`/jobs/${jobId}/applications`).then(r => r.data);
export const updateAppStatus     = (id, status) => api.patch(`/applications/${id}/status`, { status }).then(r => r.data);
```

```js
// src/features/auth/api/auth.api.js
import api from '@/lib/axios';
export const login    = (data) => api.post('/auth/login', data).then((r) => r.data.data);
export const register = (data) => api.post('/auth/register', data).then((r) => r.data.data);
export const refresh  = (data) => api.post('/auth/refresh', data).then((r) => r.data.data);
export const logout   = ()     => api.post('/auth/logout').then((r) => r.data);
export const getMe    = ()     => api.get('/auth/me').then((r) => r.data.data);
```

### TanStack Query Hooks

> **TanStack Query v5 key changes vs v4:**
> - `cacheTime` → renamed to `gcTime`.
> - `isLoading` → use `isPending` (also works when `enabled: false`).
> - `onSuccess` / `onError` removed from `useQuery` — handle side-effects in components or `useEffect`.
> - `keepPreviousData` → replaced by `placeholderData: (prev) => prev`.
> - Mutations: use `mutateAsync` + `try/catch` for async flows; `mutate` for fire-and-forget.

#### Query Key Factory

```js
// src/lib/queryKeys.js
export const queryKeys = {
  jobs: {
    all:    ()       => ['jobs'],
    list:   (params) => ['jobs', 'list', params],
    detail: (id)     => ['jobs', 'detail', id],
  },
  applications: {
    all:   ()       => ['applications'],
    byJob: (jobId)  => ['applications', 'byJob', jobId],
  },
  auth: {
    me: () => ['auth', 'me'],
  },
};
```

#### Jobs — useJobs (URL-driven)

```js
// src/features/jobs/hooks/useJobs.js
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../api/jobs.api';
import { queryKeys } from '@/lib/queryKeys';

export function useJobs() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);

  return useQuery({
    queryKey:        queryKeys.jobs.list(params),
    queryFn:         () => getJobs(params),
    placeholderData: (prev) => prev,   // show stale data while new page loads
  });
  // result.data.data        → job array
  // result.data.pagination  → { total, page, limit, pages }
  // result.isPending        → true only on first load (no cache)
  // result.isFetching       → true on every background refetch
}
```

#### Jobs — useJobDetail

```js
// src/features/jobs/hooks/useJobDetail.js
import { useQuery } from '@tanstack/react-query';
import { getJobById } from '../api/jobs.api';
import { queryKeys } from '@/lib/queryKeys';

export function useJobDetail(id) {
  return useQuery({
    queryKey:  queryKeys.jobs.detail(id),
    queryFn:   () => getJobById(id),
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,   // job detail stays fresh for 5 min
  });
}
```

#### Landing Page — Featured & Latest Jobs

```js
// src/features/landing/hooks/useLandingJobs.js
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/features/jobs/api/jobs.api';
import { queryKeys } from '@/lib/queryKeys';

const FEATURED_PARAMS = { limit: 8,  sortBy: 'createdAt', order: 'desc' };
const LATEST_PARAMS   = { limit: 6,  sortBy: 'createdAt', order: 'desc' };

export const useFeaturedJobs = () =>
  useQuery({
    queryKey:  queryKeys.jobs.list(FEATURED_PARAMS),
    queryFn:   () => getJobs(FEATURED_PARAMS),
    staleTime: 1000 * 60 * 5,
  });

export const useLatestJobs = () =>
  useQuery({
    queryKey:  queryKeys.jobs.list(LATEST_PARAMS),
    queryFn:   () => getJobs(LATEST_PARAMS),
    staleTime: 1000 * 60 * 5,
  });
```

#### Admin — useAdminJobs (Queries + Mutations)

```js
// src/features/admin/hooks/useAdminJobs.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminGetJobs, createJob, updateJob, deleteJob } from '../api/admin.api';
import { queryKeys } from '@/lib/queryKeys';

export function useAdminJobs(params = {}) {
  return useQuery({
    queryKey: queryKeys.jobs.list(params),
    queryFn:  () => adminGetJobs(params),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
      toast.success('Job created successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create job'),
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateJob(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
      toast.success('Job updated successfully');
    },
    onError: () => toast.error('Failed to update job'),
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
      toast.success('Job deleted successfully');
    },
    onError: () => toast.error('Failed to delete job'),
  });
}
```

#### Submit Application — Mutation

```js
// src/features/jobs/hooks/useSubmitApplication.js
import { useMutation } from '@tanstack/react-query';
import { submitApplication } from '../api/jobs.api';

export function useSubmitApplication() {
  return useMutation({ mutationFn: submitApplication });
  // onSuccess/onError handled in component for form reset + specific toasts
}
```

#### Component Usage Pattern

```jsx
// JobDetailPage.jsx
const { mutateAsync: apply, isPending: isApplying } = useSubmitApplication();

const onSubmit = async (data) => {
  try {
    await apply({ ...data, job: id });
    toast.success('Application submitted! Good luck 🎉');
    reset();
  } catch (err) {
    if (err.response?.status === 409) toast.error('You have already applied to this job.');
    else toast.error(err.response?.data?.error || 'Something went wrong.');
  }
};

// AdminDashboardPage.jsx
const { data, isPending, isError, refetch } = useAdminJobs();
const { mutate: remove }                    = useDeleteJob();
// isPending → show skeleton rows
// isError   → show error card with refetch() retry
// data.data → job array for table
```

### useDebounce Hook

```js
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

---

## 11. Form Handling & Validation

Use **React Hook Form 7.54** + **Zod 3.24** resolvers. All schemas in `src/schemas/`.

### Apply Form Schema

```js
// src/schemas/applyForm.schema.js
import { z } from 'zod';
export const applyFormSchema = z.object({
  name:       z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email:      z.string().email('Please enter a valid email address'),
  resumeLink: z.string().url('Must be a valid URL starting with http:// or https://'),
  coverNote:  z.string().max(2000, 'Cover note cannot exceed 2000 characters').optional(),
});
```

### Create Job Schema

```js
// src/schemas/createJob.schema.js
import { z } from 'zod';
const CATEGORIES = ['Engineering','Design','Marketing','Finance','Operations',
                    'Sales','HR','Legal','Customer Support','Data','Product','Other'];
const TYPES = ['Full-Time','Part-Time','Contract','Internship'];

export const createJobSchema = z.object({
  title:       z.string().trim().min(3, 'Min 3 characters').max(100),
  company:     z.string().trim().min(2).max(100),
  location:    z.string().trim().min(1, 'Location is required'),
  category:    z.enum(CATEGORIES, { errorMap: () => ({ message: 'Select a valid category' }) }),
  type:        z.enum(TYPES).default('Full-Time'),
  description: z.string().trim().min(20, 'Min 20 characters').max(5000),
  salaryMin:   z.coerce.number().min(0).optional().or(z.literal('')),
  salaryMax:   z.coerce.number().min(0).optional().or(z.literal('')),
  currency:    z.string().length(3, 'Must be 3-char ISO code').default('USD'),
}).refine(
  (d) => !d.salaryMin || !d.salaryMax || Number(d.salaryMax) >= Number(d.salaryMin),
  { message: 'Max salary must be >= min salary', path: ['salaryMax'] }
);
```

### Auth Schemas

```js
// src/schemas/auth.schema.js
import { z } from 'zod';
export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Min 8 characters'),
});
export const registerSchema = z.object({
  name:            z.string().trim().min(2, 'Min 2 characters'),
  email:           z.string().email('Enter a valid email'),
  password:        z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Standard Usage Pattern

```jsx
const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(applyFormSchema),
});
```

---

## 12. Authentication Flow

```
┌───────────────────────────────────────────────────────────────────┐
│  USER REGISTER:   /register → POST /auth/register                 │
│    201 → setAuth({ accessToken, refreshToken, user }) → '/'       │
│    409 → inline: "An account with this email already exists."     │
│    422 → per-field errors from details[]                          │
│                                                                   │
│  USER LOGIN:      /login → POST /auth/login                       │
│    200 → setAuth({ accessToken, refreshToken, user }) → '/'       │
│    401 → inline: "Invalid email or password."                     │
│                                                                   │
│  ADMIN REGISTER:  /admin/register → POST /auth/register           │
│    send { role: 'admin' }                                          │
│    201 → first account only → '/admin/dashboard'                  │
│    403 → "Admin self-registration is disabled."                   │
│                                                                   │
│  ADMIN LOGIN:     /admin/login → POST /auth/login                 │
│    200 → if user.role==='admin' → '/admin/dashboard'              │
│    401 → inline: "Invalid credentials."                           │
│    403 → inline: "Admin access required."                         │
│                                                                   │
│  LOGOUT:          clearAuth() → localStorage cleared              │
│                   → navigate('/admin/login')                      │
│                                                                   │
│  TOKEN REFRESH:   POST /auth/refresh with refreshToken            │
│    200 → rotate { accessToken, refreshToken }                     │
│                                                                   │
│  EXPIRED TOKEN:   Axios 401 interceptor                           │
│    clearAuth() + redirect '/admin/login' or '/login'              │
└───────────────────────────────────────────────────────────────────┘
```

**Token persistence:** Zustand `persist` middleware → `localStorage` key `qh-auth`. Auto-rehydrates on app boot. No manual check needed.

**Axios auto-attach:** Request interceptor reads `useAuthStore.getState().accessToken` on every outgoing request. Adds `Authorization: Bearer <accessToken>` header automatically.

---

## 13. Responsive Design Requirements

| Breakpoint | Width | Key changes |
|---|---|---|
| Mobile | < 640px | Single column, hamburger nav, stacked hero, filters vertical |
| Tablet | 640–1024px | 2-col grids, partial nav, side-by-side filters |
| Desktop | > 1024px | 3–4 col grids, full nav, split job detail layout |

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navbar | Hamburger drawer | Hamburger or compact | Full horizontal |
| Hero | Stacked (text → image hidden) | Stacked | 2-col split |
| Category grid | `grid-cols-2` | `grid-cols-4` | `grid-cols-4` |
| Featured jobs | `grid-cols-1` | `grid-cols-2` | `grid-cols-4` |
| Latest jobs | `grid-cols-1` | `grid-cols-2` | `grid-cols-2` |
| Job listings | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| Job detail | Stacked | Stacked | `grid-cols-3` (2+1) |
| Admin table | `overflow-x-auto` | Full | Full |
| Filter bar | Stacked col | Flex row | Flex row |
| Auth pages | Full-width card | Centred card | Split layout |
| Footer cols | `grid-cols-1` | `grid-cols-2` | `grid-cols-4` |
| Touch targets | min `h-11` (44px) | — | — |

---

## 14. Error Handling & UX States

### Loading States

| Component | Loading UI |
|---|---|
| Job listings grid | 6× `Skeleton` card placeholders (`animate-pulse`) |
| Job detail | Full-page centred `Spinner` |
| Admin jobs table | 5× skeleton table rows |
| Featured / Latest sections | 4× / 6× skeleton cards |
| Form submit button | Disabled + `Spinner` inside button label |
| Stats bar numbers | Skeleton number placeholder |
| Category job counts | `"— jobs"` placeholder while loading |

### Empty States

| Scenario | Message | CTA |
|---|---|---|
| No jobs match filters | `"No jobs found for your search"` | `"Clear Filters"` button |
| Empty admin jobs table | `"No job listings yet"` | `"Create your first job"` button |
| No applications (admin) | `"No applications received yet"` | — |

### Error States

| Scenario | Behaviour |
|---|---|
| Listings API fails | Error card + `"Try Again"` retry button |
| Job detail 404 | Redirect to `NotFoundPage` |
| Form submit 422 | Per-field inline errors from `details[]` array |
| Form submit 409 | Specific toast message |
| Form submit 401 | Redirect to `/admin/login` |
| Form submit 5xx | Toast `"Something went wrong. Please try again."` |
| Axios timeout (>10s) | Toast `"Request timed out. Check your connection."` |

### UX Micro-Interactions

- Job cards: `hover:scale-[1.01] transition-transform duration-200` + `shadow-hover`.
- Category cards: `hover:border-primary transition-colors`.
- Buttons: `transition-colors duration-150` on all state changes.
- Delete: always requires a confirmation `Modal` — no direct destructive action.
- Search: 300ms debounce before triggering API call.
- Toasts: positioned top-right, auto-dismiss after 4s.
- Char counters: live on cover note and description textareas.
- Sticky apply form sidebar (desktop) scrolls with content until footer.

---

## 15. Code Quality & Conventions

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Page components | PascalCase + `Page` suffix | `JobListingsPage.jsx` |
| Other components | PascalCase | `JobCard.jsx`, `ApplyForm.jsx` |
| Hooks | camelCase + `use` prefix | `useJobs.js` |
| API modules | camelCase + `.api.js` suffix | `jobs.api.js` |
| Zod schemas | camelCase + `.schema.js` suffix | `applyForm.schema.js` |
| Zustand stores | camelCase + `Store.js` suffix | `authStore.js` |
| Constants | `UPPER_SNAKE_CASE` | `CATEGORY_ENUM` |
| CSS classes | Tailwind utility classes only | — |

### Component Rules

- Functional components only — no class components.
- Default export for page/component files; named exports for hooks and utilities.
- Destructure all props at the function signature.
- Every data-fetching component handles `loading`, `error`, and `empty`.
- No hardcoded API URLs — always use shared `apiClient`.
- No `console.log` in production code.

### ESLint v9 Flat Config

```js
// eslint.config.js
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react: reactPlugin, 'react-hooks': reactHooks },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react/self-closing-comp': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: { react: { version: 'detect' } },
  },
];
```

---

## 16. Git Workflow & Commit Standards

```
<type>(<scope>): <short description>
Types: feat | fix | style | refactor | chore | test | docs
```

### Example Commit History

```
chore(init): scaffold Vite 6 + React 19 + Tailwind v4 project
chore(deps): add react-router-dom v7, axios, zustand v5
chore(deps): add @tanstack/react-query v5 and react-query-devtools
chore(deps): add react-hook-form, zod, @hookform/resolvers
feat(design): add design tokens to index.css using @theme directive
feat(query): set up QueryClient with defaultOptions and QueryClientProvider
feat(query): add queryKeys factory for jobs, applications, and auth
feat(layout): build Navbar with mobile hamburger and sticky scroll
feat(layout): build Footer with 4-column grid and newsletter input
feat(landing): implement HeroSection with SearchBar and popular tags
feat(landing): add CompanyLogoStrip and CategorySection components
feat(landing): build FeaturedJobsSection using useFeaturedJobs hook
feat(landing): build LatestJobsSection using useLatestJobs hook
feat(jobs): implement JobListingsPage with URL-driven useJobs hook
feat(jobs): build JobCard component with grid and list variants
feat(jobs): add JobDetailPage with useJobDetail hook and ApplyForm
feat(jobs): add useSubmitApplication mutation with toast feedback
feat(auth): implement LoginPage and RegisterPage with Zod validation
feat(auth): build AdminLoginPage and AdminRegisterPage (split layout)
feat(auth): set up Zustand authStore with persist middleware
feat(auth): add ProtectedRoute and Axios JWT interceptors
feat(admin): build AdminDashboardPage with useAdminJobs query hook
feat(admin): add useCreateJob, useDeleteJob, and useUpdateJob mutations
feat(admin): implement DeleteJobModal with useDeleteJob mutation
feat(admin): add AdminCreateJobPage with useCreateJob mutation
fix(jobs): debounce search input to prevent query key thrashing
fix(auth): redirect to dashboard if token exists on admin login page
docs(readme): add setup, env, routes, and demo link
```

---

## 17. README Requirements

1. Project title + one-line description
2. Demo screenshot or GIF of the landing page
3. Tech stack table with versions
4. Prerequisites (Node.js >= 18, backend repo running)
5. Installation: `git clone` → `npm install`
6. Environment: copy `.env.example` → `.env`, table of all variables
7. Run dev: `npm run dev` (port 5173)
8. Build: `npm run build` + `npm run preview`
9. Routes table (path → page → access level)
10. Folder structure snippet
11. Backend API dependency note + backend repo link
12. Live demo link (if deployed)

---

## 18. Deployment Checklist

Recommended: **Vercel** (frontend).

- [ ] `VITE_API_BASE_URL` set to production backend URL in Vercel environment settings
- [ ] Backend `ALLOWED_ORIGIN` updated to Vercel deployment URL
- [ ] `npm run build` succeeds locally with no errors or warnings
- [ ] All routes work on hard refresh (Vercel handles SPA rewrites automatically)
- [ ] Images and fonts load correctly in production build
- [ ] No `.env` file committed — only `.env.example`
- [ ] Lighthouse scores: Performance >= 80, Accessibility >= 90
- [ ] Tested on: mobile 375px, tablet 768px, desktop 1440px
- [ ] README updated with live demo URL

---

*QuickHire Frontend Technical Requirements Specification — v2.0.0*
*Design Reference: Figma — QSL QuickHire | Paired Backend Spec: v1.0.0*
