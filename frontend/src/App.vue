<script setup>
import { RouterView } from 'vue-router'
import { useAuthQuery } from '@/store/queries/auth'
import Navbar from './components/Navbar.vue'
const {isSuccess} = useAuthQuery()
</script>

<template>
  <Navbar v-if="isSuccess" />
  <RouterView />
</template>
