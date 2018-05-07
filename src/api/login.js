import fetch from '../utils/fetch';
import CryptoJS from 'crypto-js';

// 用户手机号登录
export function loginByMobile(phone, pwd) {
    const data = {
        phone: phone,
        pwd: CryptoJS.MD5(pwd).toString()
    };
    return fetch({
        method: 'post',
        url: 'user/login',
        data
    });
}

// 退出登录
export function logout() {
    return fetch({
        method: 'get',
        url: 'user/logout'
    });
}

// 忘记密码 重置密码
export function resetPwd(phone) {
    const data = {
        phone: phone
    };
    return fetch({
        method: 'post',
        url: 'user/password/reset',
        data
    });
}
