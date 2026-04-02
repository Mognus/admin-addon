# admin-addon

Frontend Add-On for the NextJS-Go Template. Provides a generic CRUD admin panel — schema-driven data tables with create, edit, delete, search, pagination, and file upload support. Works with any model registered on the backend.

**Backend dependency:** Backend API gateway exposing the admin API at `/api/admin/`. Models are defined server-side via the `go-grpc-crud` provider system — the frontend reads schema and data dynamically, no frontend changes needed when models are added.

**Requires:** `auth-addon` — admin routes must be protected by auth middleware.

---

## What's included

```
frontend/
  components/
    AdminModelView.tsx  ← Main view: table + modals wired together
    DataTable.tsx       ← Generic data table (TanStack Table)
    SchemaForm.tsx      ← Dynamic form built from backend schema
    CreateModal.tsx     ← Create record modal
    EditModal.tsx       ← Edit record modal
    DeleteModal.tsx     ← Delete confirmation modal
    AdminBreadcrumb.tsx ← Breadcrumb navigation
    ModelSidebar.tsx    ← Sidebar listing all registered models
    SearchBar.tsx       ← Search input
    FilterTags.tsx      ← Active filter tags
    ColumnToggle.tsx    ← Show/hide columns
    PaginationBar.tsx   ← Pagination controls
    FileField.tsx       ← File upload field
  hooks/
    useAdminList.ts     ← Paginated list with search + filters
    useAdminModels.ts   ← Fetch all registered models
    useAdminSchema.ts   ← Fetch schema for a model
  lib/
    api.ts              ← Client-side CRUD operations
    api-server.ts       ← Server-side: fetchModels, fetchModelSchema, fetchModelData
    buildColumns.tsx    ← Build TanStack columns from schema
    schema-to-zod.ts    ← Convert backend schema to Zod validation
    formatValue.ts      ← Format cell values by field type
  pages/
    admin-index.tsx     ← Admin landing page (select a model prompt)
    admin-model.tsx     ← Model view page — fetches schema + data, renders AdminModelView
  types/
    index.ts            ← Schema, ModelInfo, ListResponse, Field types
  index.ts              ← Barrel export
```

---

## Setup

### 1. Add as submodule

```bash
git submodule add https://github.com/Mognus/admin-addon frontend/addons/admin-addon
```

### 2. Add the admin routes

The admin panel lives under a standalone layout (no app sidebar). Create the following route files:

```tsx
// app/[locale]/(standalone)/admin/page.tsx
export { default } from "@/addons/admin-addon/frontend/pages/admin-index";
```

```tsx
// app/[locale]/(standalone)/admin/models/[model]/page.tsx
import AdminModelPage from "@/addons/admin-addon/frontend/pages/admin-model";

interface Props {
    params: Promise<{ model: string }>;
}

export default async function Page({ params }: Props) {
    const { model } = await params;
    return <AdminModelPage model={model} />;
}
```

### 3. Add the admin layout

The admin panel needs its own layout with the `ModelSidebar`. Create `app/[locale]/(standalone)/admin/layout.tsx` and use `ModelSidebar` from the addon for the navigation.

### 4. Protect routes

Admin routes should require authentication and admin role. Wire the layout to check `isAdmin` from `useAuth` (provided by `auth-addon`).

---

## Environment

The backend API gateway must expose:

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/api/models` | GET | List all registered models |
| `/api/admin/api/:model/schema` | GET | Fetch field schema for a model |
| `/api/admin/api/:model` | GET | Paginated list with search + filters |
| `/api/admin/api/:model` | POST | Create record |
| `/api/admin/api/:model/:id` | PUT | Update record |
| `/api/admin/api/:model/:id` | DELETE | Delete record |
