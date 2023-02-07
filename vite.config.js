import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        hmr: true,
        port: 3001,
        proxy: {
            '/api': {
                target: "http://42.192.142.39/", //目标代理接口地址
                secure: false,
                changeOrigin: true, //开启代理本地虚拟服务器
                pathRewrite: {
                    '^/api': '/api',
                }
            }
        }
    },
    resolve: {
        //配置路径别名
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
})
