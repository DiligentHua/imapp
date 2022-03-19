import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
// import VueSocketIO from 'vue-socket.io'
import socketio from 'socket.io-client';
Vue.config.productionTip = false
Vue.use(VueCookies)
// set default config
Vue.$cookies.config('7d')

//socket
// Vue.use(new VueSocketIO({
//   // 控制台调试 console.log
//   debug: true,
//   // 连接地址 后端提供
//   // connection: SocketIO('/socket.io'),
//   connection: SocketIO('/socket.io'),
//   // vuex，不需要则不加
//   vuex: {
//     store,
//     mutationPrefix: "SOCKET_",
//     actionPrefix: "SOCKET_"
//   }
// }))


// Vue.prototype.serverUrl = "http://127.0.0.1:3000"
// console.log(1);
// Vue.prototype.socket = io("http://127.0.0.1:8081")

// Vue.prototype.socket.on('news', d => {
//   console.log('received news: ', d)
// })


Vue.prototype.$io = socketio('http://localhost:3000', {
    transports: ['websocket'],
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
