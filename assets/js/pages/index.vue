<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({
  layout: AppLayout
})

const loggedInUser = usePage().props.loggedInUser

const entryTypes = [
  {
    name: 'Notes',
    description: 'Capture ideas, meeting notes, and quick thoughts before they slip away.',
    icon: 'pencil',
    color: 'brand'
  },
  {
    name: 'Tasks',
    description: 'Track your to-dos with status and priority. Simple, focused task management.',
    icon: 'check',
    color: 'green'
  },
  {
    name: 'Journal',
    description: 'Daily reflections and personal entries. Build a habit of writing.',
    icon: 'book',
    color: 'brand'
  },
  {
    name: 'Bookmarks',
    description: 'Save links worth revisiting. Your personal corner of the web.',
    icon: 'link',
    color: 'green'
  },
  {
    name: 'Logs',
    description: 'Record activities, workouts, progress — anything you want to track over time.',
    icon: 'clock',
    color: 'brand'
  }
]

const features = [
  {
    title: 'One place for everything',
    description:
      'Notes, tasks, bookmarks, logs, and journal entries live together. No more switching between five different apps.'
  },
  {
    title: 'Search across all your entries',
    description:
      'Find anything instantly. Filter by type, status, or tags. Full-text search across titles and body content.'
  },
  {
    title: 'Pin what matters',
    description:
      'Keep important entries front and center. Pinned items always float to the top of your list.'
  },
  {
    title: 'Tag and organize',
    description:
      'Flexible tagging lets you create your own system. Cross-reference entries however you think.'
  },
  {
    title: 'Clean URL state',
    description:
      'Every filtered view is a bookmarkable URL. Share a specific view or come back to it later.'
  },
  {
    title: 'Private by default',
    description:
      'Your entries are yours alone. Simple, secure, owner-based access. No sharing, no complexity.'
  }
]
</script>

<template>
  <Head title="Your personal knowledge tracker | FieldNotes" />

  <!-- Hero -->
  <section class="relative overflow-hidden px-4 pb-20 pt-16 md:pb-28 md:pt-24">
    <!-- Subtle background decoration -->
    <div
      class="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <div
        class="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/30 blur-3xl"
      />
      <div
        class="absolute bottom-0 right-0 h-[300px] w-[400px] translate-x-1/4 rounded-full bg-green-100/20 blur-3xl"
      />
    </div>

    <div class="mx-auto max-w-3xl text-center">
      <p
        class="mb-4 inline-block rounded-full bg-brand-100/60 px-4 py-1.5 text-sm font-medium text-brand-700"
      >
        Notes &middot; Tasks &middot; Journal &middot; Bookmarks &middot; Logs
      </p>
      <h1
        class="mb-6 text-4xl font-bold leading-tight tracking-tight text-black md:text-6xl"
      >
        Everything you know,<br />
        <span class="text-brand">in one place.</span>
      </h1>
      <p class="mx-auto mb-10 max-w-xl text-lg text-gray-500 md:text-xl">
        FieldNotes is a personal knowledge and activity tracker. Capture notes,
        manage tasks, save bookmarks, keep a journal — all in a single, simple
        app.
      </p>
      <div class="flex items-center justify-center gap-4">
        <Link
          :href="loggedInUser ? '/entries' : '/signup'"
          class="rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand/30"
        >
          {{ loggedInUser ? 'Go to entries' : 'Get started free' }}
        </Link>
        <a
          href="#how-it-works"
          class="rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:text-black hover:shadow-md"
        >
          See how it works
        </a>
      </div>
    </div>
  </section>

  <!-- Entry Types -->
  <section id="how-it-works" class="scroll-mt-20 px-4 py-16 md:py-24">
    <div class="mx-auto max-w-5xl">
      <div class="mb-12 text-center md:mb-16">
        <h2 class="mb-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
          Five entry types, one unified home
        </h2>
        <p class="mx-auto max-w-2xl text-gray-500 md:text-lg">
          Everything is an entry. Pick the type that fits, add tags, and let
          FieldNotes keep it all organized.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(entry, i) in entryTypes"
          :key="entry.name"
          class="group rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-lg"
          :class="{ 'sm:col-span-2 lg:col-span-1': i === 4 }"
        >
          <div class="mb-4 flex items-center gap-3">
            <!-- Pencil - Notes -->
            <div
              v-if="entry.icon === 'pencil'"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100/60"
            >
              <svg
                class="h-5 w-5 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
            <!-- Check - Tasks -->
            <div
              v-if="entry.icon === 'check'"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100/60"
            >
              <svg
                class="h-5 w-5 text-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <!-- Book - Journal -->
            <div
              v-if="entry.icon === 'book'"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100/60"
            >
              <svg
                class="h-5 w-5 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <!-- Link - Bookmarks -->
            <div
              v-if="entry.icon === 'link'"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100/60"
            >
              <svg
                class="h-5 w-5 text-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </div>
            <!-- Clock - Logs -->
            <div
              v-if="entry.icon === 'clock'"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100/60"
            >
              <svg
                class="h-5 w-5 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-black">{{ entry.name }}</h3>
          </div>
          <p class="text-sm leading-relaxed text-gray-500">
            {{ entry.description }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="border-t border-gray-100 bg-gray-50/50 px-4 py-16 md:py-24">
    <div class="mx-auto max-w-5xl">
      <div class="mb-12 text-center md:mb-16">
        <h2 class="mb-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
          Simple by design
        </h2>
        <p class="mx-auto max-w-2xl text-gray-500 md:text-lg">
          No folders, no nested hierarchies, no learning curve. Just write, tag,
          and find.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in features" :key="feature.title">
          <h3 class="mb-2 text-base font-semibold text-black">
            {{ feature.title }}
          </h3>
          <p class="text-sm leading-relaxed text-gray-500">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Social Proof / How It Works -->
  <section class="px-4 py-16 md:py-24">
    <div class="mx-auto max-w-3xl">
      <div class="rounded-2xl border border-gray-100 bg-white p-8 md:p-12">
        <h2 class="mb-8 text-center text-2xl font-bold text-black md:text-3xl">
          How it works
        </h2>
        <div class="space-y-8">
          <div class="flex gap-4">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
            >
              1
            </div>
            <div>
              <h3 class="mb-1 font-semibold text-black">Create an entry</h3>
              <p class="text-sm text-gray-500">
                Pick a type — note, task, journal, bookmark, or log — give it a
                title, and start writing.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
            >
              2
            </div>
            <div>
              <h3 class="mb-1 font-semibold text-black">Organize with tags</h3>
              <p class="text-sm text-gray-500">
                Add tags like "work", "idea", or "reading-list" to create your
                own organizational system.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
            >
              3
            </div>
            <div>
              <h3 class="mb-1 font-semibold text-black">
                Find anything instantly
              </h3>
              <p class="text-sm text-gray-500">
                Search, filter by type, sort by date or title. Pin important
                entries so they're always at the top.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="px-4 pb-20 pt-4 md:pb-28">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="mb-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
        Start capturing what matters
      </h2>
      <p class="mx-auto mb-8 max-w-xl text-gray-500 md:text-lg">
        Your thoughts, tasks, and discoveries deserve a home. FieldNotes keeps
        them all in one place — simple, private, and always searchable.
      </p>
      <Link
        :href="loggedInUser ? '/entries' : '/signup'"
        class="inline-block rounded-xl bg-brand px-10 py-4 text-base font-semibold text-white shadow-lg shadow-brand/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand/30"
      >
        {{ loggedInUser ? 'Go to your entries' : 'Create your free account' }}
      </Link>
    </div>
  </section>
</template>
