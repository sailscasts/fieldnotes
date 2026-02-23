# FieldNotes — Research & Implementation Plan

> A personal knowledge + activity tracker built on The Boring JavaScript Stack.
> Notes, Tasks, Logs, Bookmarks, Journal entries — all in one place.

---

## 1. What We Already Have (Scaffold)

The project is bootstrapped from the **Mellow Vue** template. Here's what's already wired up and ready:

### Authentication (Complete)

- **Email/Password signup** with email verification (24h token TTL)
- **Google OAuth** via `sails-hook-wish`
- **Password reset** flow (forgot → email → reset form)
- **Remember Me** (extends session to 30 days)
- **Policies**: `is-authenticated` and `is-guest` middleware
- **Session management**: `req.session.userId`, configurable cookie max age

### User Management (Complete)

- **User model** with: `fullName`, `email`, `password`, `emailStatus`, `googleId`, Google OAuth fields
- **Profile page**: view, update (name/email), delete account
- **Logout**

### Frontend (Complete)

- **Vue 3** (Composition API) + **Inertia.js v2**
- **Tailwind CSS 4** with custom theme (purple primary, green secondary)
- **Shipwright** build system (Rsbuild under the hood, HMR in dev)
- **Reusable components**: `InputBase`, `InputEmail`, `InputPassword`, `InputText`, `InputButton`, `GoogleButton`
- **AppLayout** with header (logo, nav, user dropdown) and footer

### Infrastructure (Complete)

- **Sails.js 1.5** with actions2 format
- **Waterline ORM** with `sails-disk` (dev) — production-ready for PostgreSQL/MySQL
- **Email** via `sails-hook-mail` (log transport in dev, SMTP/Resend in prod)
- **WebSockets** via `sails-hook-sockets` (configured, not yet used)
- **Testing**: Playwright (E2E) + Node test runner (unit) + `inertia-sails/test` (integration)
- **Docker** and deployment configs ready

### What We Need to Build

- Data models for FieldNotes entries
- CRUD actions and routes
- Vue pages for listing, creating, editing entries
- Search, filtering, pagination
- URL state management
- Flash messages for user feedback

---

## 2. Data Models

### Entry (The Core Model)

Every piece of content in FieldNotes is an **Entry**. Using a single polymorphic model keeps things simple and extensible.

```
api/models/Entry.js
```

| Attribute   | Type     | Details                                                |
| ----------- | -------- | ------------------------------------------------------ |
| `id`        | number   | Auto-increment primary key                             |
| `type`      | string   | `isIn: ['note', 'task', 'log', 'bookmark', 'journal']` |
| `title`     | string   | Required, maxLength: 200                               |
| `body`      | string   | Optional long-form content (markdown-friendly)         |
| `url`       | string   | For bookmarks — the external URL                       |
| `status`    | string   | For tasks — `isIn: ['todo', 'in_progress', 'done']`    |
| `priority`  | string   | For tasks — `isIn: ['low', 'medium', 'high']`          |
| `tags`      | json     | Array of tag strings, e.g. `['work', 'idea']`          |
| `isPinned`  | boolean  | Pinned entries float to top, `defaultsTo: false`       |
| `owner`     | model    | Association → `User` (many-to-one)                     |
| `createdAt` | datetime | Auto-set                                               |
| `updatedAt` | datetime | Auto-set                                               |

**Why a single model?**

- Simpler queries — one table to search across all entry types
- Shared attributes (title, body, tags, pinned) work for every type
- Type-specific attributes (`url` for bookmarks, `status`/`priority` for tasks) are simply nullable for other types
- Easy to add new types later without migration headaches
- Filtering by type is just `{ type: 'note' }` in the criteria

### Tag (Stretch Goal — Separate Model)

If we want more structured tagging later (tag colors, descriptions, counts), we'd add:

```
api/models/Tag.js — name (unique per user), color, owner → User
api/models/EntryTag.js — entry → Entry, tag → Tag (join table)
```

For MVP, storing tags as a JSON array on Entry is simpler and sufficient.

---

## 3. Routes

Following the Boring Stack convention of feature-based route grouping:

```js
// config/routes.js — add to existing routes

// ── Entries (CRUD) ──────────────────────────────
'GET    /entries':            { action: 'entry/view-entries' },
'GET    /entries/new':        { action: 'entry/view-create-entry' },
'GET    /entries/:id':        { action: 'entry/view-entry' },
'GET    /entries/:id/edit':   { action: 'entry/view-edit-entry' },
'POST   /entries':            { action: 'entry/create-entry' },
'PATCH  /entries/:id':        { action: 'entry/update-entry' },
'DELETE /entries/:id':        { action: 'entry/delete-entry' },

// ── Dashboard override ──────────────────────────
// Redirect /dashboard to /entries (entries IS the dashboard)
'GET    /dashboard':          { action: 'entry/view-entries' },
```

