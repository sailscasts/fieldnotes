<script setup>
import { ref, watch } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const loggedInUser = page.props.loggedInUser

const flash = ref(null)
let flashTimer

watch(
  () => page.props.flash,
  (newFlash) => {
    if (!newFlash) return
    const key = Object.keys(newFlash).find((k) => newFlash[k])
    if (key) {
      flash.value = { type: key, message: newFlash[key] }
      clearTimeout(flashTimer)
      flashTimer = setTimeout(() => {
        flash.value = null
      }, 4000)
    }
  },
  { deep: true, immediate: true }
)

function dismissFlash() {
  flash.value = null
  clearTimeout(flashTimer)
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gradient-to-b from-brand-50/10 to-[#F9FAFB]"
  >
    <!-- Flash Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-[-100%] opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-[-100%] opacity-0"
    >
      <div
        v-if="flash"
        class="fixed left-1/2 top-4 z-50 -translate-x-1/2"
      >
        <div
          class="flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium shadow-lg backdrop-blur-lg"
          :class="{
            'bg-green-700 text-white': flash.type === 'success',
            'bg-red-600 text-white': flash.type === 'error',
            'bg-gray-800 text-white': flash.type === 'info'
          }"
        >
          <span>{{ flash.message }}</span>
          <button
            @click="dismissFlash"
            class="ml-2 opacity-70 hover:opacity-100"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <header class="sticky top-0 z-40 border-b border-gray-200/40 bg-white/80 backdrop-blur-lg">
      <nav class="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" class="flex items-center gap-2">
          <svg
            class="w-7"
            viewBox="0 0 30 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="8" y="0" width="22" height="27" rx="3" fill="currentColor" opacity="0.3" />
            <rect x="0" y="6" width="22" height="27" rx="3" fill="currentColor" />
          </svg>
          <span class="text-base font-semibold tracking-tight text-black">fieldnotes</span>
        </Link>
        <ul
          class="flex items-center justify-items-end space-x-4 text-sm"
          v-if="!loggedInUser"
        >
          <li>
            <Link href="/login" class="text-sm font-medium text-brand transition-colors hover:text-brand-600 md:text-base">Login</Link>
          </li>
          <li>
            <Link
              href="/signup"
              class="rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-600"
              >Sign up</Link
            >
          </li>
        </ul>
        <section class="flex items-center space-x-6" v-else>
          <Link href="/entries" class="text-sm font-medium text-gray-600 transition-colors hover:text-brand md:text-base">Entries</Link>
          <Link href="/profile">
            <p
              class="flex h-9 w-9 items-center justify-center rounded-full bg-green text-sm font-medium text-white"
              v-if="!loggedInUser.googleAvatarUrl"
            >
              {{ loggedInUser.initials }}
            </p>
            <img
              v-else
              class="h-9 w-9 rounded-full border-2 border-gray-100 transition-all duration-200 hover:border-gray-200"
              :src="loggedInUser.googleAvatarUrl"
              :alt="loggedInUser.fullName"
            />
          </Link>
        </section>
      </nav>
    </header>

    <main class="mb-10 min-h-screen">
      <slot></slot>
    </main>

    <footer
      class="flex flex-col items-center justify-center space-y-4 px-4 py-12 text-center"
    >
      <div class="flex items-center gap-2 text-gray-400">
        <svg
          class="w-5"
          viewBox="0 0 30 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="0" width="22" height="27" rx="3" fill="currentColor" opacity="0.3" />
          <rect x="0" y="6" width="22" height="27" rx="3" fill="currentColor" />
        </svg>
        <span class="text-sm font-semibold tracking-tight">fieldnotes</span>
      </div>
    </footer>
  </div>
</template>
