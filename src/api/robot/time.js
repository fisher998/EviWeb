// 获取国家授时中心的时间
export function time() {
    // const params = {
    //     app: 'life.time',
    //     appkey: '30791',
    //     sign: 'cb4daee6fd16e23bb8bcbeb3a484ef43'
    // };
    let myHeaders = new Headers({
        'Content-Type': 'application/json'
    });
    let init = {
        method: 'get',
        headers: myHeaders,
        mode: 'no-cors',
        cache: 'default'
    };
    let url = 'https://sapi.k780.com/?app=life.time&appkey=30791&sign=cb4daee6fd16e23bb8bcbeb3a484ef43';
    return new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            return res.json();
        }).then(res => {
            resolve(res);
        });
    });
}
