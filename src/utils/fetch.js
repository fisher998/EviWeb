import axios from 'axios';
import store from '../store';
import {getToken, removeToken} from './auth';

// 创建axios实例
const service = axios.create({
    // baseURL: 'http://keensting.fa123.com/web/',  // api的base_url
    baseURL: '/api/',
    timeout: 5000                            // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    // 在发送请求之前检测token
    config.headers['source'] = 'web';  // 传入固定值web
    if (store.getters.token) {
        config.headers['auth-token'] = getToken(); // 为每个请求添加token
    } else {
        config.headers['auth-token'] = '555'; // 没有获取到该值的时候,默认值为555,登录后可以获取到该值
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
});

// You can intercept requests or responses before they are handled by then or catch
// respone拦截器
// 如果登录信息过期，则返回到登录页
service.interceptors.response.use(function (res) {
    if (res.data.error && res.data.error === 30008) {
        removeToken();
    }
    return res;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default service;
