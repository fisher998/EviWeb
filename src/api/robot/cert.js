import Cookies from 'js-cookie';
// 查询余额和录制时长
export function cert() {
    let url = '/cer/Service1';
    let myHeaders = new Headers({
        'Content-Type': 'application/json'
    });
    let body = {
        'file': 'test.pdf',
        'cert': 'gdcaukey.cer'
    };
    let init = {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(body),
        credentials: 'include'
    };
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            Cookies.set('set-cookie', res.headers.get('set-cookie1'));
            console.log('set-cookie1', res.headers.get('set-cookie1'));
            return res.json();
        }).then(res => {
            resolve(res);
        });
    });
}
export function sign(params) {
    let url = '/cer/Service2';
    // let url = 'http://114.215.42.252:8080/Service2';
    let myHeaders = new Headers({
        'Content-Type': 'application/json',
        'set-cookie': Cookies.get('set-cookie')
    });
    let init = {
        method: 'post',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(params),
        credentials: 'include'
    };
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            resolve(res);
        });
    });
}
