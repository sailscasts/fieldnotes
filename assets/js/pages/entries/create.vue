<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'
import InputButton from '@/components/InputButton.vue'

defineOptions({
  layout: AppLayout
})

const form = useForm({
  type: 'note',
  title: '',
  body: '',
  url: '',
  status: 'todo',
  priority: 'medium',
  tags: []
})

const tagInput = ''

function submit() {
  form.post('/entries')
}

function addTag(event) {
  const value = event.target.value.trim()
  if (value) {
    form.tags.push(value)
    event.target.value = ''
  }
}

function removeLastTag(event) {
  if (!event.target.value && form.tags.length) {
    form.tags.pop()
  }
}

const typeOptions = [
  { value: 'note', label: 'Note' },
  { value: 'task', label: 'Task' },
  { value: 'log', label: 'Log' },
  { value: 'bookmark', label: 'Bookmark' },
  { value: 'journal', label: 'Journal' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]
</script>

<template>
  <Head title="New Entry | FieldNotes" />

  <section class="mx-auto max-w-2xl px-4">
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

    <div>
      <h1 class="mb-8 text-xl font-bold tracking-tight text-black">New Entry</h1>

      <form @submit.prevent="submit" class="space-y-6">
        <!-- Type selector -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-500">
            Type
          </label>
          <div class="segmented-control">
            <button
              v-for="option in typeOptions"
              :key="option.value"
              type="button"
              @click="form.type = option.value"
              :class="form.type === option.value ? 'active' : ''"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label for="title" class="mb-2 block text-sm font-medium text-gray-500">
            Title
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            maxlength="200"
            placeholder="What's on your mind?"
            class="w-full rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3 text-sm placeholder:text-gray-400 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
          />
          <p v-if="form.errors.title" class="mt-1.5 text-sm text-red-400">
            {{ form.errors.title }}
          </p>
        </div>

        <!-- URL (bookmarks only) -->
        <div v-if="form.type === 'bookmark'">
          <label for="url" class="mb-2 block text-sm font-medium text-gray-500">
            URL
          </label>
          <input
            id="url"
            v-model="form.url"
            type="url"
            placeholder="https://..."
            class="w-full rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3 text-sm placeholder:text-gray-400 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
          />
          <p v-if="form.errors.url" class="mt-1.5 text-sm text-red-400">
            {{ form.errors.url }}
          </p>
        </div>

        <!-- Status & Priority (tasks only) -->
        <div v-if="form.type === 'task'" class="grid grid-cols-2 gap-4">
          <div>
            <label for="status" class="mb-2 block text-sm font-medium text-gray-500">
              Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="apple-select w-full rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3 text-sm text-gray-600 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div>
            <label
              for="priority"
              class="mb-2 block text-sm font-medium text-gray-500"
            >
              Priority
            </label>
            <select
              id="priority"
              v-model="form.priority"
              class="apple-select w-full rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3 text-sm text-gray-600 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
            >
              <option
                v-for="option in priorityOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Body -->
        <div>
          <label for="body" class="mb-2 block text-sm font-medium text-gray-500">
            Body
          </label>
          <textarea
            id="body"
            v-model="form.body"
            rows="6"
            placeholder="Write your thoughts..."
            class="w-full resize-y rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3 text-sm placeholder:text-gray-400 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
          ></textarea>
          <p v-if="form.errors.body" class="mt-1.5 text-sm text-red-400">
            {{ form.errors.body }}
          </p>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="mb-2 block text-sm font-medium text-gray-500">
            Tags
          </label>
          <div class="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3 transition-all duration-200 focus-within:bg-white focus-within:border-brand/30 focus-within:ring-2 focus-within:ring-brand/10">
            <span
              v-for="(tag, index) in form.tags"
              :key="tag"
              class="inline-flex items-center gap-1 rounded-lg bg-gray-100/80 px-2.5 py-1 text-xs font-medium text-gray-500"
            >
              {{ tag }}
              <button
                type="button"
                @click="form.tags.splice(index, 1)"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </span>
            <input
              id="tags"
              type="text"
              placeholder="Add a tag..."
              class="min-w-[120px] flex-1 border-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0"
              @keydown.enter.prevent="addTag"
              @keydown.backspace="removeLastTag"
            />
          </div>
          <p class="mt-1.5 text-xs text-gray-400">Press Enter to add a tag</p>
        </div>

        <!-- Submit -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/entries"
            class="rounded-xl border border-gray-200/60 px-5 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300/60"
          >
            Cancel
          </Link>
          <InputButton :processing="form.processing" :disabled="form.processing">
            Create Entry
          </InputButton>
        </div>
      </form>
    </div>
  </section>
</template>
