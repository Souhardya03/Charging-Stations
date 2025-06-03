<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useLoginMutation } from '@/store/queries/auth'
import { toast } from 'vue3-toastify'
const form = ref({
  email: '',
  password: '',
})

const router = useRouter()
const { mutateAsync: login } = useLoginMutation()
const handleSubmit = async () => {
  try {
    const response = await login(form.value)
    console.log(response);
    
    if (response.status === 200) {
      router.push('/')
      setTimeout(() => {
        toast.success('Login successful',{
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }, 100)
    }
  } catch (error) {
    toast.error(error.response?.data?.message,{
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    
  }
}
</script>
<template>
  <main class="flex flex-col min-w-full w-full items-center justify-center min-h-screen">
    <div
      class="flex min-h-full min-w-full flex-1 gap-6 flex-col justify-center items-center px-6 py-12 lg:px-8"
    >
      <div
        class="sm:mx-auto bg-white px-6 py-12 lg:px-8 rounded-2xl gap-6 flex flex-col justify-center items-center sm:w-full sm:max-w-sm shadow-2xl"
      >
        <div class="sm:mx-auto flex flex-col justify-center items-center sm:w-full sm:max-w-sm">
          <img
            class="mx-auto h-20 w-auto"
            src="/Logo.svg"
            alt="Your Company"
          />
          <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
              <label for="email" class="block text-sm/6 font-medium text-gray-900"
                >Email address</label
              >
              <div class="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  autocomplete="email"
                  required="true"
                  v-model="form.email"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div class="flex flex-col pb-4 gap-2">
              <label for="password" class="block text-sm/6 font-medium text-gray-900"
                >Passsword</label
              >
              <div class="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required="true"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  v-model="form.password"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div class="">
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?
            {{ ' ' }}
            <RouterLink to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500"
              >Register here</RouterLink
            >
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
