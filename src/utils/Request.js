import axios from "axios";
import {ElLoading} from "element-plus";
import message from "@/utils/Message";
import router from "@/router";

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";

const request = (config) => {
    let {url, params, dataType = 'form', showLoading = true} = config;
    let contentType = contentTypeForm
    if (dataType === 'json') {
        contentType = contentTypeJson;
    } else if (dataType === 'file') {
        contentType = contentTypeFile;
        let param = new FormData();
        for (let key in params) {
            param.append(key, params[key]);
        }
        params = param;

    }

    const instance = axios.create({
        baseURL: '/',
        timeout: 10 * 1000,
        headers: {
            'Content-Type': contentType,
            'X-Requested-With': 'XMLHttpRequest',

        }
    })
    let loading = null;
    instance.interceptors.request.use(
        (config) => {
            if (showLoading) {
                loading = ElLoading.service({
                    lock: true,
                    text: '加载中......',
                    background: 'rgba(0,0,0,0.7)',
                })
            }
            return config
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            message.error('发送请求失败1')
            return Promise.reject("发送请求失败2");
        }
    )
    instance.interceptors.response.use(
        (response) => {
            if (showLoading && loading) {
                loading.close();
            }
            const responseData = response.data;
            if (responseData.errorCode === 0) {
                return responseData.data;
            } else {
                if (responseData.errorCode === 10001) {
                    setTimeout(() => {
                        router.push('/login');
                    })
                }
                if (config.errorCallback) {
                    config.errorCallback();
                }
                return Promise.reject(responseData.message)
            }
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            return Promise.reject("网络异常")
        }
    )

    //返回方式一
    return instance.post(url, params).catch(error => {
        return null;
    })

    //返回方式二  不推荐
    /*let result = new Promise((resolve, reject) => {
        instance.post(url, params).then(res => {
            resolve(res)
        }).catch(error => {
            message.error('发送请求失败')
        })
    })
    return result;*/
}

export default request;