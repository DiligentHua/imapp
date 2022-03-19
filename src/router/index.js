import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './index/'
import Login from './login/'
import Register from './register/'
import Search from './search/'
import UserHome from './userHome/'
import friendrequest from './friendrequest/'
import chatRoom from './chatRoom/'
import buildGroup from './buildGroup/'
import test from './test/'




Vue.use(VueRouter)

const routes = [
  Index,
  Login,
  Register,
  Search,
  UserHome,
  friendrequest,
  chatRoom,
  buildGroup,
  test
]

const router = new VueRouter({
  routes
})

export default router