### Policy Mapping

```js
// config/policies.js — add
'entry/*': 'is-authenticated',
```

All entry actions require authentication. Authorization (can this user access this entry?) is handled inside each action by filtering on `owner: this.req.session.userId`.

---

## 4. Actions (Controllers)

Every action follows the **actions2** format. Here's the full set:

### 4a. List Entries — `entry/view-entries.js`

The most complex action — handles search, type filtering, status filtering, sorting, and pagination all via query params.

```js
module.exports = {
  friendlyName: 'View entries',

  inputs: {
    type: {
      type: 'string',
      isIn: ['note', 'task', 'log', 'bookmark', 'journal']
    },
    status: { type: 'string', isIn: ['todo', 'in_progress', 'done'] },
    search: { type: 'string', defaultsTo: '' },
    sort: {
      type: 'string',
      isIn: ['newest', 'oldest', 'title'],
      defaultsTo: 'newest'
    },
    page: { type: 'number', min: 1, defaultsTo: 1 }
  },

  exits: {
    success: { responseType: 'inertia' }
  },

  fn: async function ({ type, status, search, sort, page }) {
    const perPage = 20
    const userId = this.req.session.userId

    // Build criteria
    let criteria = { owner: userId }
    if (type) criteria.type = type
    if (status) criteria.status = status
    if (search && search.length >= 2) {
      criteria.or = [
        { title: { contains: search }, owner: userId },
        { body: { contains: search }, owner: userId }
      ]
      // Re-apply type/status inside OR branches if present
      if (type) criteria.or.forEach((c) => (c.type = type))
      if (status) criteria.or.forEach((c) => (c.status = status))
    }

    // Sort mapping
    const sortMap = {
      newest: 'createdAt DESC',
      oldest: 'createdAt ASC',
      title: 'title ASC'
    }

    const [entries, total] = await Promise.all([
      Entry.find(criteria)
        .sort([{ isPinned: 'DESC' }, sortMap[sort]])
        .skip((page - 1) * perPage)
        .limit(perPage),
      Entry.count(criteria)
    ])

    return {
      page: 'entries/index',
      props: {
        entries,
        filters: { type, status, search, sort },
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage)
        }
      }
    }
  }
}
```

### 4b. View Single Entry — `entry/view-entry.js`

```js
inputs: {
  id: { type: 'number', required: true },
},
exits: {
  success: { responseType: 'inertia' },
  notFound: { responseType: 'notFound' },
},
fn: async function ({ id }) {
  const entry = await Entry.findOne({ id, owner: this.req.session.userId })
  if (!entry) throw 'notFound'

  return { page: 'entries/show', props: { entry } }
}
```

### 4c. Create Entry — `entry/create-entry.js`

```js
inputs: {
  type:     { type: 'string', required: true, isIn: ['note','task','log','bookmark','journal'] },
  title:    { type: 'string', required: true, maxLength: 200 },
  body:     { type: 'string', allowNull: true },
  url:      { type: 'string', allowNull: true, isURL: true },
  status:   { type: 'string', isIn: ['todo','in_progress','done'], defaultsTo: 'todo' },
  priority: { type: 'string', isIn: ['low','medium','high'], defaultsTo: 'medium' },
  tags:     { type: 'json', defaultsTo: [] },
},
exits: {
  success:    { responseType: 'redirect' },
  badRequest: { responseType: 'badRequest' },
},
fn: async function (inputs) {
  const entry = await Entry.create({
    ...inputs,
    owner: this.req.session.userId,
  }).fetch()

  sails.inertia.flash('success', 'Entry created!')
  return `/entries/${entry.id}`
}
```

### 4d. Update Entry — `entry/update-entry.js`

```js
inputs: {
  id:       { type: 'number', required: true },
  title:    { type: 'string', maxLength: 200 },
  body:     { type: 'string', allowNull: true },
  url:      { type: 'string', allowNull: true },
  status:   { type: 'string', isIn: ['todo','in_progress','done'] },
  priority: { type: 'string', isIn: ['low','medium','high'] },
  tags:     { type: 'json' },
  isPinned: { type: 'boolean' },
},
exits: {
  success:    { responseType: 'redirect' },
  badRequest: { responseType: 'badRequest' },
  notFound:   { responseType: 'notFound' },
},
fn: async function ({ id, ...valuesToSet }) {
  const entry = await Entry.updateOne({
    id,
    owner: this.req.session.userId,
  }).set(valuesToSet)

  if (!entry) throw 'notFound'

  sails.inertia.flash('success', 'Entry updated!')
  return `/entries/${id}`
}
```

