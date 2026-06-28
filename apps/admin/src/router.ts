import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from './lib/http';
import { RESOURCES } from './resources';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('./pages/Login.vue'), meta: { public: true } },
    {
      path: '/',
      component: () => import('./components/AppLayout.vue'),
      children: [
        { path: '', redirect: `/r/${RESOURCES[0].name}` },
        { path: 'r/:resource', name: 'list', component: () => import('./pages/ResourceList.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

router.beforeEach((to) => {
  const authed = !!getToken();
  if (!to.meta.public && !authed) return { name: 'login' };
  if (to.name === 'login' && authed) return { path: '/' };
  return true;
});

export default router;
