// 支付模块API
import fetch from '../utils/fetch';

export function getWechatQrcode(fee) {
    const params = {
        fee
    };
    return fetch({
        method: 'get',
        url: 'wechat/qrcode/pay/new',
        params
    });
}

// 查询微信扫码支付结果
export function getWechatPayResult(order_no) {
    const params = {
        order_no
    };
    return fetch({
        method: 'get',
        url: 'wechat/qrcode/pay/check',
        params
    });
}

// 跳转支付宝网页支付
export function getAliPay(fee, ignore, dest_key) {
    const params = {
        fee,
        ignore,
        dest_key
    };
    return fetch({
        method: 'get',
        url: 'alipay/page/pay',
        params
    });
}
