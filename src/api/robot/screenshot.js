// 查询余额和录制时长
import {api} from '../../const/index';
export function screenshot(params) {
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let body = {
        'vnc_id': params
    };
    let init = {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: body
    };
    let url = `${api.url}evidencerobot/screenshot?vnc_id=${params}`;
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            // resolve(res);
            if (res.error === 0) {
                resolve(res);
            } else {
                reject(res);
            };
        });
    });
}
export function checkfile(prams) {
    let myHeaders = new Headers({
        // 'Content-Type': 'application/json',
        'source': 'web',
        'auth-token': api.auth_token
    });
    let init = {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: prams
    };
    console.log('我是验证接收到的参数', prams);
    let url = '/api/file/exist/save';
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            resolve(res);
            // if (res.error === 0) {
            //     resolve(res);
            // } else {
            //     reject(res);
            // };
        });
    });
}
// export function screenshotcert(prams) {
//     let myHeaders = new Headers({
//         // 'Content-Type': 'application/json',
//         'source': 'web',
//         'auth-token': api.auth_token
//     });
//     let init = {
//         method: 'post',
//         headers: myHeaders,
//         mode: 'cors',
//         cache: 'default',
//         body: prams
//     };
//     let url = '/web/evidencerobot/screenshotcert';
//     return new Promise((resolve, reject) => {
//         fetch(url, init).then(res => {
//             return res.json();
//         }).then(res => {
//             // console.log(res);
//             if (res.error === 0) {
//                 resolve(res);
//             } else {
//                 reject(res);
//             };
//         });
//     });
// }

