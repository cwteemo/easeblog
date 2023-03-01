import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import ElementPlus from 'element-plus';
import "element-plus/dist/index.css";
import "@/assets/icon/iconfont.css";

import Request from '@/utils/Request'
import message from '@/utils/Message'
import Table from '@/components/Table.vue'
import Cover from '@/components/Cover.vue'
import Dialog from '@/components/Dialog.vue'
import FileUpload from '@/components/FileUpload.vue'

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.Request = Request;
app.config.globalProperties.message = message;
app.config.globalProperties.globalInfo = {
    imageUrl:"/file/url?name="
}
app.component("Table",Table)
app.component("Cover",Cover)
app.component("Dialog",Dialog)
app.component("FileUpload",FileUpload)
app.mount('#app');