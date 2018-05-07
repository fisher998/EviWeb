<template>
    <div class="wrap">
        <div class="top">
            <top :user-password="vnc.user_password" :user-time="userInfo.time" :user-balance="userInfo.balance"
            :avail-hour="setTime(userInfo.hour)" :avail-minute="setTime(userInfo.minute)" :avail-second="setTime(userInfo.second)"></top>
        </div>
        <div class="content" id="screenShot">
            <div v-if="forensicsStatus.begin===0">
                <noticeforUse></noticeforUse>
            </div>
            <div v-else>
                <iframe id="iframe" class="iframe" :src="vnc.url" width="100%" height="400" frameborder="0"></iframe>
                <!-- <iframe id="iframe" src="http://localhost:8080/#/user" class="iframe" width="100%" height="400" frameborder="0"></iframe> -->
            </div>
            <!-- <canvas id="canvas"></canvas> -->
            <div id="img">

            </div>
        </div>
        <router-view></router-view>
        <!-- <noticeforUse></noticeforUse> -->
        <div class="footer df">
            <div class="play tc">
            <div v-if="forensicsStatus.begin===0" @click="beginForensics">
                <img class="img" src="./img/play.png" alt="">
                <h1 class="f12 color-white" >开始取证</h1>
            </div>
            <div v-else @click="pauseForensics" class="pause">
                <img class="img" src="./img/pause.png" alt="">
                <h1 class="f12 color-white" >停止</h1>
            </div>
            </div>
            <div class="screenshot tc">
                <div v-if="forensicsStatus.begin===0">
                    <img style="color:black" src="./img/screenshot_b.png" alt="">
                    <h1 class="f12 color-grey">截屏</h1>
                </div>
                <div v-else @click="screenShot">
                    <img src="./img/screenshot.png" alt="">
                    <h1 class="f12 color-white">截屏</h1>
                </div>
            </div>
            <div class="time tr">
                <div class="vm">
                    <div>
                        <div v-if="forensicsStatus.begin===0">
                            <span class="f18 color-white">00:</span>
                            <span class="f18 color-white">00:</span>
                            <span class="f18 color-white">00</span>
                        </div>
                        <div v-else>
                            <span class="f18 color-white">{{setTime(recordTime.hour)}}:</span>
                            <span class="f18 color-white">{{setTime(recordTime.minute)}}:</span>
                            <span class="f18 color-white">{{setTime(recordTime.second)}}</span>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
        <!-- 取证结束弹窗 -->
        <el-dialog :visible.sync="endForensicsStatus" title="取证结束" class="endForensics tc" size="tiny" :show-close="true">

            <img src="./img/file.png" alt="" class="tc">
            <div class="word">
                <p class="f16">取证结束，存证文件已保存。</p>
                <!-- <div v-if="forensicsStatus.begin===0">
                    <p class="f16">录制时间: 00 : 00 : 00</p>
                </div> -->
                <div>
                    <p class="f16">录制时间: {{setTime(recordTime.hour)}} : {{setTime(recordTime.minute)}} : {{setTime(recordTime.second)}}</p>
                </div>
            </div>
            <div class="button">
                <el-button class="beginForensics" @click="back">开始新的取证</el-button>
                <el-button class="searchFile" type="primary" @click="searchFile">查看存证文件</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="queueStatus" title="队列" size="tiny"
        :before-close="handleClose">
            <!-- <br><br>你前面还有{{queueWait}}人在排队～ -->
            <p class="f16" v-if="queueNum===1000005">十分抱歉，暂无可用的服务器资源，请耐心等待，等待过程中请不要关闭本窗口。<br><br>你前面还有{{queueWait}}人,请稍候～</p>
            <p class="f16" v-if="queueNum===1000003">正在等待分配服务器资源，请稍候～</p>
            <p class="f16" v-if="queueNum===3000004">十分抱歉，暂无可用的服务器资源，请耐心等待，等待过程中请不要关闭本窗口。</p>
            <p class="f16" v-if="queueNum===3000006">感谢你的耐心等待，你现在可以使用自动取证服务了，请在倒计时结束前进入，否则将重新进入队列。</p>
            <p class="f16" v-if="queueNum===1000004">由于你在规定的时间内未进入系统，已取消队列。</p>
            <div class="tc mt20">
                <el-button class="btn" @click="cancelQueue">取消</el-button>
                <el-button v-if="queueNum===1000003||queueNum===1000005||queueNum===3000004" class="btn" type="primary" @click="beginForensics" disabled="">开始使用&nbsp;<span v-if="queueNum===3000006">{{setTime(timer)}}s</span></el-button>
                <!-- <el-button v-else class="btn" type="primary" @click="beginForensics">开始使用&nbsp;<span v-if="queueNum===3000006">{{setTime(timer)}}s</span></el-button> -->
                <el-button v-else-if='queueNum===1000004' class="btn" type="primary" @click="beginForensics">重新开始</el-button>
                <el-button v-else class="btn" type="primary" @click="beginForensics">开始使用&nbsp;<span v-if="queueNum===3000006">{{setTime(timer)}}s</span></el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="environmentStatus" 
        :show-close="false"
        class="environment"
        size="tiny">
            <div slot="title" class="tc">
                <img src="./img/environment.png" class="icon" alt="">
                <p class="color-white f16">
                    为了保证法律效力，正在检查执行环境，该步骤对于法院能否采信该取证结果非常重要！请不要中断，等待执行完成。
                </p>
            </div>
            <!-- <p class="color-primary">杀毒...</p> -->
            <!-- <el-progress :percentage="environmentProgress" ></el-progress> -->
        </el-dialog>

    </div>
