import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import RegisterView from '../views/Auth/RegisterView.vue'
import LogoutView from '../views/Auth/LogoutView.vue'
import DashboardView from '../views/Dashboard/DashboardView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ],
  
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 
 
  if (token && to.name === 'login') {
    next({ name: 'home' });
  }
  else if (!token && (to.name !== 'login' && to.name !== 'register')) {
    next({ name: 'login' });
  }
   else {
    next();
  }
});

export default router
