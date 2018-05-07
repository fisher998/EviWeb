<template>
    <div class="login-content">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="登录" name="login" class="loginPanel">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item prop="mobile" :error="loginErrors.cell_phone">
                        <el-input name="mobile"
                                  type="text"
                                  autoComplete="off"
                                  :maxlength="11"
                                  v-model="loginForm.mobile"
                                  placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" :error="loginErrors.password">
                        <el-input type="password" v-if="pwdType"
                                  @keyup.enter.native="handleLogin"
                                  autoComplete="off"
                                  name="password"
                                  v-model="loginForm.password"
                                  :maxlength="20"
                                  placeholder="密码"></el-input>
                        <el-input name="password" type="text" v-else
                                  @keyup.enter.native="handleLogin"
                                  autoComplete="off"
                                  v-model="loginForm.password"
                                  :maxlength="20"
                                  placeholder="密码"></el-input>
                        <span class="pwdEye" @mousedown.stop="pwdType = !pwdType"
                              @mouseup="pwdType = !pwdType" :class="pwdType?'hide-pwd':'show-pwd'"></span>
                    </el-form-item>
                    <div class="forget-pass"><span @click="forgetPwd">忘记密码</span></div>
                    <el-form-item>
                        <el-button type="primary" class="login-btn" v-waves.button :loading="loginLoading"
                                   @click.native.prevent="handleLogin">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register" class="registerPanel">
                <el-form class="el-from" :model="signupForm" :rules="signupRules" ref="signupForm">
                    <el-form-item prop="mobile" :error="registerErrors.mobile">
                        <div class="input-wrapper">
                            <el-input type="text" name="mobile" v-model="signupForm.mobile" :maxlength="11"
                                      placeholder="手机号"></el-input>
                            <span class="flag"></span>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" name="password" v-model="signupForm.password"
                                  :maxlength="20"
                                  placeholder="密码"></el-input>
                        <span class="flag"></span>
                    </el-form-item>
                    <el-form-item prop="graph_code" :error="registerErrors.graph_code">
                        <div class="verify-content">
                            <div class="input-wrapper" style="width: 62%;">
                                <el-input type="text" name="graph_code"
                                          v-model="signupForm.graph_code"
                                          :maxlength="4"
                                          placeholder="验证码"></el-input>
                                <!--<span class="flag"></span>-->
                            </div>
                            <div class="verifyCode-wrapper">
                                <img ref="verifyCode" width="80px" height="36"
                                     @click="refresh"
                                     :src="'https://api.51zbb.net/web/graphics/code/get?ignore=1&key='+key"
                                     alt="验证码">
                            </div>
                            <!--<div class="refresh" @click="refresh">刷新</div>-->
                        </div>
                    </el-form-item>
                    <el-form-item prop="verify_code">
                        <div class="code-wrapper">
                            <div class="input-wrapper fl" style="width: 62%;">
                                <el-input type="text" class="" name="verify_code"
                                          v-model="signupForm.verify_code"
                                          :maxlength="4"
                                          placeholder="手机验证码"></el-input>
                                <span class="flag"></span>
                            </div>
                            <el-button type="primary" size="small" class="getCode-btn fr" @click="sendCode"
                                       :disabled="time > 0">{{text}}
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item class="tc">
                        <el-button type="primary" class="register-btn" v-waves.button
                                   :loading="signupLoading"
                                   @click.native.prevent="handleSignup">注册
                        </el-button>
                        <div class="agree">点击注册即为同意证宝宝
                            <router-link to="protocal" target="_blank">服务协议</router-link>
                        </div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <!-- -->
        <!--<prompt :show.sync="show" @open="open"></prompt>-->
    </div>
</template>

