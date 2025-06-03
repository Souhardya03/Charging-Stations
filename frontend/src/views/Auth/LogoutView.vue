<script setup>
import { useLogoutMutation } from '@/store/queries/auth';
import { useRoute } from 'vue-router';
const router = useRoute();
const {mutateAsync:logout} = useLogoutMutation();
const res = await logout();
localStorage.removeItem('token');
if (res.status === 200) {
  router.push("/login");
} else {
  console.error('Logout failed:', res.error);
}
</script>