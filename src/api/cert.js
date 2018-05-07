import fetch from '../utils/fetch';

// 获取存证文件列表
export function getFileList(type, page, page_size) {
    const params = {
        type: type,
        page: page,
        page_size: page_size
    };
    return fetch({
        method: 'get',
        url: '/file/list',
        params
    });
}

// 获取当前挂链价格
export function getMountPrice() {
    return fetch({
        method: 'get',
        url: 'mount/price'
    });
}

// 挂链申请 单挂
export function postSingleMount(type, cert_id) {
    const data = {
        type,
        cert_id
    };
    return fetch({
        method: 'post',
        url: 'file/mount',
        data
    });
}

// 挂链申请 全挂
export function postFullMount(type) {
    const data = {
        type
    };
    return fetch({
        method: 'post',
        url: 'file/mount',
        data
    });
}

// 获取全挂存证号
export function getFullMountCertNo() {
    return fetch({
        method: 'get',
        url: 'full/mount/cert/no'
    });
}

// 存证文件详情
export function getDetailFile(cert_id) {
    const params = {
        cert_id: cert_id
    };
    return fetch({
        method: 'get',
        url: 'file/detail',
        params
    });
}

// 搜索文件
export function getSearchFile(key) {
    const params = {
        key: key
    };
    return fetch({
        method: 'get',
        url: 'file/search',
        params
    });
}

// 历史出证记录
export function getCertRecord(cert_id) {
    const params = {
        cert_id: cert_id
    };
    return fetch({
        method: 'get',
        url: 'certify/records',
        params
    });
}

// 出征详情
export function detailCert(apply_id) {
    const params = {
        apply_id
    };
    return fetch({
        method: 'get',
        url: 'certify/details',
        params
    });
}

// 申请出证 无需提供纸质版
export function postCertN(name, email, cert_id) {
    const data = {
        name,
        email,
        cert_id
    };
    return fetch({
        method: 'post',
        url: 'file/certify',
        data
    });
}

// 申请出证 需提供纸质版
export function postCertY(name, email, cert_id, with_paper, addr, phone) {
    const data = {
        name,
        email,
        cert_id,
        with_paper,
        addr,
        phone
    };
    return fetch({
        method: 'post',
        url: 'file/certify',
        data
    });
}

// 申请出庭
export function postCourt(cert_id, name, phone) {
    const data = {
        cert_id,
        name,
        phone
    };
    return fetch({
        method: 'post',
        url: 'file/court',
        data
    });
}

// 存证验证(源文档上传)
export function verifyWidthFile(cert_id) {
    const data = {
        cert_id
    };
    return fetch({
        method: 'post',
        url: 'file/verify',
        data
    });
}

// 存证验证(源文档不上传)
export function verifyNoFile(cert_id, key) {
    const data = {
        cert_id,
        key
    };
    return fetch({
        method: 'post',
        url: 'file/verify',
        data
    });
}

// 源文档不上传存证
export function certNoFile(hash, file_name) {
    const data = {
        hash,
        file_name
    };
    return fetch({
        method: 'post',
        url: 'file/empty/save',
        data
    });
}

// 源文档上传存证
export function certWithFile(file_key, file_name) {
    const data = {
        file_key,
        file_name
    };
    return fetch({
        method: 'post',
        url: 'file/exist/save',
        data
    });
}

// 重命名存证文件
export function renameFile(cert_id, name) {
    const data = {
        cert_id,
        name
    };
    return fetch({
        method: 'post',
        url: 'file/rename',
        data
    });
}

// 提交网页取证请求
export function postWebEvidence(type, url, cookie, width, height) {
    const data = {
        type,
        url,
        cookie,
        width,
        height
    };
    return fetch({
        method: 'post',
        url: 'pdf/print/apply',
        data
    });
}

// 检查指定网页打印任务的执行结果
export function getPrintResult(cert_key) {
    const params = {
        cert_key
    };
    return fetch({
        method: 'get',
        url: 'check/web/print/result',
        params
    });
}

// 能过存证id得到存证编号
export function getCertNo(cert_id) {
    return fetch({
        method: 'get',
        url: `get/cert/no/${cert_id}`
    });
}
