// let timeClock;
function setTime(time) {
    if (time < 10) {
        time = '0' + time;
    }
    return time;
}
export function clock() {
    let s = 0;
    let m = 0;
    let h = 0;
    let second;
    let minute;
    let hour;
    setInterval(function() {
        s++;
        if (s === 60) {
            s = 0;
            m++;
        };
        if (s === 60) {
            m = 0;
            h++;
        };
        second = setTime(s);
        minute = setTime(m);
        hour = setTime(h);
    }, 1000);
    console.log(hour, minute, second);
    // let time = {
    //     second,
    //     minute,
    //     hour
    // };
    // return time;
}
