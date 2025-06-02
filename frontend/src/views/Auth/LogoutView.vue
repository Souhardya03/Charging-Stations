<script setup>
import { useLogoutMutation } from '@/store/queries/auth';

const {mutateAsync:logout} = useLogoutMutation();
const res = await logout();
if (res.status === 200) {
  window.location.href = '/login';
} else {
  console.error('Logout failed:', res.error);
}
</script>