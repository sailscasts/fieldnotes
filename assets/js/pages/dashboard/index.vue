<script setup>
import { usePage, Link, Head } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

defineOptions({
  layout: AppLayout
})
const page = usePage()
const loggedInUser = page.props.loggedInUser
</script>
<template>
  <Head title="Dashboard | FieldNotes"></Head>
  <section class="mx-auto max-w-4xl px-4 pt-10">
    <section>
      <h3 class="mb-2 text-xl font-bold tracking-tight text-brand">
        Welcome, {{ loggedInUser.fullName }}
      </h3>
      <p class="mb-4 text-sm text-gray-500">
        You are logged in as {{ loggedInUser.email }}
      </p>
      <Link
        href="/profile"
        class="mt-2 inline-flex rounded-xl border border-brand px-5 py-2.5 text-sm font-medium text-brand transition-all duration-200 hover:bg-brand hover:text-white"
      >
        Edit Profile
      </Link>
    </section>
  </section>
</template>