</template>
<script>
import top from './innerPage/top';
import bottom from './innerPage/bottom';
import noticeforUse from './innerPage/noticeforUse';
import panelTitle from '../../PanelTitle/PanelTitle';
import {stopvnc, startvnc, checkallocation, polling, queue} from '../../../api/robot/detail.js';
import {screenshot} from '../../../api/robot/screenshot.js';
// import {iframe2image} from 'iframe2image';
// document.domain = 'fa123.com';
export default {
    created() {
        this.getDetails();
        // this.note();
    },
    data() {
        return {
            open: false,
            userInfo: '',
            endForensicsStatus: false,
            screenshotStatus: false,
            environmentStatus: false,
            queueStatus: false,
            queueNum: 3000004,
            queueInterval: '',
            queueEnd: 0,
            timer30Interval: '',
            queueWait: 0,
            forensicsStatus: {
                begin: 0,
                pause: 1
            },
            timepiece: {
                hour: '00',
                minute: '00',
                second: '00'
            },
            beginTime: 0,
            environmentProgress: 30,
            clearInterval: '',
            file_key: '',
            vnc: {
                id: 0,
                user_password: 0,
                ip: '',
                user_port: '',
                url: ''
            },
            recordTime: {
                hour: 0,
                minute: 0,
                second: 0
            },
            pollingInterval: '',
            timer: 30
        };
    },
    methods: {
        note() {
            if (window.Notification) {
                if (Notification.permission === 'granted') {
                    console.log(Notification.permission);
                    let note = new Notification('余额不足');
                    console.log(note);
                }
            } else {
                this.$message({
                    type: 'warning',
                    message: '您的浏览器不支持'
                });
            }
        },
        screenShot() {
            let _this = this;
            let vnc_id = this.vnc.id;
            screenshot(vnc_id).then(res => {
                console.log(res);
                this.$message({
                    type: 'success',
                    message: '截屏成功'
                });
                return checkallocation();
            }, rej => {
                this.$message({
                    type: 'error',
                    message: '截屏失败，请联系管理员'
                });
                console.log(rej);
            }).then(res => {
                _this.userInfo = res.data.user_detail;
                clearInterval(_this.timeClock);
                _this.countDown();
                console.log('截屏后刷新余额', res);
            }, rej => {
                console.error(rej);
            });
        },
        environmentTest() {
            this.environmentStatus = true;
        },
        beginForensics() {
            let _this = this;
            if (_this.userInfo.balance === 0) {
                this.$message({
                    type: 'info',
                    message: '您的余额不足，无法进行录屏，请充值'
                });
            } else {
            startvnc().then(res => {
                clearInterval(_this.queueInterval);
                _this.queueStatus = false;
                _this.forensicsStatus.begin = 1;
                _this.beginTime = (new Date().getTime() / 100).toFixed(0);
                _this.endForensicsStatus = false;
                _this.vnc.id = res.data.id;
                _this.vnc.user_password = res.data.user_password;
                // console.log('我是vnc密码', _this.vnc.user_password);
                _this.vnc.ip = res.data.ip;
                // _this.vnc.ip = 'robot1.fa123.com';
                _this.vnc.user_port = res.data.user_port;
                _this.vnc.url = `http://${_this.vnc.ip}:${_this.vnc.user_port}`;
                _this.countDown();
                _this.clock();
                this.pollings();
                console.log(res);
                // 关闭排队窗口
                // _this.queueStatus = false;
            }, rej => {
                console.error(rej);
                if (rej.error === 3000003) {
                    this.$message({
                        type: 'error',
                        message: rej.info
                    });
                }
                if (rej.error === 3000004) {
                    this.queueNum = 3000004;
                    this.queue();
                };
                if (rej.error === 3001000) {
                    this.$confirm('您的存储空间不足, 是否购买空间?', '提示', {
                        confirmButtonText: '购买空间',
                        cancelButtonText: '取消',
                        type: 'warning',
                        closeOnClickModal: false
                        }).then(() => {
                            this.$router.push({path: '/buy'});
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消取证'
                            });
                        });
                };
                if (rej.error === 3001001) {
                    this.$confirm('您的存储空间已不足10M, 是否继续录屏?', '提示', {
                        confirmButtonText: '继续录屏',
                        cancelButtonText: '购买空间',
                        type: 'warning',
                        closeOnClickModal: false
                        }).then(() => {
                            this.beginForensics();
                        }).catch(() => {
                            this.$router.push({path: '/buy'});
                        });
                };
            });
            }
        },
        queue() {
            let _this = this;
            // this.queueStatus = true;
            let queueInterval = setInterval(() => {
                queue().then(res => {
                    console.log('排队', res);
                    _this.queueStatus = true;
                    if (res.data) {
                        _this.queueStatus = true;
                        _this.queueNum = 1000005;
                        _this.queueWait = res.data + 1;
                    } else {
                        _this.queueStatus = true;
                        _this.queueNum = 1000005;
                        _this.queueWait = 1;
                    };
                }, rej => {
                    console.log(rej);
                    if (rej.error === 3000006) {
                        _this.queueNum = 3000006;
                        clearInterval(queueInterval);
                        _this.timers();
                    } else {
                        _this.queueStatus = false;
                        clearInterval(queueInterval);
                    };
                    if (rej.error === 3000007) {
                        _this.queueStatus = false;
                        // _this.beginForensics();
                        clearInterval(queueInterval);
                    };
                });
                if (_this.queueEnd === 1) {
                    clearInterval(queueInterval);
                };
            }, 2000);
            this.queueInterval = queueInterval;
        },
        cancelQueue() {
            this.queueStatus = false;
            this.queueEnd === 1;
            clearInterval(this.queueInterval);
        },
        handleClose() {
            this.$confirm('您是否确定关闭？关闭将会重新进入排队。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
                closeOnClickModal: false
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '成功关闭 !'
                });
                this.queueStatus = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消。'
                });
            });
        },
        pauseForensics() {
            this.$confirm('是否终止本次取证?请确认是否已取证完成。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let _this = this;
                stopvnc().then(res => {
                    _this.forensicsStatus.begin = 0;
                    _this.endForensicsStatus = true;
                    _this.queueStatus = false;
                    clearInterval(_this.timeClock);
                    clearInterval(_this.recordtimeClock);
                    clearInterval(_this.pollingInterval);
                    clearInterval(_this.queueInterval);
                    this.$message({
                    type: 'success',
                    message: '取证成功'
                    });
                    console.log(res);
                }, rej => {
                    clearInterval(this.pollingInterval);
                    this.$message({
                    type: 'error',
                    message: rej.info
                    });
                    console.error(rej);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消停止取证'
                });
             });
        },
        searchFile() {
            this.$router.push({path: '/file'});
        },
        // 获取用户详情
        getDetails() {
            let _this = this;
            checkallocation().then(res => {
                this.userInfo = res.data.user_detail;
                console.log(res, '我的详情接口');
                this.recordTime.hour = res.data.record_time_hour;
                this.recordTime.minute = res.data.record_time_minute;
                this.recordTime.second = res.data.record_time_second;
                if (res.data.vnc) {
                        _this.forensicsStatus.begin = 1;
                        _this.beginTime = (new Date().getTime() / 100).toFixed(0);
                        _this.endForensicsStatus = false;
                        _this.vnc.id = res.data.vnc.id;
                        _this.vnc.user_password = res.data.vnc.user_password;
                        // console.log('我是vnc密码', _this.vnc.user_password);
                        _this.vnc.ip = res.data.vnc.ip;
                        _this.vnc.user_port = res.data.vnc.user_port;
                        _this.vnc.url = `http://${_this.vnc.ip}:${_this.vnc.user_port}`;
                        _this.countDown();
                        _this.clock();
                        this.pollings();
                } else {

                }
            });
        },
        setTime(time) {
            if (time < 10) {
                time = '0' + time;
            };
            if (time === 60) {
                time = '00';
            }
            return time;
        },
        // 计时
        clock() {
            let s = this.recordTime.second;
            let m = this.recordTime.minute;
            let h = this.recordTime.hour;
            let _this = this;
            this.recordtimeClock = setInterval(function() {
                s++;
                _this.recordTime.second = s;
                if (s === 60) {
                    s = 0;
                    m++;
                    _this.recordTime.minute = m;
                };
                if (m === 60) {
                    m = 0;
                    h++;
                    _this.recordTime.hour = h;
                };
                // console.log(h, m, s);
            }, 1000);
        },
        // 倒计时30秒
        timers() {
            let s = 30;
            let _this = this;
            _this.timer30Interval = setInterval(() => {
                s--;
                _this.timer = s;
                if (s <= 0) {
                    clearInterval(_this.timer30Interval);
                    _this.queueNum = 1000004;
                    // _this.queueStatus = false;
                    // _this.queue();
                }
            }, 1000);
        },
        countDown() {
            let s = this.userInfo.second;
            let m = this.userInfo.minute;
            let h = this.userInfo.hour;
            // let s = 10;
            // let m = 0;
            // let h = 0;
            let _this = this;
            _this.timepiece.second = _this.setTime(s);
            _this.timepiece.minute = _this.setTime(m);
            _this.timepiece.hour = _this.setTime(h);
            this.timeClock = setInterval(function() {
                // s++;
                _this.timepiece.second = _this.setTime(s);
                if (s === 0 && m !== 0 && h !== 0) {
                    s = 59;
                    m--;
                    _this.timepiece.minute = _this.setTime(m);
                };
                if (m === 0 && h !== 0) {
                    m = 59;
                    h--;
                    _this.timepiece.hour = _this.setTime(h);
                };
                if (s === 0 && m === 0 && h === 0) {
                    _this.$message({
                        type: 'info',
                        message: '您的录制时间已用完，请充值后继续录屏'
                    });
                    stopvnc().then(res => {
                        console.log('录制时间不足，停止录屏了', res);
                    });
                    _this.forensicsStatus.begin = 0;
                    clearInterval(_this.timeClock);
                    clearInterval(_this.recordtimeClock);
                }
                s--;
                // console.log(h, m, s);
            }, 1000);
        },
        pollings() {
            let _this = this;
            let pollingInterval = setInterval(function() {
                polling(1).then(res => {
                    if (_this.recordTime.minute === 57 && _this.recordTime.second === 1) {
                        let note = new Notification('由于存储限制，您的录制将在三分钟后自动结束录屏!');
                        console.log(note);
                        _this.$confirm('由于存储限制，录制时间上限为1个小时，您的录制将在三分钟后自动结束录屏!', '提示', {
                            confirmButtonText: '确定',
                            closeOnClickModal: true,
                            type: 'warning'
                        }).then(() => {
                            // _this.pauseForensics();
                            // _this.$message({
                            //     type: 'info',
                            //     message: '由于存储限制，录制将在1个小时后自动结束!'
                            // });
                        });
                    }
                    if (_this.recordTime.hour === 1) {
                        clearInterval(_this.timeClock);
                        clearInterval(_this.recordtimeClock);
                        clearInterval(_this.pollingInterval);
                        clearInterval(_this.queueInterval);
                        stopvnc().then(res => {
                            _this.forensicsStatus.begin = 0;
                            _this.endForensicsStatus = true;
                            _this.queueStatus = false;
                            clearInterval(_this.timeClock);
                            clearInterval(_this.recordtimeClock);
                            clearInterval(_this.pollingInterval);
                            clearInterval(_this.queueInterval);
                            this.$message({
                                type: 'success',
                                message: '取证成功'
                            });
                            console.log(res);
                        });
                    }
                    console.log(res, '轮询成功');
                    return checkallocation();
                }, rej => {
                    console.log('轮询失败', rej);
                    // _this.$message({
                    //     type: 'error',
                    //     message: rej.info
                    // });
                    if (rej.error === 3000005) {
                        _this.forensicsStatus.begin = 0;
                        // _this.endForensicsStatus = true;
                        clearInterval(pollingInterval);
                    }
                    if (rej.error === 3000004) {
                        _this.$confirm('当前记录异常，是否结束录屏?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            closeOnClickModal: true,
                            type: 'warning'
                        }).then(() => {
                            // let _this = this;
                            return polling(2);
                        }).then(res => {
                            console.log('轮询2的成功结束录屏', res);
                        }, rej => {
                            console.log('轮询2的失败结果', rej);
                            if (rej.error === 3000005) {
                                _this.forensicsStatus.begin = 0;
                                // _this.endForensicsStatus = true;
                                clearInterval(pollingInterval);
                                _this.$message({
                                    type: 'error',
                                    message: rej.info
                                });
                            };
                        }).catch(() => {
                            _this.$message({
                                type: 'info',
                                message: '已取消结束录屏'
                            });
                        });
                    } else {
                        clearInterval(pollingInterval);
                    }
                }).then(res => {
                    _this.userInfo = res.data.user_detail;
                    // if (_this.userInfo.balance <= 3 && _this.userInfo.balance >= 3.99) {
                    //     let note = new Notification('您的账户余额即将耗尽，录制将在三分钟后自动结束!');
                    //     console.log(note);
                    //     _this.$confirm('您的账户余额即将耗尽，录制将在三分钟后自动结束！', '提示', {
                    //         confirmButtonText: '确定',
                    //         closeOnClickModal: true,
                    //         type: 'warning'
                    //     });
                    // }
                    console.log('余额是：', _this.userInfo.balance);
                    if (_this.userInfo.balance <= 3 && _this.userInfo.balance >= 2.99) {
                        let note = new Notification('您的账户余额即将耗尽，录制将在三分钟后自动结束!');
                        console.log(note);
                        _this.$confirm('您的账户余额即将耗尽，录制将在三分钟后自动结束！', '提示', {
                            confirmButtonText: '确定',
                            closeOnClickModal: true,
                            type: 'warning'
                        });
                    }
                    if (_this.userInfo.balance <= 0) {
                        console.log('停止余额不足');
                        stopvnc().then(res => {
                            _this.forensicsStatus.begin = 0;
                            _this.endForensicsStatus = true;
                            _this.queueStatus = false;
                            clearInterval(_this.timeClock);
                            clearInterval(_this.recordtimeClock);
                            clearInterval(_this.pollingInterval);
                            clearInterval(_this.queueInterval);
                            this.$message({
                            type: 'success',
                            message: '取证成功'
                            });
                            console.log(res);
                        }, rej => {
                            clearInterval(this.pollingInterval);
                            this.$message({
                            type: 'error',
                            message: rej.info
                            });
                            console.error(rej);
                        });
                    }
                });
            }, 1000);
            this.pollingInterval = pollingInterval;
        },
        back() {
            this.forensicsStatus.begin = 0;
            this.endForensicsStatus = false;
        }
    },
    components: {
        top,
        panelTitle,
        bottom,
        noticeforUse
    }
};
</script>
<style lang="scss">
    @import url('../../../common/scss/index.scss');
    .wrap{
        // height: 800px;
        .top{
            height: 70px;
        }
        .content{
            .iframe{
                min-height: calc(100vh - 140px);
                // min-height: calc(100vh);
            }
        }
        .footer{
            height: 70px;
            background-color: #0D1017;
            opacity: 0.95;
            .play{
            flex: 1;
            // border: 1px solid red;
            padding-top: 13px;
            cursor: pointer;
            h1 {
                margin-top: 2px;
            }
            img {
                width: 25px;
                height: 25px;
            }
        }
        .screenshot{
            flex: 1;
            padding-top: 10px;
            cursor: pointer;
            img {
                    width: 30px;
                    height: 30px;
                }
        }
        .time{
            flex: 6;
            line-height: 70px;
            padding-right: 50px;
        }
        }
        .endForensics{
            .word{
                color: #191F25;
                margin-top: 30px;
                line-height: 25px;
            }
            .button{
                margin-top: 30px;
                .beginForensics{
                    margin-right: 30px;
                }
            }
        }
        .environment{
            .icon{
                width: 60px;
                height: 60px;
                margin: 10px 0;
            }
            p{
                padding-bottom: 20px;
            }
        }
        .btn{
            width:120px;
            margin: 0 20px;
        }
    }
</style>


