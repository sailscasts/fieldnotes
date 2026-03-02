<script setup>
import { Head, Link, router } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({
  layout: AppLayout
})

const props = defineProps({
  entry: Object
})

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

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function togglePin() {
  router.patch(
    `/entries/${props.entry.id}`,
    { isPinned: !props.entry.isPinned },
    { preserveScroll: true }
  )
}

function deleteEntry() {
  if (confirm('Are you sure you want to delete this entry?')) {
    router.delete(`/entries/${props.entry.id}`)
  }
}
</script>

<template>
  <Head :title="`${entry.title} | FieldNotes`" />

  <section class="mx-auto max-w-3xl px-4 pt-10">
    <!-- Back link -->
    <Link
      href="/entries"
      class="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to entries
    </Link>

    <!-- Entry content -->
    <article>
      <!-- Metadata bar -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <span
          class="inline-flex rounded-lg px-2.5 py-1 text-xs font-medium"
          :class="typeBadgeClasses[entry.type]"
        >
          {{ entry.type }}
        </span>
        <span
          v-if="entry.type === 'task' && entry.status"
          class="inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500"
        >
          {{ statusLabels[entry.status] }}
        </span>
        <span
          v-if="entry.type === 'task' && entry.priority"
          class="inline-flex rounded-lg px-2.5 py-1 text-xs font-medium"
          :class="{
            'bg-red-50 text-red-600': entry.priority === 'high',
            'bg-amber-50 text-amber-600': entry.priority === 'medium',
            'bg-gray-50 text-gray-500': entry.priority === 'low'
          }"
        >
          {{ priorityLabels[entry.priority] }}
        </span>
        <span
          v-if="entry.isPinned"
          class="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.828.722a.5.5 0 01.354.146l4.95 4.95a.5.5 0 01-.707.707l-.55-.55-3.535 3.536 1.06 4.242a.5.5 0 01-.829.441L7.5 11.121l-4.243 4.243a.5.5 0 11-.707-.707L6.793 10.5l-3.07-3.07a.5.5 0 01.44-.83l4.243 1.061L11.94 4.13l-.55-.55a.5.5 0 01.146-.853z" />
          </svg>
          Pinned
        </span>
      </div>

      <!-- Title -->
      <h1 class="mb-2 text-2xl font-bold tracking-tight text-black">{{ entry.title }}</h1>

      <!-- Date -->
      <p class="mb-6 text-sm text-gray-400">{{ formatDate(entry.createdAt) }}</p>

      <!-- URL for bookmarks -->
      <div v-if="entry.url" class="mb-6">
        <a
          :href="entry.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm text-brand hover:underline"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          {{ entry.url }}
        </a>
      </div>

      <!-- Body -->
      <div
        v-if="entry.body"
        class="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700"
      >
        {{ entry.body }}
      </div>

      <!-- Tags -->
      <div v-if="entry.tags?.length" class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tag in entry.tags"
          :key="tag"
          class="rounded-lg bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Actions -->
      <div
        class="mt-8 flex items-center gap-3 border-t border-gray-100/80 pt-6"
      >
        <Link
          :href="`/entries/${entry.id}/edit`"
          class="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300/60"
        >
          Edit
        </Link>
        <button
          @click="togglePin"
          class="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300/60"
        >
          {{ entry.isPinned ? 'Unpin' : 'Pin' }}
        </button>
        <button
          @click="deleteEntry"
          class="rounded-xl border border-red-200/60 px-4 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:border-red-300/60"
        >
          Delete
        </button>
      </div>
    </article>
  </section>
</template>
