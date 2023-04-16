import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CodeEditor from '../components/CodeEditor.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'CodeEditor',
    component: CodeEditor
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
