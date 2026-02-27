<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({
  layout: AppLayout
})

const props = defineProps({
  entries: Array,
  filters: Object,
  pagination: Object
})

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
        page: undefined
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

function goToPage(page) {
  router.get(
    '/entries',
    { ...props.filters, page },
    { preserveState: true, preserveScroll: true }
  )
}

const typeLabels = {
  note: 'Notes',
  task: 'Tasks',
  log: 'Logs',
  bookmark: 'Bookmarks',
  journal: 'Journal'
}

const typeBadgeClasses = {
  note: 'bg-brand-50 text-brand-600',
  task: 'bg-blue-50 text-blue-600',
  log: 'bg-gray-100 text-gray-500',
  bookmark: 'bg-green-50 text-green-600',
  journal: 'bg-amber-50 text-amber-600'
}

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <Head title="Entries | FieldNotes" />

  <section class="mx-auto max-w-4xl px-4">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight text-black">Entries</h1>
      <Link
        href="/entries/new"
        class="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-600 hover:shadow-md"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Entry
      </Link>
    </div>

    <!-- Type Tabs — Segmented Control -->
    <nav class="segmented-control mb-6 overflow-x-auto">
      <button
        @click="setFilter('type', undefined)"
        :class="!filters.type ? 'active' : ''"
      >
        All
      </button>
      <button
        v-for="(label, key) in typeLabels"
        :key="key"
        @click="setFilter('type', key)"
        :class="filters.type === key ? 'active' : ''"
      >
        {{ label }}
      </button>
    </nav>

    <!-- Search & Filters -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Search entries..."
          class="w-full rounded-xl border border-transparent bg-gray-50/80 py-3 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
        />
        <svg
          class="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Status filter (only when viewing tasks) -->
      <select
        v-if="filters.type === 'task'"
        :value="filters.status || ''"
        @change="setFilter('status', $event.target.value || undefined)"
        class="apple-select rounded-xl border border-gray-200/60 bg-gray-50/80 px-3 py-3 text-sm text-gray-600 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
      >
        <option value="">All statuses</option>
        <option v-for="(label, key) in statusLabels" :key="key" :value="key">
          {{ label }}
        </option>
      </select>

      <!-- Sort -->
      <select
        :value="filters.sort || 'newest'"
        @change="setFilter('sort', $event.target.value)"
        class="apple-select rounded-xl border border-gray-200/60 bg-gray-50/80 px-3 py-3 text-sm text-gray-600 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="title">Title A-Z</option>
      </select>
    </div>

    <!-- Entries List -->
    <div v-if="entries.length" class="space-y-3">
      <Link
        v-for="entry in entries"
        :key="entry.id"
        :href="`/entries/${entry.id}`"
        class="group block rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="mb-1.5 flex items-center gap-2">
              <span
                v-if="entry.isPinned"
                class="text-brand"
                title="Pinned"
              >
                <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.828.722a.5.5 0 01.354.146l4.95 4.95a.5.5 0 01-.707.707l-.55-.55-3.535 3.536 1.06 4.242a.5.5 0 01-.829.441L7.5 11.121l-4.243 4.243a.5.5 0 11-.707-.707L6.793 10.5l-3.07-3.07a.5.5 0 01.44-.83l4.243 1.061L11.94 4.13l-.55-.55a.5.5 0 01.146-.853z" />
                </svg>
              </span>
              <span
                class="inline-flex rounded-lg px-2 py-0.5 text-xs font-medium"
                :class="typeBadgeClasses[entry.type]"
              >
                {{ entry.type }}
              </span>
              <span
                v-if="entry.type === 'task' && entry.status"
                class="inline-flex rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
              >
                {{ statusLabels[entry.status] || entry.status }}
              </span>
            </div>
            <h3 class="font-medium text-black">{{ entry.title }}</h3>
            <p v-if="entry.body" class="mt-1 line-clamp-2 text-sm text-gray-500">
              {{ entry.body }}
            </p>
            <div class="mt-2.5 flex items-center gap-3 text-xs text-gray-400">
              <span>{{ formatDate(entry.createdAt) }}</span>
              <div v-if="entry.tags?.length" class="flex gap-1">
                <span
                  v-for="tag in entry.tags.slice(0, 3)"
                  :key="tag"
                  class="rounded-md bg-gray-50 px-1.5 py-0.5 text-gray-500"
                >
                  {{ tag }}
                </span>
                <span v-if="entry.tags.length > 3" class="text-gray-400">
                  +{{ entry.tags.length - 3 }}
                </span>
              </div>
            </div>
          </div>
          <svg
            class="mt-1 h-4 w-4 flex-shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-2xl bg-gray-50/50 py-20 text-center"
    >
      <svg
        class="mx-auto mb-5 h-14 w-14 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 class="mb-2 text-lg font-semibold text-gray-700">No entries yet</h3>
      <p class="mb-6 text-sm text-gray-400">
        Get started by creating your first entry.
      </p>
      <Link
        href="/entries/new"
        class="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-600 hover:shadow-md"
      >
        Create your first entry
      </Link>
    </div>

    <!-- Pagination -->
    <nav
      v-if="pagination.totalPages > 1"
      class="mt-8 flex items-center justify-between"
    >
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page <= 1"
        class="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span class="text-sm font-medium text-gray-400">
        Page {{ pagination.page }} of {{ pagination.totalPages }}
      </span>
      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page >= pagination.totalPages"
        class="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300/60 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  </section>
</template>
