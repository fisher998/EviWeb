<template>
    <div class="robot">
        <panelTitle :title="title" :border-color="borderColor"></panelTitle>
        <div class="user-container">
            <div class="position">
                <div class="avatar-wrapper">
                    <!-- <img class="avatar" :src="avatar" alt="默认头像"> -->
                    <h1 class="h1 f16">"证宝宝"智能取证机器人可以提供可信的执行环境，方便快捷地实现远程自助取证，最大限度地保证证据的法律效力。</h1>
                </div>
                <!-- <div class="username">(+{{area_code}}) {{cell_phone}}</div> -->
                <!-- <el-button type="primary" class="el-button" @click="handleModifyPass()">修改密码</el-button> -->
                <!-- <el-button type="primary" size="large" class="el-button" @click="goRobot()">开始使用</el-button> -->
                <div class="btn">
                    <router-link to="/robotBegin" target="_blank" class="el-button">
                        <h1 class="f16 color-white">开始使用</h1>
                    </router-link>
                </div>
                <!-- <div class="btn">
                    <el-input v-model="hash"></el-input>
                    <button type="primary" @click="signs">签名</button>
                </div> -->
            </div>

        </div>
    </div>
</template>
<script>
    import panelTitle from '../PanelTitle/PanelTitle';
    // import {getCookie} from '../../utils/auth';
    // import * as modify from '../../api/modify';
    import {mapGetters} from 'vuex';
    import countDown from '../CountDown/CountDown';
    // import {cert, sign} from '../../api/robot/cert.js';
    // import {login} from '../../api/robot/detail.js';
    // import {checkallocation} from '../../api/robot/detail.js';
    export default {
        created() {
            this.certs();
        },
        data () {
            return {
                title: '智能取证机器人',
                borderColor: '#427DFF',
                hash: ''
            };
        },
        computed: {
            ...mapGetters([
                'area_code',
                'cell_phone',
                'avatar'
            ]),
            text () {
                return this.time > 0 ? `重新发送(${this.time})` : '获取验证码';
            }
        },
        methods: {
            goRobot() {
                this.$router.push({path: '/robotBegin', target: '_blank'});
            }
            // certs() {
            //     cert().then(res => {
            //         console.log(res);
            //         // let params = {
            //         //     'signed_hash': res.hash
            //         // };
            //         // return sign(params);
            //     });
            // },
            // signs() {
            //     let params = {
            //         'signed_hash': this.hash
            //     };
            //     sign(params).then(res => {
            //         console.log(res);
            //     });
            // }
        },
        components: {
            panelTitle,
            countDown
        }
    };
</script>

<style lang="scss">
    @import url('../../common/scss/base.scss');
    .robot {
        box-sizing: border-box;
        .el-dialog {
            width: 400px;
        }
        .user-container {
            width: 100%;
            min-height: calc(100vh - 142px);
            background: #fff;
            text-align: center;
            line-height: 100px;
            // position: relative;
            display: flex;
            justify-content:center;
            align-items:center;
            .position{
                .avatar-wrapper {
                    text-align: center;
                    .avatar {
                        width: 120px;
                        border: 1px solid #efefef;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                    .h1{
                        color: #333333;
                    }
                }
                .btn{
                    display: flex;
                    justify-content:center;
                    .el-button {
                        display: block;
                        width: 200px;
                        height: 60px;
                        border: none;
                        background-color: #306ffc;
                        line-height: 40px;
                    }
                }
            }
        }
        .phone-dialog {
            .el-row {
                padding: 10px 0;
            }
            .mt-10 {
                margin-top: -10px;
            }
            .el-dialog__body {
                padding: 30px 40px;
            }
        }
        .newPhone-wrapper {
            .el-input {
                width: 65%;
            }
        }
        .success-wrapper {
            text-align: center;
            .tip {
                margin-top: 20px;
            }
            .el-button {
                margin-top: 20px;
            }
        }
    }
</style>
