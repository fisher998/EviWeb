import fetch from '../utils/fetch';
import CryptoJS from 'crypto-js';

// 发送短信验证码-用户注册
export function sendMobileCode(phone, graphics_code, key) {
    const params = {
        phone: phone,
        graphics_code: graphics_code,
        key: key
    };
    return fetch({
        method: 'get',
        url: 'register/phone/code/get',
        params
    });
}

// 用户注册
export function register(phone, pwd, phone_code) {
    const data = {
        phone: phone,
        pwd: CryptoJS.MD5(pwd).toString(),
        phone_code: phone_code
    };
    return fetch({
        method: 'post',
        url: 'user/register',
        data
    });
}
