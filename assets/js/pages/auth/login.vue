<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputEmail from '@/components/InputEmail.vue'
import InputPassword from '@/components/InputPassword.vue'
import InputButton from '@/components/InputButton.vue'
import GoogleButton from '@/components/GoogleButton.vue'

const form = useForm({
  email: null,
  password: null,
  rememberMe: false
})

const disableLoginButton = computed(() => {
  if (!form.email) return true
  if (!form.password) return true
  if (form.processing) return true
  return false
})
</script>

<template>
  <Head title="Login | FieldNotes"></Head>
  <section
    class="flex min-h-screen flex-col justify-center bg-gradient-to-b from-brand-50/10 to-[#F9FAFB] text-black sm:items-center"
  >
    <main
      class="mt-10 px-6 py-12 text-black sm:w-7/12 sm:px-10 md:w-6/12 lg:w-5/12 xl:w-4/12"
    >
      <section
        class="mb-6 flex flex-col items-center justify-center space-y-2 text-center"
      >
        <Link href="/" class="flex items-center gap-2">
          <svg
            class="w-9"
            viewBox="0 0 30 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="8" y="0" width="22" height="27" rx="3" fill="currentColor" opacity="0.3" />
            <rect x="0" y="6" width="22" height="27" rx="3" fill="currentColor" />
          </svg>
          <span class="text-lg font-semibold tracking-tight">fieldnotes</span>
        </Link>
        <h1 class="text-2xl font-bold tracking-tight">Log into your account</h1>
        <p class="text-lg text-gray">Welcome back, please enter your details</p>
        <p
          class="my-4 w-full rounded-xl border border-red-200/60 bg-red-50 p-4 text-sm text-red-500"
          v-if="form.errors.email || form.errors.login"
        >
          {{ form.errors.login || form.errors.email }}
        </p>
      </section>
      <form
        @submit.prevent="form.post('/login')"
        class="mb-4 flex flex-col space-y-6"
      >
        <InputEmail v-model="form.email" />
        <InputPassword v-model="form.password" />
        <section class="flex justify-between text-sm accent-brand">
          <label for="rememberMe" class="flex items-center space-x-2 text-gray">
            <input id="rememberMe" type="checkbox" v-model="form.rememberMe" class="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand/20" />
            <span>Remember me</span>
          </label>

          <Link href="/forgot-password" class="text-brand hover:underline"
            >Forgot Password</Link
          >
        </section>
        <InputButton
          :processing="form.processing"
          :disabled="disableLoginButton"
          >Login</InputButton
        >
      </form>
      <GoogleButton />
    </main>
    <footer class="my-8 text-center text-gray">
      <p>
        Don't have an account yet?
        <Link href="/signup" class="text-brand hover:underline">Sign up</Link>
      </p>
    </footer>
  </section>
</template>
