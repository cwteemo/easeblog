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
            '/blog': {
                target: "http://42.192.142.39/easyblog/public/index.php", //目标代理接口地址
                secure: false,
                changeOrigin: false, //开启代理本地虚拟服务器
                pathRewrite: {
                    '^/blog': '/blog',
                }
            },
            '/user': {
                target: "http://42.192.142.39/easyblog/public/index.php", //目标代理接口地址
                secure: false,
                changeOrigin: false, //开启代理本地虚拟服务器
                pathRewrite: {
                    '^/user': '/user',
                }
            },
            '/file': {
                target: "http://42.192.142.39/easyblog/public/index.php", //目标代理接口地址
                secure: false,
                changeOrigin: false, //开启代理本地虚拟服务器
                pathRewrite: {
                    '^/file': '/file',
                }
            },
            '/category': {
                target: "http://42.192.142.39/easyblog/public/index.php", //目标代理接口地址
                secure: false,
                changeOrigin: false, //开启代理本地虚拟服务器
                pathRewrite: {
                    '^/category': '/category',
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
