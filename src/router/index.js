import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/employee',
      name: 'employee',
      alias: '/',
      component: () => import('../views/Employee.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) {
          next()
        } else {
          ElMessage.error('請先登入')
          next({path:'/login'})
        }
      },
    },
  ],
})

export default router