### 4e. Delete Entry — `entry/delete-entry.js`

```js
inputs: {
  id: { type: 'number', required: true },
},
exits: {
  success:  { responseType: 'redirect' },
  notFound: { responseType: 'notFound' },
},
fn: async function ({ id }) {
  const entry = await Entry.destroyOne({
    id,
    owner: this.req.session.userId,
  })
  if (!entry) throw 'notFound'

  sails.inertia.flash('success', 'Entry deleted!')
  return '/entries'
}
```

### 4f. View Forms — `entry/view-create-entry.js` and `entry/view-edit-entry.js`

Create form just renders the page. Edit form loads the entry and passes it as a prop.

---

## 5. Vue Pages

### Page Structure

```
assets/js/pages/
├── entries/
│   ├── index.vue          # List all entries (search, filter, paginate)
│   ├── show.vue           # View single entry
│   ├── create.vue         # Create new entry form
│   └── edit.vue           # Edit existing entry form
```

### 5a. List Page — `entries/index.vue`

Key features:

- **Type tabs**: All | Notes | Tasks | Logs | Bookmarks | Journal
- **Search bar**: Debounced (300ms), min 2 chars, with AbortController
- **Status filter**: For tasks (todo / in_progress / done)
- **Sort dropdown**: Newest, Oldest, Title A-Z
- **Pagination**: Previous/Next with page count
- **Pinned entries** float to top with a pin indicator
- **Flash messages** shown as toasts on arrival
- **Empty state** with CTA to create first entry

URL state pattern: `/entries?type=task&status=todo&search=deploy&sort=newest&page=2`

```vue
<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { Head, Link, router, usePage } from '@inertiajs/vue3'

const props = defineProps({
  entries: Array,
  filters: Object,
  pagination: Object
})

// Local search state, synced to URL with debounce
const search = ref(props.filters.search || '')
let debounceTimer

watch(search, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    router.get(
      '/entries',
      {
        ...props.filters,
        search: value || undefined,
        page: undefined // Reset to page 1 on new search
      },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }, 300)
})

onUnmounted(() => clearTimeout(debounceTimer))

function setFilter(key, value) {
  router.get(
    '/entries',
    {
      ...props.filters,
      [key]: value || undefined,
      page: undefined
    },
    { preserveState: true, preserveScroll: true }
  )
}
</script>
```

### 5b. Create/Edit Form — `entries/create.vue` / `entries/edit.vue`

```vue
<script setup>
import { useForm } from '@inertiajs/vue3'

const props = defineProps({ entry: Object }) // Only on edit

const form = useForm({
  type: props.entry?.type || 'note',
  title: props.entry?.title || '',
  body: props.entry?.body || '',
  url: props.entry?.url || '',
  status: props.entry?.status || 'todo',
  priority: props.entry?.priority || 'medium',
  tags: props.entry?.tags || []
})

function submit() {
  if (props.entry) {
    form.patch(`/entries/${props.entry.id}`)
  } else {
    form.post('/entries')
  }
}
</script>
```

**Dynamic form sections**: Show/hide fields based on `form.type`:

- `bookmark` → show URL field
- `task` → show status + priority selectors
- `journal` → show date picker (defaults to today)
- All types → title, body, tags

### 5c. Show Page — `entries/show.vue`

- Display entry content (render body as markdown if we add a parser)
- Metadata bar: type badge, created date, tags
- Action buttons: Edit, Delete (with confirmation), Pin/Unpin
- Back link to list (preserving previous filters via `router.visit` history)

---

## 6. Reusable Components to Build

| Component           | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `EntryCard.vue`     | Card for list view — title, type badge, date, preview |
| `EntryForm.vue`     | Shared form for create/edit (optional consolidation)  |
| `TypeTabs.vue`      | Tab bar for filtering by entry type                   |
| `Pagination.vue`    | Previous/Next with page indicator                     |
| `TagInput.vue`      | Multi-tag input with autocomplete from existing tags  |
| `FlashToast.vue`    | Toast notification from `usePage().props.flash`       |
| `ConfirmDialog.vue` | "Are you sure?" modal for delete actions              |
| `EmptyState.vue`    | Friendly empty state with illustration and CTA        |
| `Badge.vue`         | Colored badge for type/status/priority                |
| `SearchInput.vue`   | Search field with debounce + loading indicator        |

---

## 7. URL State Strategy

