<script setup>
import { Link, Head, useForm } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import InputText from '@/components/InputText.vue'
import InputEmail from '@/components/InputEmail.vue'
import InputPassword from '@/components/InputPassword.vue'
import InputButton from '@/components/InputButton.vue'
import GoogleButton from '@/components/GoogleButton.vue'

const form = useForm({
  fullName: null,
  email: null,
  password: null
})

const containsSpecialChars = computed(() => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  return specialChars.test(form.password)
})
const passwordIsValid = computed(() => {
  return form.password?.length >= 8
})

const disableSignupButton = computed(() => {
  if (!passwordIsValid.value) return true
  if (!containsSpecialChars.value) return true
  if (form.processing) return true
  return false
})
</script>

<template>
  <Head title="Sign up | FieldNotes"></Head>
  <section
    class="bg-linear-to-b from-brand-50/10 flex min-h-screen flex-col justify-center to-[#F9FAFB] text-black sm:items-center"
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
            <rect
              x="8"
              y="0"
              width="22"
              height="27"
              rx="3"
              fill="currentColor"
              opacity="0.3"
            />
            <rect
              x="0"
              y="6"
              width="22"
              height="27"
              rx="3"
              fill="currentColor"
            />
          </svg>
          <span class="text-lg font-semibold tracking-tight">fieldnotes</span>
        </Link>

        <h1 class="text-2xl font-bold tracking-tight">Create your account</h1>
        <p class="text-gray text-lg">
          Welcome! Please enter your details to sign up
        </p>
      </section>
      <p
        class="my-4 w-full rounded-xl border border-red-200/60 bg-red-50 p-4 text-sm text-red-500"
        v-if="form.errors.signup"
      >
        {{ form.errors?.signup }}
      </p>
      <form
        @submit.prevent="form.post('/signup')"
        class="mb-4 flex flex-col space-y-6"
      >
        <InputText v-model="form.fullName">
          <p class="absolute text-red-500" v-if="form.errors.fullName">
            {{ form.errors.fullName }}
          </p>
        </InputText>
        <InputEmail v-model="form.email">
          <p class="absolute text-red-500" v-if="form.errors.email">
            {{ form.errors.email }}
          </p>
        </InputEmail>
        <InputPassword v-model="form.password">
          <p class="absolute text-red-500" v-if="form.errors.password">
            {{ form.errors.password }}
          </p>
        </InputPassword>
        <ul class="flex justify-between text-sm">
          <li
            class="flex items-center space-x-1 text-gray-500"
            :class="{ 'text-green': passwordIsValid }"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              class="fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_74_1911)">
                <path
                  d="M8 0C3.58867 0 0 3.58867 0 8C0 12.4113 3.58867 16 8 16C12.4113 16 16 12.4113 16 8C16 3.58867 12.4113 0 8 0ZM12.1333 7.008L9.18267 9.90467C8.66067 10.4167 7.98867 10.672 7.316 10.672C6.65067 10.672 5.98533 10.4213 5.46533 9.91933L4.19933 8.67467C3.93667 8.41667 3.93333 7.99467 4.19133 7.732C4.44867 7.46867 4.872 7.46533 5.134 7.724L6.396 8.96467C6.91333 9.46467 7.73 9.462 8.25 8.95267L11.2 6.05667C11.462 5.798 11.8827 5.80267 12.1427 6.06533C12.4007 6.328 12.3967 6.75 12.1333 7.008Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_74_1911">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>At least 8 characters</span>
          </li>
          <li
            class="flex items-center space-x-1 text-gray-500"
            :class="{ 'text-green': containsSpecialChars }"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              class="fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_74_1911)">
                <path
                  d="M8 0C3.58867 0 0 3.58867 0 8C0 12.4113 3.58867 16 8 16C12.4113 16 16 12.4113 16 8C16 3.58867 12.4113 0 8 0ZM12.1333 7.008L9.18267 9.90467C8.66067 10.4167 7.98867 10.672 7.316 10.672C6.65067 10.672 5.98533 10.4213 5.46533 9.91933L4.19933 8.67467C3.93667 8.41667 3.93333 7.99467 4.19133 7.732C4.44867 7.46867 4.872 7.46533 5.134 7.724L6.396 8.96467C6.91333 9.46467 7.73 9.462 8.25 8.95267L11.2 6.05667C11.462 5.798 11.8827 5.80267 12.1427 6.06533C12.4007 6.328 12.3967 6.75 12.1333 7.008Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_74_1911">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>At least 1 special characters</span>
          </li>
        </ul>
        <p class="text-gray">
          You agree to our
          <a href="/terms" class="text-brand hover:underline">Terms Of Use</a>
          and
          <a href="/privacy-policy" class="text-brand hover:underline"
            >Privacy Policy</a
          >
        </p>
        <InputButton
          :processing="form.processing"
          :disabled="disableSignupButton"
          >Sign up</InputButton
        >
      </form>
      <GoogleButton />
    </main>
    <footer class="text-gray my-8 text-center">
      <p>
        Already have an account?
        <Link href="/login" class="text-brand hover:underline">Login</Link>
      </p>
    </footer>
  </section>
</template>
