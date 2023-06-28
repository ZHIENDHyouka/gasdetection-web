const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // lintOnSave:false,//关闭语法检测
  //开启代理
  devServer:{
    host:'0.0.0.0',//局域网访问
    port: 8082,
    proxy:{
      'api':{
        ws:false,
        target:'http://localhost:8083',
        changeOrigin:true,
        pathRewrite:{
          '^/api':'/'
        }
      },
    },
  }
})