All filter/sort/pagination state lives in the URL. This makes every view shareable and bookmarkable.

| Parameter | Values                                       | Default   |
| --------- | -------------------------------------------- | --------- |
| `type`    | `note`, `task`, `log`, `bookmark`, `journal` | _(all)_   |
| `status`  | `todo`, `in_progress`, `done`                | _(all)_   |
| `search`  | any string (min 2 chars to trigger)          | _(empty)_ |
| `sort`    | `newest`, `oldest`, `title`                  | `newest`  |
| `page`    | positive integer                             | `1`       |

**URL hygiene rules:**

- Don't include parameters with default values (`/entries` not `/entries?sort=newest&page=1`)
- Reset `page` to 1 when any filter changes
- Use `replace: true` for search input (avoids polluting browser history)
- Use `pushState` for filter/sort clicks (enables back button)

---

## 8. Flash Messages

Use Inertia's flash system for user feedback after mutations:

| Action | Flash Key | Message                  |
| ------ | --------- | ------------------------ |
| Create | `success` | `"Entry created!"`       |
| Update | `success` | `"Entry updated!"`       |
| Delete | `success` | `"Entry deleted!"`       |
| Pin    | `success` | `"Entry pinned!"`        |
| Error  | `error`   | `"Something went wrong"` |

Display with a `FlashToast.vue` component wired into `AppLayout.vue` that reads `usePage().props.flash`.

---

## 9. Authorization Strategy

**Simple owner-based authorization** — no roles, no teams, no sharing.

Every query scopes to the logged-in user:

```js
// Always filter by owner
Entry.find({ owner: this.req.session.userId })
Entry.findOne({ id, owner: this.req.session.userId })
Entry.updateOne({ id, owner: this.req.session.userId }).set(...)
Entry.destroyOne({ id, owner: this.req.session.userId })
```

If a record isn't found (wrong owner or doesn't exist), throw `notFound`. This prevents both "entry not found" and "entry belongs to someone else" from leaking information.

---

## 10. Testing Strategy

### Unit Tests

```
tests/unit/models/entry.test.js     — Model validation, lifecycle callbacks
tests/unit/helpers/                  — Any new helpers
```

### Integration Tests

```
tests/integration/entry/create-entry.test.js
tests/integration/entry/view-entries.test.js
tests/integration/entry/update-entry.test.js
tests/integration/entry/delete-entry.test.js
```

Using `inertia-sails/test`:

- `assertComponent('entries/index')` — correct page rendered
- `assertHasProp('entries')` — props present
- `assertPropValue('pagination.total', 5)` — correct counts
- `assertRedirect('/entries')` — redirect after mutation
- `assertFlash('success', 'Entry created!')` — flash message set
- `assertBadRequest()` — validation errors returned

### E2E Tests (Playwright)

```
tests/e2e/entries/crud.test.js      — Full create → view → edit → delete flow
tests/e2e/entries/search.test.js    — Search and filter behavior
tests/e2e/entries/pagination.test.js — Pagination navigation
```

---

## 11. Implementation Order

A phased approach, each phase is independently shippable:

### Phase 1: Foundation

1. Create `Entry` model
2. Add routes to `config/routes.js`
3. Add policy mapping
4. Build list action (`view-entries`) — no search/filter yet, just list all
5. Build create action + form page
6. Build show page
7. Build edit action + form page
8. Build delete action
9. Wire up `FlashToast` in `AppLayout`

### Phase 2: Polish the List

10. Add type tabs (filter by type)
11. Add search with debounce
12. Add sort dropdown
13. Add pagination component
14. Add pinned entries support
15. Add empty state

### Phase 3: Better UX

16. Tag input component
17. Confirm dialog for delete
18. Entry type badges and status badges
19. Responsive mobile layout
20. Keyboard shortcuts (optional)

### Phase 4: Testing

21. Integration tests for all CRUD actions
22. E2E test for happy path (create → edit → delete)
23. E2E test for search/filter/pagination

### Phase 5: Stretch Goals

24. Markdown rendering in body (e.g., `markdown-it`)
25. Bulk actions (select multiple → delete/archive)
26. Export entries as JSON/CSV
27. Dark mode toggle (localStorage-persisted via Durable UI patterns)
28. Real-time entry count in sidebar via WebSockets
29. Background job to send daily digest email (via Quest)
30. Favorites / starred entries

---

## 12. File Inventory (What Gets Created)

### Models

- `api/models/Entry.js`

### Actions (Controllers)

