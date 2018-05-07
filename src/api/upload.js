import fetch from '../utils/fetch';
import axios from 'axios';
import {getToken} from '../utils/auth';
//
const baseURL = '/upload/';
// const baseURL = 'http://118.190.76.81/';
//
// 文件上传
export function uploadFile(document) {
    axios({
        method: 'post',
        url: '/upload/file',
        baseURL: baseURL,
        data: {
            document
        },
        headers: {
            'source': 'web',
            'auth-token': getToken()
        }
    });
}
// export function uploadFile(document) {
//     const data = {
//         document
//     };
//     return fetch({
//         method: 'post',
//         url: '/upload/file',
//         data
//     });
// }

// 请求阿里云OSS临时授权
export function getAliyunOSS() {
    return fetch({
        method: 'get',
        url: 'aliyun/sts/auth'
    });
}
