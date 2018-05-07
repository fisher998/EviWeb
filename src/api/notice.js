import fetch from '../utils/fetch';

// 获取通知列表
export function getNoticeList(page, page_size) {
    const params = {
        page: page,
        page_size: page_size
    };
    return fetch({
        method: 'get',
        url: 'notification/list',
        params
    });
}

// 标记通知已读
export function getRead(mark_type, notify_id) {
    const params = {
        mark_type,
        notify_id
    };
    return fetch({
        method: 'get',
        url: 'notification/read',
        params
    });
}

// 删除指定通知消息
export function deleteNotice(notify_id) {
    const params = {
        notify_id
    };
    return fetch({
        method: 'get',
        url: 'notification/delete',
        params
    });
}

// 获取用户未读通知数
export function getNoticeCount() {
    return fetch({
        method: 'get',
        url: 'notification/count'
    });
}