<script>
    import {isValidPass, isValidMobile} from '../../utils/validate';
    import {getRandomNum} from '../../utils/index';
    import {sendMobileCode} from '../../api/register';
    import {mapActions} from 'vuex';
    import Prompt from './prompt';
    //    import {resetPwd} from '../../api/login';
    //    const ERR_OK = 0;

    export default {
        name: 'login',
        data() {
            // 验证图形验证码输入是否正确
            const validateGraph = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入图形验证码'));
                } else if (value.length !== 4) {
                    callback(new Error('验证码为四位数字'));
                } else {
                    callback();
                }
            };
            // 验证手机号格式是否正确
            const validateMobile = (rule, value, callback) => {
                let oFlag0 = document.querySelectorAll('.flag')[0];
                if (!isValidMobile(value)) {
                    callback(new Error('手机号码有误，请重新输入'));
                    oFlag0.classList.add('error');
                } else {
                    oFlag0.classList.remove('error');
                    oFlag0.classList.add('right');
                    callback();
                }
            };
            // 验证手机号格式是否正确
            const validateLoginMobile = (rule, value, callback) => {
                if (!isValidMobile(value)) {
                    callback(new Error('手机号码有误，请重新输入'));
                } else {
                    callback();
                }
            };
            // 密码必须为数字、字母组合、不少于6位
            const validatePass = (rule, value, callback) => {
                let oFlag1 = document.querySelectorAll('.flag')[1];
                if (value.length < 6 || !isValidPass(value)) {
                    callback(new Error('密码必须是英文和数字组合且不小于6位'));
                    oFlag1.classList.add('error');
                } else {
                    callback();
                    oFlag1.classList.remove('error');
                    oFlag1.classList.add('right');
                }
            };
            return {
                loginForm: {
                    mobile: '',
                    password: ''
                },
                loginRules: {
                    mobile: [
                        {required: true, trigger: 'change', message: '请输入手机号'},
                        {whitespace: true, trigger: 'change', message: '请输入手机号'},
                        {validator: validateLoginMobile, trigger: 'change', message: '手机号格式错误'}
                    ],
                    password: [
                        {required: true, trigger: 'change', message: '请输入密码'},
                        {whitespace: true, trigger: 'change', message: '请输入密码'}
                    ]
                },
                signupForm: {
                    mobile: '',
                    password: '',
                    graph_code: '',
                    verify_code: ''
                },
                signupRules: {
                    mobile: [
                        {required: true, trigger: 'blur', message: '请输入手机号'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, trigger: 'blur', message: '请输入密码'},
                        {trigger: 'blur', validator: validatePass}
                    ],
                    graph_code: [
                        {validator: validateGraph, trigger: 'blur'}
                    ],
                    verify_code: [
                        {required: true, trigger: 'blur', message: '请输入手机验证码'},
                        {len: 4, trigger: 'blur', message: '手机验证码为4位'}
                    ]
                },
                loginErrors: {
                    cell_phone: '',
                    password: ''
                },
                registerErrors: {
                    graph_code: '',
                    mobile: ''
                },
                activeName: 'login',
                loginLoading: false,
                signupLoading: false,
                pwdType: true,
                time: 0,
                startTime: 60,
                key: '',
                show: false
            };
        },
        computed: {
            text() {
                return this.time > 0 ? `重新发送(${this.time})` : '获取验证码';
            }
        },
        created() {
            this.key = getRandomNum();
        },
        methods: {
            // 点击登录
            handleLogin() {
                this.$refs.loginForm.validate((valid) => {
                    this.loginErrors.cell_phone = '';
                    this.loginErrors.password = '';
                    if (valid) {
                        this.loginLoading = true;
                        this.$store.dispatch('LoginByMobile', this.loginForm)
                            .then((res) => {
                                switch (res) {
                                    case 0:
                                        this.loginLoading = false;
//                                        this.show = true;
                                        this.$router.push('/');
                                        this.GetNoticeCount();
                                        break;
                                    case 30009:
                                        this.loginLoading = false;
                                        this.loginErrors.cell_phone = '该用户不存在';
                                        break;
                                    case 30010:
                                        this.loginLoading = false;
                                        this.loginErrors.password = '密码错误';
                                        break;
                                    case 30011:
                                        this.loginLoading = false;
                                        this.$message({
                                            message: '帐号被冻结',
                                            type: 'error',
                                            showClose: true
                                        });
                                        break;
                                    default:
                                }
                            })
                            .catch(() => {
                                this.loading = false;
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 点击用户注册
            handleSignup() {
                this.$refs.signupForm.validate((valid) => {
                    if (valid) {
                        this.signupLoading = true;
                        this.$store.dispatch('Register', this.signupForm)
                            .then(res => {
                                if (res === 0) {
                                    this.$message({
                                        message: '注册成功,现在为您自动登录',
                                        type: 'success',
                                        showClose: true
                                    });
                                    this.signupLoading = false;
//                                    this.show = true;
                                    setTimeout(() => {
                                        this.$router.push('/');
                                        this.GetNoticeCount();
                                    }, 800);
                                } else if (res === 30007) {
                                    this.$message({
                                        message: '手机验证码验证失败',
                                        type: 'error',
                                        showClose: true
                                    });
                                    this.signupLoading = false;
                                } else if (res === 30005) {
                                    this.$message({
                                        message: '手机号已经被注册',
                                        type: 'error',
                                        showClose: true
                                    });
                                    this.signupLoading = false;
                                } else {
                                    this.signupLoading = false;
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 刷新验证码
            refresh() {
                this.key = getRandomNum();
                this.$refs.verifyCode.src = '/graphics/code/get?ignore=1&key=' + this.key;
            },
            // 发送手机验证码
            sendCode() {
                this.$refs.signupForm.validateField('mobile', error => {
                    if (!error) {
                        this.$refs.signupForm.validateField('graph_code', error => {
                            if (!error) {
                                this.registerErrors.graph_code = '';
                                this.registerErrors.mobile = '';
                                sendMobileCode(this.signupForm.mobile, this.signupForm.graph_code, this.key)
                                    .then(res => {
                                        // 错误代码
                                        const errno = res.data.error;
                                        if (errno === 0) {
                                            this.start(); // 开始60秒倒计时
                                        } else if (errno === 30001) {
                                            this.$message({
                                                message: '短信验证码发送失败',
                                                type: 'warning',
                                                showClose: true
                                            });
                                            this.signupForm.graph_code = '';
                                            this.refresh();
                                        } else if (errno === 30004) {
                                            this.$message({
                                                message: '24小时内发送短信数目超过限制',
                                                type: 'warning',
                                                showClose: true
                                            });
                                            this.signupForm.graph_code = '';
                                            this.refresh();
                                        } else if (errno === 30005) {
                                            this.registerErrors.mobile = '该手机号已被注册';
                                            this.signupForm.graph_code = '';
                                            this.refresh();
                                        } else if (errno === 30016) {
                                            this.registerErrors.graph_code = '验证码输入有误';
                                            this.signupForm.graph_code = '';
                                            this.refresh();
                                        } else {
                                            this.$message({
                                                message: '发生未知错误',
                                                type: 'error',
                                                showClose: true
                                            });
                                            this.signupForm.graph_code = '';
                                            this.refresh();
                                        }
                                    });
                            } else {
                                return false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 切换tab时重置表单
            handleTabClick(tab) {
                if (tab.name === 'login') {
                    this.$refs.signupForm.resetFields();
                    let oFlag0 = document.querySelectorAll('.flag')[0];
                    let oFlag1 = document.querySelectorAll('.flag')[1];
                    oFlag0.classList.remove('error');
                    oFlag0.classList.remove('right');
                    oFlag1.classList.remove('error');
                    oFlag1.classList.remove('right');
                }
                if (tab.name === 'register') {
                    this.$refs.loginForm.resetFields();
                }
            },
            open() {
                this.$router.push('/');
                this.GetNoticeCount();
            },
            start() {
                this.time = this.startTime;
                this.timer();
            },
            timer() {
                if (this.time > 0) {
                    this.time--;
                    setTimeout(this.timer, 1000);
                }
            },
            forgetPwd() {
                this.$router.push('/login/findpwd');
            },
            ...mapActions([
                'GetNoticeCount'
            ])
        },
        components: {
            Prompt
        }
    };
</script>

<style lang="scss">
    .login-content {
        box-sizing: border-box;
        padding: 42px 78px 0;
        .el-tab-pane {
            margin-top: 16px;
            .el-input__inner {
                border-top: none;
                border-left: none;
                border-right: none;
                border-radius: 0;
            }
        }
        .loginPanel {
            text-align: center;
            .forget-pass {
                text-align: right;
                & > span {
                    color: #1D8CE0;
                    cursor: pointer;
                }
            }
            .login-btn {
                width: 100%;
                padding: 12px 0;
                margin-top: 40px;
            }
            .pwdEye {
                position: absolute;
                right: 0;
                top: 15px;
                width: 20px;
                height: 10px;
                cursor: pointer;
                transition: all .3s ease;
            }
            .show-pwd {
                background: url("./eye_show.png") no-repeat 0 0;
            }
            .hide-pwd {
                background: url("./eye_hide.png") no-repeat 0 0;
            }
        }
        .registerPanel {
            .code-wrapper {
                display: flex;
                justify-content: space-between;
            }
            .input-wrapper {
                position: relative;
            }
            .flag {
                position: absolute;
                z-index: 99;
                top: 9px;
                right: 0;
                width: 22px;
                height: 22px;
                margin-right: -1px;
                /*transition: all .3s ease;*/
            }
            .right {
                background: url("./reg_icons.png") no-repeat 0 0;
            }
            .error {
                background: url("./reg_icons.png") no-repeat 0 -24px;
            }
            .refresh {
                color: #1D8CE0;
                cursor: pointer;
                margin-top: 3px;
            }
            .register-btn {
                width: 100%;
                padding: 12px 0;
                margin-top: 20px;
            }
            .verify-content {
                display: flex;
                justify-content: space-between;
                .verifyCode-wrapper {
                    width: 80px;
                    height: 28px;
                    text-align: center;
                    cursor: pointer;
                }
            }
            .getCode-btn {
                margin-left: 7px;
                margin-top: 5px;
            }
            .agree {
                font-size: 12px;
                color: #999;
                & > a {
                    color: #1D8CE0;
                    cursor: pointer;
                }
            }
        }
    }
</style>
