import fetch from '../utils/fetch';
import CryptoJS from 'crypto-js';

// 获取用户个人信息
export function getUserInfo() {
    return fetch({
        method: 'get',
        url: 'user/info'
    });
}

// 消费记录，交易流水
export function getTradeList(time_start, time_end, page, page_size) {
    const params = {
        time_start: time_start,
        time_end: time_end,
        page: page,
        page_size: page_size
    };
    return fetch({
        method: 'get',
        url: 'user/consumption/list',
        params
    });
}

// 提交建议无图片
export function postAdvice(text) {
    const data = {
        text: text
    };
    return fetch({
        method: 'post',
        url: 'user/advice/new',
        data
    });
}

// 提交建议有图片
export function postAdviceWidthImg(text, imgs) {
    const data = {
        text,
        imgs
    };
    return fetch({
        method: 'post',
        url: 'user/advice/new',
        data
    });
}

// 历史建议列表
export function getAdviceList() {
    return fetch({
        method: 'get',
        url: 'user/advice/list'
    });
}

// 单独验证用户密码
export function confirmPwd(pwd) {
    const params = {
        pwd: CryptoJS.MD5(pwd).toString()
    };
    return fetch({
        method: 'get',
        url: 'user/pass/verify',
        params
    });
}

// 申请退款
export function applyRefund(log_id, reason) {
    const data = {
        log_id,
        reason
    };
    return fetch({
        method: 'post',
        url: 'user/refund/apply',
        data
    });
}
