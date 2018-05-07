// 产生八位随机数
export function getRandomNum() {
    let t = '';
    for (let i = 0; i < 8; i++) {
        t += Math.floor(Math.random() * 10);
    }
    return t;
}

// 将时间戳转换成日期
export function add0(m) {
    return m < 10 ? '0' + m : m;
}

export function formatDate(timeStamp) {
    timeStamp = timeStamp * 1000;
    let time = new Date(timeStamp);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    // let s = time.getSeconds();

    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
}

// 返回距当前日期前后某天的日期的毫秒数（时间戳）
export function getDate(index) {
    let now = new Date(); // 当前日期
    let newDate = new Date(now);
    newDate.setDate(now.getDate() + index); // 当前日期前后的天数（由index正负决定）
    return Math.round(newDate.getTime() / 1000);
}

// 后缀名是否为图片格式
export function isValidImg(filename) {
    return /\.(jpe?g|gif|png|bmp|webp)$/i.test(filename);
}

// 后缀名是否为视频格式
export function isValidVideo(filename) {
    // return /\.(mp4|flv|3gp|rmvb|avi)$/i.test(filename);
    return /\.(mp4|flv)$/i.test(filename);
}

// 后缀名是否为音频格式
export function isValidAudio(filename) {
    return /\.(mp3|wav)$/i.test(filename);
}

// 获取文件的扩展名
export function getFileExtension(filename) {
    const ext = filename.split('.').pop();
    return (ext === filename) ? '' : ext;
}
