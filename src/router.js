import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/landing-page'
    },
    {
      path: '/manga-list',
      name: 'manga-list',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "manga_list" */ './views/MangaList.vue')
    },
    {
      path: '/sign-in',
      name: 'Sign In',
      component: () => import(/* webpackChunkName: "sign_in" */ './views/SignOn.vue')
    },
    {
      path: '/landing-page',
      component: () => import(/* webpackChunkName: "landing_page" */ './views/LandingPage.vue')
    }
  ]
})
