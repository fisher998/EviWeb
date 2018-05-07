import fetch from '../utils/fetch';
import CryptoJS from 'crypto-js';

// 修改手机号-发送旧手机验证码
export function sendOldMobileCode() {
    return fetch({
        method: 'get',
        url: 'change/phone/code/old'
    });
}

// 修改手机号-验证旧手机号(验证码)
export function verifyOldPhone(request_code, verify_code) {
    const data = {
        request_code,
        verify_code
    };
    return fetch({
        method: 'post',
        url: 'user/phone/verify/old',
        data
    });
}

// 修改手机号-发送新手机验证码
export function sendNewPhone(request_code, new_phone) {
    const params = {
        request_code,
        new_phone
    };
    return fetch({
        method: 'get',
        url: 'change/phone/code/new',
        params
    });
}

// 修改手机号-验证新手机号
export function verifyNewPhone(request_code, verify_code) {
    const data = {
        request_code,
        verify_code
    };
    return fetch({
        method: 'post',
        url: 'user/phone/verify/new',
        data
    });
}

// 修改密码
export function modifyPass(verify_code, new_pwd) {
    const data = {
        verify_code: verify_code,
        new_pwd: CryptoJS.MD5(new_pwd).toString()
    };
    return fetch({
        method: 'post',
        url: 'user/password/modify',
        data
    });
}

// 发送短信验证码-修改密码
export function sendModifyPassCode(pwd) {
    const params = {
        pwd: CryptoJS.MD5(pwd).toString()
    };
    return fetch({
        method: 'get',
        url: 'modify/phone/code/get',
        params
    });
}

// 重置密码第一步,输入手机号、图形验证码,通过校验后,返回操作授权码
export function resetPwdFirst(phone, graphics_key, graphics_code) {
    const params = {
        phone,
        graphics_key,
        graphics_code
    };
    return fetch({
        method: 'get',
        url: 'user/pass/reset/key',
        params
    });
}

// 重置密码，发送短信验证码
export function sendPhoneCode(op_key) {
    const params = {
        op_key
    };
    return fetch({
        method: 'get',
        url: 'reset/password/phone/code',
        params
    });
}

// 重置密码-提交新密码 重置密码第二步,填写手机验证码和新密码后,提交
export function submitNewPwd(op_key, phone_code, new_pwd) {
    const data = {
        op_key,
        phone_code,
        new_pwd: CryptoJS.MD5(new_pwd).toString()
    };
    return fetch({
        method: 'post',
        url: 'user/pass/reset/execute',
        data
    });
}

