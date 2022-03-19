export default {
    // baseURL: 'http://39.108.3.12:3000',  //后端地址
     baseURL: 'http://127.0.0.1:3000',


     proxyTable: {
      '/socket.io': {
        target: 'http://127.0.0.1:3000', //代理的服务地址
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      }
    },

   }
   