- `api/controllers/entry/view-entries.js`
- `api/controllers/entry/view-entry.js`
- `api/controllers/entry/view-create-entry.js`
- `api/controllers/entry/view-edit-entry.js`
- `api/controllers/entry/create-entry.js`
- `api/controllers/entry/update-entry.js`
- `api/controllers/entry/delete-entry.js`

### Vue Pages

- `assets/js/pages/entries/index.vue`
- `assets/js/pages/entries/show.vue`
- `assets/js/pages/entries/create.vue`
- `assets/js/pages/entries/edit.vue`

### Vue Components

- `assets/js/components/EntryCard.vue`
- `assets/js/components/TypeTabs.vue`
- `assets/js/components/Pagination.vue`
- `assets/js/components/TagInput.vue`
- `assets/js/components/FlashToast.vue`
- `assets/js/components/ConfirmDialog.vue`
- `assets/js/components/EmptyState.vue`
- `assets/js/components/Badge.vue`
- `assets/js/components/SearchInput.vue`

### Config Changes

- `config/routes.js` — add entry routes
- `config/policies.js` — add `'entry/*': 'is-authenticated'`

### Tests

- `tests/integration/entry/*.test.js`
- `tests/e2e/entries/*.test.js`

**Total new files: ~25**
**Config modifications: 2**

---

## 13. Tech Decisions & Rationale

| Decision                                         | Choice         | Why                                                                                                           |
| ------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------- |
| Single `Entry` model vs separate models per type | Single model   | Simpler queries, shared search, easy to extend. Type-specific fields are nullable.                            |
| Tags as JSON array vs separate Tag model         | JSON array     | MVP simplicity. No join queries. Can upgrade later.                                                           |
| Server-side search vs client-side                | Server-side    | Data could grow large. Waterline `contains` works for MVP. Can add full-text search later.                    |
| URL state vs localStorage for filters            | URL state      | Filters should be shareable and bookmarkable. localStorage for UI preferences only (collapsed sidebar, etc.). |
| Markdown rendering                               | Client-side    | Keep server lean. Use `markdown-it` or similar in Vue. Stretch goal.                                          |
| Separate create/edit pages vs modal              | Separate pages | Better URL semantics (`/entries/new`, `/entries/5/edit`). Modals can't be bookmarked.                         |
| Pagination style                                 | Page numbers   | Simpler than cursor-based. Works well with Waterline's `paginate()`. Good enough for personal app scale.      |

---

## 14. Key Patterns Reference

### Action Pattern Quick Reference

```
View page  → responseType: 'inertia'      → return { page, props }
Mutation   → responseType: 'redirect'      → return '/url'
Validation → responseType: 'badRequest'    → throw { exit: { problems } }
Not found  → responseType: 'notFound'      → throw 'notFound'
```

### Waterline Query Quick Reference

```js
Entry.find({ owner: userId }) // All entries for user
Entry.find({ owner: userId, type: 'task' }) // Filter by type
Entry.find({ title: { contains: 'deploy' } }) // Search
Entry.find(criteria).sort('createdAt DESC') // Sort
Entry.find(criteria).skip(20).limit(20) // Manual pagination
Entry.find(criteria).paginate(2, 20) // Built-in pagination (page 2, 20 per page)
Entry.count(criteria) // Count for pagination metadata
Entry.updateOne({ id, owner: userId }).set({ title }) // Scoped update
Entry.destroyOne({ id, owner: userId }) // Scoped delete
```

### Inertia Form Quick Reference (Vue)

```vue
const form = useForm({ title: '', body: '' }) form.post('/entries') // Create
form.patch(`/entries/${id}`) // Update form.delete(`/entries/${id}`) // Delete
form.processing // Loading state form.errors.title // Validation error for field
form.reset() // Clear form
```

---

## 15. Open Questions

1. **Should `/dashboard` redirect to `/entries` or should the dashboard remain a separate summary page?**

   - Option A: Dashboard IS the entries list (simpler)
   - Option B: Dashboard shows summary cards (entry counts by type, recent entries, tasks due) and entries list is separate

2. **Do we want a rich text editor for the body field or keep it plain text / markdown?**

   - Plain text is simpler for MVP
   - Markdown gives formatting without editor complexity
   - Rich text (Tiptap/ProseMirror) is a bigger lift but better UX

3. **Should tags be free-form or predefined?**

   - Free-form: users type whatever they want (simpler)
   - Predefined: admin sets available tags (more controlled)
   - Hybrid: free-form with autocomplete from previously used tags (best UX)

4. **Do entries need an "archived" state or is delete permanent?**
   - Soft delete (archived) is safer but adds complexity
   - Hard delete is simpler for MVP
   - Waterline has `.archive()` built-in if we want it later
