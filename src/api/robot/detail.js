// 查询余额和录制时长
import {api} from '../../const/index';
export function detail() {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let init = {
        method: 'get',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let url = `${api.url}evidencerobot/detail`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}

// 开始录屏
export function startvnc() {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let init = {
        method: 'get',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let url = `${api.url}evidencerobot/startvnc`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}

// 结束录屏
export function stopvnc() {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let init = {
        method: 'get',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let url = `${api.url}evidencerobot/stopvnc`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}

// 结束录屏
export function checkallocation() {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let init = {
        method: 'get',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let url = `${api.url}evidencerobot/checkallocation`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}
// 登陆
export function login() {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': 'VtQ095mQQ7dZAaYH'
    });
    let body = {
        'phone': '18811715625',
        'pwd': 'c260a5e87abca1a565132f2e7eff4eaa'
    };
    let init = {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: body
    };
    let url = `${api.url}user/login?phone=18811715625&pwd=c260a5e87abca1a565132f2e7eff4eaa`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}
export function polling(params) {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    // let body = {
    //     'choice': params
    // };
    let init = {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let url = `${api.url}evidencerobot/polling?choice=${params}`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}
// 排队
export function queue() {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let init = {
        method: 'get',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let url = `${api.url}evidencerobot/queue`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}

