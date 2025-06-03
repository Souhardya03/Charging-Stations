<script setup>
import { RouterView } from 'vue-router'
import { useAuthQuery } from '@/store/queries/auth'
import Navbar from './components/Navbar.vue'
const authquery = useAuthQuery()
console.log(authquery.data);

</script>

<template>
  <Navbar v-if="authquery.data.value" />
  <RouterView />
</template>
