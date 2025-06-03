<script setup>
import { useLogoutMutation } from '@/store/queries/auth';
const {mutateAsync:logout} = useLogoutMutation();
const res = await logout();
localStorage.removeItem('token');
if (res.status === 200) {
  window.location.href = '/login';
} else {
  console.error('Logout failed:', res.error);
}
</script>