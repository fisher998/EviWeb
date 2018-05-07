import fetch from '../utils/fetch';

// 初次购买存储空间
export function firstBuyStorage(type) {
    const params = {
        type
    };
    return fetch({
        method: 'get',
        url: 'storage/buy',
        params
    });
}

// 扩展存储空间
export function expandStorage() {
    return fetch({
        method: 'get',
        url: 'storage/expand'
    });
}

// 续费存储空间
export function renweStorage() {
    return fetch({
        method: 'get',
        url: 'storage/renew'
    });
}

// 续费或扩展差价预算
export function assessStorage(type) {
    const params = {
        type
    };
    return fetch({
        method: 'get',
        url: 'storage/assessment',
        params
    });
}

